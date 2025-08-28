
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AppContext, defaultTranslations, User } from './context/AppContext';
import { Page } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import DashboardPage from './components/DashboardPage';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
    const [language, setLanguage] = useState<string>('en');
    const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
    const [fontSize, setFontSize] = useState<string>('base');

    useEffect(() => {
        const browserLang = navigator.language.split('-')[0];
        if (defaultTranslations[browserLang]) {
            setLanguage(browserLang);
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (isHighContrast) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isHighContrast]);
    
    useEffect(() => {
        const body = document.body;
        body.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
        body.classList.add(`text-${fontSize}`);
    }, [fontSize]);

    const login = useCallback((userData: User) => {
        setUser(userData);
        setCurrentPage(Page.Dashboard);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setCurrentPage(Page.Home);
    }, []);

    const translations = useMemo(() => {
        return defaultTranslations[language] || defaultTranslations['en'];
    }, [language]);
    
    const contextValue = useMemo(() => ({
        user,
        login,
        logout,
        currentPage,
        setCurrentPage,
        language,
        setLanguage,
        translations,
        isHighContrast,
        setIsHighContrast,
        fontSize,
        setFontSize,
    }), [user, login, logout, currentPage, language, translations, isHighContrast, fontSize]);
    
    const renderPage = () => {
        if (user) {
            return <DashboardPage />;
        }
        switch (currentPage) {
            case Page.Auth:
                return <AuthPage />;
            case Page.Home:
            default:
                return <HomePage />;
        }
    };

    return (
        <AppContext.Provider value={contextValue}>
            <div className={`flex flex-col min-h-screen font-sans bg-gray-50 dark:bg-high-contrast-bg dark:text-high-contrast-text transition-colors duration-300`}>
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                    {renderPage()}
                </main>
                <Footer />
            </div>
        </AppContext.Provider>
    );
};

export default App;
   