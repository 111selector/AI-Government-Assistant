
import React, { useContext } from 'react';
import { AppContext, AppContextType } from '../context/AppContext';
import { SunIcon, MoonIcon, MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon } from './icons/Icons';


const AccessibilityControls: React.FC = () => {
    const { isHighContrast, setIsHighContrast, fontSize, setFontSize, translations } = useContext(AppContext) as AppContextType;

    const fontSizes = ['sm', 'base', 'lg', 'xl'];

    const changeFontSize = (direction: 'increase' | 'decrease') => {
        const currentIndex = fontSizes.indexOf(fontSize);
        if (direction === 'increase' && currentIndex < fontSizes.length - 1) {
            setFontSize(fontSizes[currentIndex + 1]);
        }
        if (direction === 'decrease' && currentIndex > 0) {
            setFontSize(fontSizes[currentIndex - 1]);
        }
    };
    
    return (
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md p-1 border dark:border-gray-600">
            <button
                onClick={() => setIsHighContrast(!isHighContrast)}
                className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label={translations.highContrast}
                title={translations.highContrast}
            >
                {isHighContrast ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            <div className="w-px h-5 bg-gray-300 dark:bg-gray-500 mx-1"></div>
            <button
                onClick={() => changeFontSize('decrease')}
                className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Decrease font size"
                title="Decrease font size"
            >
                <MagnifyingGlassMinusIcon className="h-5 w-5" />
            </button>
             <button
                onClick={() => changeFontSize('increase')}
                className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Increase font size"
                title="Increase font size"
            >
                <MagnifyingGlassPlusIcon className="h-5 w-5" />
            </button>
        </div>
    );
};

export default AccessibilityControls;
   