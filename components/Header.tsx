
import React, { useContext } from 'react';
import { AppContext, AppContextType } from '../context/AppContext';
import { Page } from '../types';
import LanguageSelector from './LanguageSelector';
import AccessibilityControls from './AccessibilityControls';
import { ShieldCheckIcon } from './icons/Icons';


const Header: React.FC = () => {
    const { user, logout, setCurrentPage, translations } = useContext(AppContext) as AppContextType;

    return (
        <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div 
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setCurrentPage(Page.Home)}
                >
                    <ShieldCheckIcon className="h-8 w-8 text-brand-primary dark:text-brand-light" />
                    <h1 className="text-xl md:text-2xl font-bold text-brand-primary dark:text-white">
                        {translations.appName}
                    </h1>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <AccessibilityControls />
                    <LanguageSelector />
                    {user ? (
                        <button
                            onClick={logout}
                            className="bg-brand-secondary hover:bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-300 text-sm"
                        >
                            {translations.logout}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentPage(Page.Auth)}
                            className="bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-300 text-sm"
                        >
                            {translations.loginSignUp}
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
   