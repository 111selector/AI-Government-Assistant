
import React, { useContext } from 'react';
import { AppContext, AppContextType, languages } from '../context/AppContext';
import { LanguageIcon } from './icons/Icons';

const LanguageSelector: React.FC = () => {
    const { language, setLanguage } = useContext(AppContext) as AppContextType;

    return (
        <div className="relative">
            <LanguageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent"
                aria-label="Select language"
            >
                {Object.entries(languages).map(([code, name]) => (
                    <option key={code} value={code}>
                        {name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;
   