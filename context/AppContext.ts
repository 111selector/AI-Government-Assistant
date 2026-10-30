import { createContext } from 'react';
import { Page } from '../types';

export interface User {
    uid: string;
    username: string;
    email: string;
    provider: 'google.com' | 'microsoft.com' | 'instagram.com' | 'tiktok.com' | 'custom';
    photoURL?: string;
}

export const languages = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    hi: 'हिन्दी',
    zh: '中文',
    ar: 'العربية',
};

export const defaultTranslations: Record<string, Record<string, string>> = {
    en: {
        appName: "AI Government Assistant",
        tagline: "Helping Citizens Solve Problems Faster & Access Public Services.",
        loginSignUp: "Citizen Sign In",
        reportIssue: "Report an Issue",
        askQuestion: "Ask a Question",
        language: "Language",
        dashboard: "Citizen Dashboard",
        myReports: "My Private Reports",
        aiChat: "AI Public Assistant Chat",
        typeYourQuestion: "Type your civil question or describe your issue...",
        send: "Send",
        logout: "Sign Out",
        highContrast: "High Contrast",
        fontSize: "Font Size",
        welcome: "Welcome",
        selectProvider: "Sign in with your verified identity provider to access your secure government file and records.",
        signInGoogle: "Continue with Google",
        signInMicrosoft: "Continue with Microsoft",
        signInInstagram: "Continue with Instagram",
        signInTikTok: "Continue with TikTok",
        privateHistoryTitle: "Isolated & Encrypted Session History",
        privateHistoryDesc: "Your chat logs and requests are tied strictly to your authenticated account. No other citizen or user can view your history.",
        clearHistory: "Clear My Chat History",
        moderationAlert: "Inappropriate language, insults, or adult words are blocked to maintain civil discourse in public services.",
    },
    es: {
        appName: "Asistente de Gobierno IA",
        tagline: "Ayudando a los Ciudadanos a Resolver Problemas Más Rápido.",
        loginSignUp: "Iniciar Sesión",
        reportIssue: "Reportar un Problema",
        askQuestion: "Hacer una Pregunta",
        language: "Idioma",
        dashboard: "Panel de Control",
        myReports: "Mis Reportes Privados",
        aiChat: "Chat de IA Ciudadano",
        typeYourQuestion: "Escriba su pregunta o describa su problema...",
        send: "Enviar",
        logout: "Cerrar Sesión",
        highContrast: "Alto Contraste",
        fontSize: "Tamaño de Fuente",
        welcome: "Bienvenido",
        selectProvider: "Inicie sesión con su proveedor de identidad verificado para acceder a su expediente seguro.",
        signInGoogle: "Continuar con Google",
        signInMicrosoft: "Continuar con Microsoft",
        signInInstagram: "Continuar con Instagram",
        signInTikTok: "Continuar con TikTok",
        privateHistoryTitle: "Historial de Sesión Aislado y Seguro",
        privateHistoryDesc: "Sus registros y consultas están vinculados estrictamente a su cuenta. Ningún otro usuario puede ver su historial.",
        clearHistory: "Borrar Mi Historial",
        moderationAlert: "El lenguaje inapropiado, los insultos o palabras para adultos están bloqueados para mantener el respeto.",
    },
    fr: {
        appName: "Assistant Gouvernemental IA",
        tagline: "Aider les Citoyens à Résoudre les Problèmes Plus Rapidement.",
        loginSignUp: "Connexion Citoyenne",
        reportIssue: "Signaler un Problème",
        askQuestion: "Poser une Question",
        language: "Langue",
        dashboard: "Tableau de Bord Citoyen",
        myReports: "Mes Rapports Privés",
        aiChat: "Chat d'Assistance IA",
        typeYourQuestion: "Posez votre question ou décrivez votre problème...",
        send: "Envoyer",
        logout: "Déconnexion",
        highContrast: "Contraste Élevé",
        fontSize: "Taille de la Police",
        welcome: "Bienvenue",
        selectProvider: "Connectez-vous avec votre identifiant pour accéder à vos démarches sécurisées.",
        signInGoogle: "Continuer avec Google",
        signInMicrosoft: "Continuer avec Microsoft",
        signInInstagram: "Continuer avec Instagram",
        signInTikTok: "Continuer avec TikTok",
        privateHistoryTitle: "Historique Sécurisé et Isolé",
        privateHistoryDesc: "Vos messages et démarches sont strictement réservés à votre compte. Aucun autre citoyen n'a accès à votre historique.",
        clearHistory: "Effacer mon historique",
        moderationAlert: "Les insultes, mots inappropriés ou à caractère adulte sont bloqués.",
    },
};

export interface AppContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    language: string;
    setLanguage: (lang: string) => void;
    translations: Record<string, string>;
    isHighContrast: boolean;
    setIsHighContrast: (isHigh: boolean) => void;
    fontSize: string;
    setFontSize: (size: string) => void;
    authLoading: boolean;
}

export const AppContext = createContext<AppContextType | null>(null);