
import React, { useContext } from 'react';
import { AppContext, AppContextType } from '../context/AppContext';
import { Page } from '../types';
import { DocumentTextIcon, QuestionMarkCircleIcon } from './icons/Icons';

const HomePage: React.FC = () => {
    const { setCurrentPage, translations } = useContext(AppContext) as AppContextType;

    return (
        <div className="text-center">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-extrabold text-brand-primary dark:text-white mb-4">
                    {translations.appName}
                </h2>
                <p className="text-lg md:text-xl text-text-secondary dark:text-gray-300 mb-8">
                    {translations.tagline}
                </p>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-12">
                <button
                    onClick={() => setCurrentPage(Page.Auth)}
                    className="w-full md:w-auto flex items-center justify-center gap-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-4 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                    <DocumentTextIcon className="h-6 w-6" />
                    <span>{translations.reportIssue}</span>
                </button>
                <button
                    onClick={() => setCurrentPage(Page.Auth)}
                    className="w-full md:w-auto flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                    <QuestionMarkCircleIcon className="h-6 w-6" />
                    <span>{translations.askQuestion}</span>
                </button>
            </div>
            <div className="mt-16 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                 <h3 className="text-2xl font-bold text-brand-secondary dark:text-brand-light mb-4">How It Works</h3>
                 <div className="grid md:grid-cols-3 gap-8 text-left">
                     <div className="flex flex-col items-center text-center">
                        <div className="bg-brand-light dark:bg-brand-secondary p-4 rounded-full mb-4">
                            <span className="text-2xl font-bold text-brand-primary dark:text-white">1</span>
                        </div>
                        <h4 className="font-semibold text-lg mb-2">Sign Up Securely</h4>
                        <p className="text-text-secondary dark:text-gray-400">Create your account to get started. Your data is always protected.</p>
                     </div>
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-brand-light dark:bg-brand-secondary p-4 rounded-full mb-4">
                             <span className="text-2xl font-bold text-brand-primary dark:text-white">2</span>
                        </div>
                        <h4 className="font-semibold text-lg mb-2">Describe Your Issue</h4>
                        <p className="text-text-secondary dark:text-gray-400">Use our AI chat to ask a question or report a problem in your own language.</p>
                     </div>
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-brand-light dark:bg-brand-secondary p-4 rounded-full mb-4">
                            <span className="text-2xl font-bold text-brand-primary dark:text-white">3</span>
                        </div>
                        <h4 className="font-semibold text-lg mb-2">Get Instant Help</h4>
                        <p className="text-text-secondary dark:text-gray-400">Our AI provides immediate guidance and tracks your reports for you.</p>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default HomePage;
   