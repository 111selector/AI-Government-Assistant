import React, { useContext, useState, useEffect } from 'react';
import { AppContext, AppContextType } from '../context/AppContext';
import ChatWindow from './ChatWindow';
import {
    ArchiveBoxIcon,
    ChatBubbleLeftRightIcon,
    ShieldCheckIcon,
    GoogleIcon,
    MicrosoftIcon,
    InstagramIcon,
    TikTokIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from './icons/Icons';
import { CitizenReport } from '../types';
import { moderateContent } from '../services/contentModeration';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';

const getStatusClasses = (status: string) => {
    switch (status) {
        case 'In Progress':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-200 dark:border-amber-700';
        case 'Resolved':
            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700';
        case 'Submitted':
        default:
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-700';
    }
};

const DashboardPage: React.FC = () => {
    const { user, translations } = useContext(AppContext) as AppContextType;
    const [reports, setReports] = useState<CitizenReport[]>([]);
    const [isCreatingReport, setIsCreatingReport] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState('Infrastructure');
    const [reportError, setReportError] = useState<string | null>(null);
    const [reportSuccess, setReportSuccess] = useState<string | null>(null);

    // Sync per-user reports from Firestore
    useEffect(() => {
        if (!user?.uid) {
            setReports([]);
            return;
        }

        const reportsPath = `users/${user.uid}/reports`;
        const colRef = collection(db, 'users', user.uid, 'reports');

        const unsubscribe = onSnapshot(
            colRef,
            (snap) => {
                const list: CitizenReport[] = [];
                snap.forEach((d) => {
                    const data = d.data();
                    list.push({
                        id: d.id,
                        userId: data.userId || user.uid,
                        title: data.title || '',
                        category: data.category || 'General',
                        status: data.status || 'Submitted',
                        createdAt: data.createdAt || new Date().toISOString(),
                    });
                });
                // Sort newest first
                list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setReports(list);
            },
            (error) => {
                console.warn('Notice fetching reports:', error);
                try {
                    handleFirestoreError(error, OperationType.GET, reportsPath);
                } catch {}
            }
        );

        return () => unsubscribe();
    }, [user?.uid]);

    const handleCreateReport = async (e: React.FormEvent) => {
        e.preventDefault();
        setReportError(null);
        setReportSuccess(null);

        if (!user?.uid) return;
        if (!newTitle.trim()) {
            setReportError('Please describe the issue or service request.');
            return;
        }

        // Run content moderation on report title
        const mod = moderateContent(newTitle.trim());
        if (!mod.isClean) {
            setReportError(mod.reason || 'Please remove offensive or inappropriate language before submitting.');
            return;
        }

        const reportId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const reportPath = `users/${user.uid}/reports/${reportId}`;
        const newReportPayload: CitizenReport = {
            id: reportId,
            userId: user.uid,
            title: newTitle.trim(),
            category: newCategory,
            status: 'Submitted',
            createdAt: new Date().toISOString(),
        };

        try {
            await setDoc(doc(db, 'users', user.uid, 'reports', reportId), newReportPayload);
            setNewTitle('');
            setIsCreatingReport(false);
            setReportSuccess('Report submitted to government registry.');
            setTimeout(() => setReportSuccess(null), 3000);
        } catch (err) {
            console.error('Failed to submit report:', err);
            handleFirestoreError(err, OperationType.CREATE, reportPath);
        }
    };

    const renderProviderIcon = () => {
        switch (user?.provider) {
            case 'google.com':
                return <GoogleIcon className="w-5 h-5" />;
            case 'microsoft.com':
                return <MicrosoftIcon className="w-5 h-5" />;
            case 'instagram.com':
                return <InstagramIcon className="w-5 h-5" />;
            case 'tiktok.com':
                return <TikTokIcon className="w-5 h-5" />;
            default:
                return <ShieldCheckIcon className="w-5 h-5 text-brand-primary" />;
        }
    };

    return (
        <div>
            {/* Top Citizen Profile Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand-light dark:bg-blue-900/40 flex items-center justify-center text-brand-primary dark:text-blue-300 font-bold text-2xl shadow-inner">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt={user.username} className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                            user?.username?.charAt(0).toUpperCase() || 'C'
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-text-primary dark:text-white">
                                {translations.welcome}, {user?.username}!
                            </h2>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                {renderProviderIcon()}
                                <span className="capitalize">{user?.provider?.replace('.com', '')}</span>
                            </span>
                        </div>
                        <p className="text-xs text-text-secondary dark:text-gray-400 mt-0.5">
                            Account ID: <span className="font-mono text-gray-500 dark:text-gray-400">{user?.uid}</span> • Logged in via Single Sign-On
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-900 dark:text-blue-200">
                    <ShieldCheckIcon className="w-4 h-4 text-brand-primary flex-shrink-0" />
                    <span>Private Encrypted Citizen Records</span>
                </div>
            </div>

            {/* Main Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Private Reports */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                            <ArchiveBoxIcon className="h-6 w-6 text-brand-primary dark:text-brand-light" />
                            <h3 className="text-xl font-bold text-text-primary dark:text-white">{translations.myReports}</h3>
                        </div>
                        <button
                            onClick={() => setIsCreatingReport(!isCreatingReport)}
                            className="text-xs font-semibold px-3 py-1.5 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg transition-colors"
                        >
                            {isCreatingReport ? 'Cancel' : '+ New Report'}
                        </button>
                    </div>

                    {reportSuccess && (
                        <div className="mb-4 p-2.5 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-xs rounded-xl flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
                            <span>{reportSuccess}</span>
                        </div>
                    )}

                    {/* Report Form */}
                    {isCreatingReport && (
                        <form onSubmit={handleCreateReport} className="mb-5 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border dark:border-gray-700 space-y-3">
                            <h4 className="text-sm font-bold text-text-primary dark:text-white">Submit New Public Service Ticket</h4>
                            <div>
                                <label className="block text-xs font-medium text-text-secondary dark:text-gray-300 mb-1">Category</label>
                                <select
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="w-full p-2 text-xs border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="Roads & Transport">Roads & Transport</option>
                                    <option value="Public Safety">Public Safety</option>
                                    <option value="Water & Sanitation">Water & Sanitation</option>
                                    <option value="Electricity & Lighting">Electricity & Lighting</option>
                                    <option value="Parks & Environment">Parks & Environment</option>
                                    <option value="Administrative Inquiry">Administrative Inquiry</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-secondary dark:text-gray-300 mb-1">Issue Description</label>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => {
                                        setNewTitle(e.target.value);
                                        setReportError(null);
                                    }}
                                    placeholder="e.g. Streetlight out at 4th & Main..."
                                    className="w-full p-2 text-xs border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-1 focus:ring-brand-accent"
                                    maxLength={200}
                                />
                                <span className="text-[10px] text-gray-400 block mt-1">Content filter checks for respectful language.</span>
                            </div>

                            {reportError && (
                                <div className="p-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 text-xs rounded-lg flex items-start gap-1.5">
                                    <ExclamationTriangleIcon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                    <span>{reportError}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-2 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-semibold rounded-lg transition-colors shadow"
                            >
                                Submit Private Report
                            </button>
                        </form>
                    )}

                    {/* Report List */}
                    <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-1">
                        {reports.length > 0 ? (
                            reports.map((report) => (
                                <div
                                    key={report.id}
                                    className="p-3.5 border border-gray-200 dark:border-gray-700 rounded-xl transition-shadow hover:shadow-md bg-gray-50/50 dark:bg-gray-900/40"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-1.5">
                                        <h4 className="font-semibold text-sm text-text-primary dark:text-white leading-snug">
                                            {report.title}
                                        </h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${getStatusClasses(report.status)}`}>
                                            {report.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-text-secondary dark:text-gray-400">
                                        <span>{report.category || 'General'}</span>
                                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-xs">
                                <ArchiveBoxIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>No private reports filed yet.</p>
                                <p className="mt-1">Reports you submit are strictly private to this account.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: AI Assistant Chat with Real-Time Isolation */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b dark:border-gray-700">
                        <div className="flex items-center gap-2.5">
                            <ChatBubbleLeftRightIcon className="h-6 w-6 text-brand-primary dark:text-brand-light" />
                            <h3 className="text-xl font-bold text-text-primary dark:text-white">{translations.aiChat}</h3>
                        </div>
                        <span className="text-xs text-gray-400">Powered by Gemini 2.5 Flash</span>
                    </div>
                    <ChatWindow />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
