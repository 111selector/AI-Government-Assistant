
import React, { useState, useContext } from 'react';
import { AppContext, AppContextType } from '../context/AppContext';
import { UserIcon, LockClosedIcon, EnvelopeIcon } from './icons/Icons';

type AuthMode = 'login' | 'signup' | 'forgot';

const AuthPage: React.FC = () => {
    const { login } = useContext(AppContext) as AppContextType;
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (mode === 'login') {
            if (!email || !password) {
                setError('Please enter email and password.');
                return;
            }
            // Mock login
            console.log('Logging in with:', { email, password });
            login({ username: email.split('@')[0], email });
        } else if (mode === 'signup') {
            if (!email || !username || !password) {
                setError('Please fill all fields.');
                return;
            }
            // Mock signup and login
            console.log('Signing up with:', { email, username, password });
            login({ username, email });
        } else { // forgot password
            if (!email) {
                setError('Please enter your email address.');
                return;
            }
            console.log('Password reset for:', email);
            setSuccess('If an account exists for this email, a reset link has been sent.');
        }
    };
    
    const AuthFormHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-brand-primary dark:text-white">{title}</h2>
            <p className="text-text-secondary dark:text-gray-400 mt-2">{subtitle}</p>
        </div>
    );

    const renderForm = () => {
        switch (mode) {
            case 'signup':
                return (
                    <>
                        <AuthFormHeader title="Create Account" subtitle="Join to access government services instantly." />
                        <div className="relative mb-4">
                            <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-brand-accent focus:outline-none" />
                        </div>
                        <div className="relative mb-4">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-brand-accent focus:outline-none" />
                        </div>
                        <div className="relative mb-6">
                            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-brand-accent focus:outline-none" />
                        </div>
                    </>
                );
            case 'forgot':
                return (
                    <>
                        <AuthFormHeader title="Reset Password" subtitle="Enter your email to receive a reset link." />
                        <div className="relative mb-6">
                            <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-brand-accent focus:outline-none" />
                        </div>
                    </>
                );
            case 'login':
            default:
                return (
                    <>
                        <AuthFormHeader title="Welcome Back" subtitle="Log in to your account." />
                        <div className="relative mb-4">
                            <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-brand-accent focus:outline-none" />
                        </div>
                        <div className="relative mb-6">
                            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 pl-10 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-brand-accent focus:outline-none" />
                        </div>
                    </>
                );
        }
    };
    
    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
                <div className="flex border-b dark:border-gray-600 mb-6">
                    <button onClick={() => setMode('login')} className={`flex-1 py-2 font-semibold ${mode === 'login' ? 'text-brand-primary border-b-2 border-brand-primary dark:text-brand-light' : 'text-gray-500 dark:text-gray-400'}`}>Login</button>
                    <button onClick={() => setMode('signup')} className={`flex-1 py-2 font-semibold ${mode === 'signup' ? 'text-brand-primary border-b-2 border-brand-primary dark:text-brand-light' : 'text-gray-500 dark:text-gray-400'}`}>Sign Up</button>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                    {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
                    
                    {renderForm()}

                    <button type="submit" className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 rounded-lg shadow-md transition-colors duration-300">
                        {mode === 'login' && 'Log In'}
                        {mode === 'signup' && 'Create Account'}
                        {mode === 'forgot' && 'Send Reset Link'}
                    </button>
                </form>
                {mode !== 'forgot' && (
                    <div className="text-center mt-4">
                        <button onClick={() => setMode('forgot')} className="text-sm text-brand-secondary hover:underline dark:text-brand-accent">
                            Forgot password?
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
   