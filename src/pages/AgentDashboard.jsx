// components/DeliveryAgent/AgentDashboard.jsx
import { useState, useEffect } from 'react';
import AgentStats from '../components/DeliveryAgent/AgentStats';
import AgentPerformance from '../components/DeliveryAgent/AgentPerformance';

const AgentDashboard = () => {
    const [activeTab, setActiveTab] = useState('stats');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const tabs = [
        { id: 'stats', name: 'Agent Statistics', icon: '📊' },
        { id: 'performance', name: 'Performance Reports', icon: '🚀' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Agent Analytics</h1>
                <p className="text-gray-600">Track delivery agent performance and statistics</p>
            </div>

            {/* Date Range Filter */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={dateRange.startDate}
                                onChange={handleDateChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={dateRange.endDate}
                                onChange={handleDateChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => setDateRange({ startDate: '', endDate: '' })}
                        className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Clear Dates
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div>
                {activeTab === 'stats' && (
                    <AgentStats dateRange={dateRange} />
                )}
                {activeTab === 'performance' && (
                    <AgentPerformance dateRange={dateRange} />
                )}
            </div>
        </div>
    );
};

export default AgentDashboard;