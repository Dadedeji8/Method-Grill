import React, { useState, useRef, useCallback } from 'react';
import { uploadImageToCloudinary, validateImageFile } from '../services/cloudinary';

const ImageUpload = ({
    onImageUpload,
    currentImage = null,
    placeholder = "Upload menu item image",
    className = ""
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errors, setErrors] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(currentImage);
    const fileInputRef = useRef(null);
    const dragCounter = useRef(0); // for smoother drag UI

    // Smooth circular progress math
    const radius = 15.9155;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference - (uploadProgress / 100) * circumference;

    const handleFileUpload = useCallback(async (file) => {
        if (isUploading) return; // prevent double uploads
        setErrors([]);

        // Validate file
        const validation = validateImageFile(file);
        if (!validation.isValid) {
            setErrors(validation.errors);
            setPreviewUrl(currentImage); // reset preview
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target.result);
        reader.readAsDataURL(file);

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const result = await uploadImageToCloudinary(file, (progress) => {
                setUploadProgress(progress);
            });

            if (result.success) {
                onImageUpload(result.url, result);
            } else {
                setErrors([result.error || 'Upload failed']);
                setPreviewUrl(currentImage);
            }
        } catch (err) {
            setErrors([err.message || 'Upload failed']);
            setPreviewUrl(currentImage);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    }, [isUploading, currentImage, onImageUpload]);

    const handleFileSelect = useCallback((e) => {
        const file = e.target.files[0];
        if (file) handleFileUpload(file);
    }, [handleFileUpload]);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current = 0;
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) handleFileUpload(files[0]);
    }, [handleFileUpload]);

    const handleRemoveImage = useCallback(() => {
        setPreviewUrl(null);
        setErrors([]);
        onImageUpload(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [onImageUpload]);

    const openFileDialog = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    return (
        <div className={`relative ${className}`}>
            <div
                className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${isDragging
                    ? 'border-primary bg-primary/5 scale-105'
                    : errors.length
                        ? 'border-red-300 bg-red-50/50'
                        : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50/50'
                    } ${isUploading ? 'pointer-events-none' : 'cursor-pointer'}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={openFileDialog}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {previewUrl ? (
                    <div className="relative group">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-2xl"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openFileDialog();
                                    }}
                                    className="px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    Change
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveImage();
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="mb-4">
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg font-semibold text-gray-900">
                                {isDragging ? 'Drop image here' : placeholder}
                            </p>
                            <p className="text-sm text-gray-500">Drag and drop or click to browse</p>
                            <p className="text-xs text-gray-400">JPEG, PNG, WebP up to 10MB</p>
                        </div>
                    </div>
                )}

                {isUploading && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4">
                                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                    <path
                                        className="text-gray-200"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        fill="none"
                                        d={`M18 2.0845a ${radius} ${radius} 0 0 1 0 31.831a ${radius} ${radius} 0 0 1 0 -31.831`}
                                    />
                                    <path
                                        className="text-primary"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeDasharray={`${circumference} ${circumference}`}
                                        strokeDashoffset={progressOffset}
                                        strokeLinecap="round"
                                        fill="none"
                                        d={`M18 2.0845a ${radius} ${radius} 0 0 1 0 31.831a ${radius} ${radius} 0 0 1 0 -31.831`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-sm font-semibold text-gray-900">
                                        {uploadProgress}%
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-900">Uploading...</p>
                        </div>
                    </div>
                )}
            </div>

            {errors.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <ul className="text-sm text-red-700 list-disc pl-5">
                            {errors.map((err, i) => (
                                <li key={i}>{err}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
