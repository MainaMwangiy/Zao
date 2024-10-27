import React, { useState } from 'react';
import Summary from './Summary';
import Expenses from '../Expenses/Expenses';
import Analytics from './Analytics';
import Gallery from './Gallery';
import { useLocation } from 'react-router-dom';
import Harvests from '../Harvests/Harvests';

const Projects: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('summary');
    const location = useLocation();
    const projectData = location.state;

    if (!projectData) {
        return (
            <div className="container mx-auto px-2 py-6 dark:bg-gray-900">
                <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-200">No Project Data Available</h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-1 py-6 dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-200">
                {projectData.title}
            </h1>
            <div className="tabs flex overflow-x-auto scroll-snap-x border-b border-gray-300 dark:border-gray-700 mb-4 scrollbar-hide">
                {['Summary', 'Expense', 'Harvests', 'Analytics', 'Gallery'].map((tab) => (
                    <button
                        key={tab}
                        className={`py-2 px-2 scroll-snap-start whitespace-nowrap transition ${activeTab.toLowerCase() === tab.toLowerCase()
                            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                            : 'text-gray-700 dark:text-gray-300'
                            }`}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div>
                {activeTab === 'summary' && <Summary projectData={projectData} />}
                {activeTab === 'expense' && <Expenses projectData={projectData} isProject={true} />}
                {activeTab === 'harvests' && <Harvests projectData={projectData} isProject={true} />}
                {activeTab === 'analytics' && <Analytics />}
                {activeTab === 'gallery' && <Gallery />}
            </div>
        </div>
    );
};

export default Projects;
