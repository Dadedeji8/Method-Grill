import React from 'react';
import { AuthProvider } from './AuthContext';
import { MenuProvider } from './MenuContext';
import { ThemeProvider } from './ThemeContext';

export const AppContextProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MenuProvider>
          {children}
        </MenuProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
