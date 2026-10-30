import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AppContext, defaultTranslations, User } from './context/AppContext';
import { Page } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import DashboardPage from './components/DashboardPage';
import { auth, onAuthStateChanged, signOut, db, handleFirestoreError, OperationType } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
    const [language, setLanguage] = useState<string>('en');
    const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
    const [fontSize, setFontSize] = useState<string>('base');

    // Sync Firebase Auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                const userDocRef = doc(db, 'users', fbUser.uid);
                let providerName: User['provider'] = 'google.com';

                const providerId = fbUser.providerData?.[0]?.providerId || '';
                if (providerId.includes('microsoft')) {
                    providerName = 'microsoft.com';
                } else if (providerId.includes('instagram')) {
                    providerName = 'instagram.com';
                } else if (providerId.includes('tiktok')) {
                    providerName = 'tiktok.com';
                } else if (providerId.includes('google')) {
                    providerName = 'google.com';
                }

                // Check stored simulated provider if present in sessionStorage
                const storedProvider = sessionStorage.getItem(`auth_provider_${fbUser.uid}`);
                if (storedProvider) {
                    providerName = storedProvider as User['provider'];
                }

                const displayName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Citizen';
                const email = fbUser.email || `${fbUser.uid.slice(0, 8)}@citizen.gov`;

                const userData: User = {
                    uid: fbUser.uid,
                    username: displayName,
                    email: email,
                    provider: providerName,
                    photoURL: fbUser.photoURL || undefined,
                };

                try {
                    const snap = await getDoc(userDocRef);
                    if (!snap.exists()) {
                        await setDoc(userDocRef, {
                            uid: fbUser.uid,
                            displayName: userData.username,
                            email: userData.email,
                            provider: userData.provider,
                            photoURL: userData.photoURL || '',
                            createdAt: new Date().toISOString(),
                            lastLoginAt: new Date().toISOString(),
                        });
                    } else {
                        await setDoc(userDocRef, {
                            lastLoginAt: new Date().toISOString(),
                        }, { merge: true });
                    }
                } catch (err) {
                    console.warn('Could not sync user document to Firestore:', err);
                }

                setUser(userData);
                setCurrentPage(Page.Dashboard);
            } else {
                setUser(null);
            }
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

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

    const logout = useCallback(async () => {
        if (user) {
            sessionStorage.removeItem(`auth_provider_${user.uid}`);
        }
        try {
            await signOut(auth);
        } catch (e) {
            console.error('Error signing out:', e);
        }
        setUser(null);
        setCurrentPage(Page.Home);
    }, [user]);

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
        authLoading,
    }), [user, login, logout, currentPage, language, translations, isHighContrast, fontSize, authLoading]);
    
    const renderPage = () => {
        if (authLoading) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                    <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-text-secondary dark:text-gray-300 font-medium">Securing connection to Government Portal...</p>
                </div>
            );
        }
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