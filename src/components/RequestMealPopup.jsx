import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaWhatsapp } from 'react-icons/fa';

const RequestMealPopup = ({ isOpen, onClose, mealItem }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        quantity: 1,
        specialRequests: '',
        deliveryAddress: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleWhatsAppRequest = () => {
        const { name, phone, quantity, specialRequests, deliveryAddress } = formData;
        
        if (!name || !phone) {
            alert('Please fill in your name and phone number');
            return;
        }

        // Format the WhatsApp message
        const message = `🍽️ *MEAL REQUEST - Methods Grill*

📋 *Order Details:*
• Meal: ${mealItem?.name || 'Selected Item'}
• Price: ${mealItem?.price ? `₦${mealItem.price.toLocaleString()}` : 'Price on request'}
• Quantity: ${quantity}

👤 *Customer Information:*
• Name: ${name}
• Phone: ${phone}

${deliveryAddress ? `📍 *Delivery Address:*\n${deliveryAddress}\n\n` : ''}${specialRequests ? `📝 *Special Requests:*\n${specialRequests}\n\n` : ''}⏰ *Requested at:* ${new Date().toLocaleString()}

Please confirm availability and total cost. Thank you! 🙏`;

        // WhatsApp number (08022703470)
        const whatsappNumber = '2348022703470';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Close the popup
        onClose();
        
        // Reset form
        setFormData({
            name: '',
            phone: '',
            quantity: 1,
            specialRequests: '',
            deliveryAddress: ''
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Request Meal</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {mealItem?.name || 'Selected Item'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <IoClose className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Meal Info */}
                    {mealItem && (
                        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center gap-4">
                                {mealItem.featuredImage && (
                                    <img 
                                        src={mealItem.featuredImage} 
                                        alt={mealItem.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                )}
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {mealItem.name}
                                    </h3>
                                    <p className="text-primary font-bold">
                                        ₦{mealItem.price?.toLocaleString() || 'Price on request'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Request Form */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="+234 xxx xxx xxxx"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Quantity
                            </label>
                            <select
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Delivery Address
                            </label>
                            <textarea
                                name="deliveryAddress"
                                value={formData.deliveryAddress}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                placeholder="Enter your delivery address (optional)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Special Requests
                            </label>
                            <textarea
                                name="specialRequests"
                                value={formData.specialRequests}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                placeholder="Any special instructions or dietary requirements? (optional)"
                            />
                        </div>

                        {/* WhatsApp Notice */}
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FaWhatsapp className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-green-800 dark:text-green-200">
                                    WhatsApp Request
                                </span>
                            </div>
                            <p className="text-sm text-green-700 dark:text-green-300">
                                Your request will be sent via WhatsApp to our team. We'll confirm availability and provide the total cost including delivery.
                            </p>
                        </div>

                        <button
                            onClick={handleWhatsAppRequest}
                            className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <FaWhatsapp className="w-5 h-5" />
                            Send Request via WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestMealPopup;
