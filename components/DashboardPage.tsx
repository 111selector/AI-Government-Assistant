
import React, { useContext } from 'react';
import { AppContext, AppContextType } from '../context/AppContext';
import ChatWindow from './ChatWindow';
import { ArchiveBoxIcon, ChatBubbleLeftRightIcon } from './icons/Icons';

const mockReports = [
    { id: 1, title: 'Pothole on Main St. & 5th Ave', status: 'In Progress' },
    { id: 2, title: 'Streetlight outage at Elm Park', status: 'Resolved' },
    { id: 3, title: 'Broken public water fountain', status: 'Submitted' },
    { id: 4, title: 'Fallen tree blocking bicycle lane on Oak St.', status: 'Resolved' },
];

const getStatusClasses = (status: string) => {
    switch (status) {
        case 'In Progress':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'Resolved':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'Submitted':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};


const DashboardPage: React.FC = () => {
    const { user, translations } = useContext(AppContext) as AppContextType;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">
                {translations.welcome}, {user?.username || 'Citizen'}!
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <ArchiveBoxIcon className="h-6 w-6 text-brand-primary dark:text-brand-light"/>
                        <h3 className="text-xl font-bold">{translations.myReports}</h3>
                    </div>
                    <div className="space-y-4">
                       {mockReports.length > 0 ? (
                            mockReports.map(report => (
                                <div key={report.id} className="p-4 border dark:border-gray-700 rounded-lg transition-shadow hover:shadow-md bg-gray-50 dark:bg-gray-900/50">
                                    <h4 className="font-semibold mb-2 text-text-primary dark:text-white">{report.title}</h4>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusClasses(report.status)}`}>
                                        {report.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                             <p className="text-text-secondary dark:text-gray-400">Your reported issues and their statuses will appear here.</p>
                        )}
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                     <div className="flex items-center gap-3 mb-4">
                        <ChatBubbleLeftRightIcon className="h-6 w-6 text-brand-primary dark:text-brand-light"/>
                        <h3 className="text-xl font-bold">{translations.aiChat}</h3>
                    </div>
                    <ChatWindow />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
