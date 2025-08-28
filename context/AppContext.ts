
import { createContext } from 'react';
import { Page } from '../types';

export interface User {
    username: string;
    email: string;
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
        tagline: "Helping Citizens Solve Problems Faster.",
        loginSignUp: "Login / Sign Up",
        reportIssue: "Report an Issue",
        askQuestion: "Ask a Question",
        language: "Language",
        dashboard: "Dashboard",
        myReports: "My Reports",
        aiChat: "AI Chat",
        typeYourQuestion: "Type your question or report an issue...",
        send: "Send",
        logout: "Logout",
        highContrast: "High Contrast",
        fontSize: "Font Size",
        welcome: "Welcome",
    },
    es: {
        appName: "Asistente de Gobierno IA",
        tagline: "Ayudando a los Ciudadanos a Resolver Problemas Más Rápido.",
        loginSignUp: "Iniciar Sesión / Registrarse",
        reportIssue: "Reportar un Problema",
        askQuestion: "Hacer una Pregunta",
        language: "Idioma",
        dashboard: "Panel de Control",
        myReports: "Mis Reportes",
        aiChat: "Chat de IA",
        typeYourQuestion: "Escriba su pregunta o reporte un problema...",
        send: "Enviar",
        logout: "Cerrar Sesión",
        highContrast: "Alto Contraste",
        fontSize: "Tamaño de Fuente",
        welcome: "Bienvenido",
    },
     fr: {
        appName: "Assistant Gouvernemental IA",
        tagline: "Aider les Citoyens à Résoudre les Problèmes Plus Rapidement.",
        loginSignUp: "Connexion / Inscription",
        reportIssue: "Signaler un Problème",
        askQuestion: "Poser une Question",
        language: "Langue",
        dashboard: "Tableau de Bord",
        myReports: "Mes Rapports",
        aiChat: "Chat IA",
        typeYourQuestion: "Tapez votre question ou signalez un problème...",
        send: "Envoyer",
        logout: "Déconnexion",
        highContrast: "Contraste Élevé",
        fontSize: "Taille de la Police",
        welcome: "Bienvenue",
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
}

export const AppContext = createContext<AppContextType | null>(null);
   