
import React, { useContext } from 'react';
import { AppContext, AppContextType } from '../context/AppContext';

const Footer: React.FC = () => {
    const { translations } = useContext(AppContext) as AppContextType;
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 py-6 text-center text-text-secondary dark:text-gray-400">
                <p>&copy; {currentYear} {translations.appName}. All Rights Reserved.</p>
                <div className="mt-2 space-x-4">
                    <a href="#privacy" className="hover:underline text-sm">Privacy Policy</a>
                    <a href="#terms" className="hover:underline text-sm">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
   