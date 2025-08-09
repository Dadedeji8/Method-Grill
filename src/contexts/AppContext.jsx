import React from 'react';
import { AuthProvider } from './AuthContext';
import { MenuProvider } from './MenuContext';

export const AppContextProvider = ({ children }) => {
  return (
    <AuthProvider>
      <MenuProvider>
        {children}
      </MenuProvider>
    </AuthProvider>
  );
};
