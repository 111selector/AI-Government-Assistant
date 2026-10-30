import React, { useContext } from 'react';
import { AppContext, AppContextType } from '../context/AppContext';
import { Page } from '../types';
import {
    DocumentTextIcon,
    QuestionMarkCircleIcon,
    ShieldCheckIcon,
    GoogleIcon,
    MicrosoftIcon,
    InstagramIcon,
    TikTokIcon
} from './icons/Icons';

const HomePage: React.FC = () => {
    const { setCurrentPage, translations } = useContext(AppContext) as AppContextType;

    return (
        <div className="text-center">
            {/* Hero Section */}
            <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-brand-primary dark:text-blue-300 text-xs font-semibold mb-6">
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span>Official Single Sign-On Citizen Portal</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-brand-primary dark:text-white mb-4 tracking-tight">
                    {translations.appName}
                </h2>
                <p className="text-lg md:text-xl text-text-secondary dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                    {translations.tagline}
                </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                <button
                    onClick={() => setCurrentPage(Page.Auth)}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                >
                    <DocumentTextIcon className="h-5 w-5" />
                    <span>{translations.reportIssue}</span>
                </button>
                <button
                    onClick={() => setCurrentPage(Page.Auth)}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                >
                    <QuestionMarkCircleIcon className="h-5 w-5" />
                    <span>{translations.askQuestion}</span>
                </button>
            </div>

            {/* Supported Identity Providers Bar */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-text-secondary dark:text-gray-400">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Supported Identity Providers:</span>
                <div className="inline-flex items-center gap-1.5 font-medium">
                    <GoogleIcon className="w-4 h-4" />
                    <span>Google</span>
                </div>
                <div className="inline-flex items-center gap-1.5 font-medium">
                    <MicrosoftIcon className="w-4 h-4" />
                    <span>Microsoft</span>
                </div>
                <div className="inline-flex items-center gap-1.5 font-medium">
                    <InstagramIcon className="w-4 h-4" />
                    <span>Instagram</span>
                </div>
                <div className="inline-flex items-center gap-1.5 font-medium">
                    <TikTokIcon className="w-4 h-4" />
                    <span>TikTok</span>
                </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="mt-14 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-brand-secondary dark:text-brand-light mb-8">
                    Modern Public Service Architecture
                </h3>
                <div className="grid md:grid-cols-3 gap-8 text-left">
                    <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                        <div className="bg-brand-light dark:bg-blue-900/40 p-4 rounded-2xl mb-4 text-brand-primary dark:text-blue-400">
                            <ShieldCheckIcon className="w-8 h-8" />
                        </div>
                        <h4 className="font-bold text-lg mb-2 text-text-primary dark:text-white">Strict Account Isolation</h4>
                        <p className="text-sm text-text-secondary dark:text-gray-400">
                            No citizen can ever see another citizen's records. Your chat history, reports, and inquiries remain private to your authenticated identity.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                        <div className="bg-brand-light dark:bg-blue-900/40 p-4 rounded-2xl mb-4 text-brand-primary dark:text-blue-400">
                            <span className="text-2xl font-bold">🛡️</span>
                        </div>
                        <h4 className="font-bold text-lg mb-2 text-text-primary dark:text-white">Safe & Civil Discourse</h4>
                        <p className="text-sm text-text-secondary dark:text-gray-400">
                            Built-in automated moderation filters out insults, abusive words, and adult content in real time to uphold civil public administration standards.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                        <div className="bg-brand-light dark:bg-blue-900/40 p-4 rounded-2xl mb-4 text-brand-primary dark:text-blue-400">
                            <span className="text-2xl font-bold">⚡</span>
                        </div>
                        <h4 className="font-bold text-lg mb-2 text-text-primary dark:text-white">Instant AI Civic Guidance</h4>
                        <p className="text-sm text-text-secondary dark:text-gray-400">
                            Get immediate, reliable answers in your preferred language about administrative procedures, public works, regulations, and local services.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;