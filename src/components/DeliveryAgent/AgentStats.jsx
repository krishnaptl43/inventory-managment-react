// components/DeliveryAgent/AgentStats.jsx
import { useState, useEffect } from 'react';
import { deliveryAgentAPI } from '../../webservice/api';

const AgentStats = ({ dateRange }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        setLoading(true);

        try {
            setError('')

            const queryParams = new URLSearchParams();

            if (dateRange.startDate) queryParams.append('startDate', dateRange.startDate);
            if (dateRange.endDate) queryParams.append('endDate', dateRange.endDate);

            const response = await deliveryAgentAPI.getAgentStats(queryParams);

            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Error deleting expense:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchStats();
    }, [dateRange]);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                    <div className="shrink-0">
                        <span className="text-red-400">⚠️</span>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-6">
            {/* Overall Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="shrink-0">
                            <span className="text-2xl">👥</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Agents</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {stats.overall.totalAgents}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="shrink-0">
                            <span className="text-2xl">✅</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Active Agents</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {stats.overall.activeAgents}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="shrink-0">
                            <span className="text-2xl">💰</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                ₹{stats.overall.totalRevenue?.toLocaleString() || '0'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="shrink-0">
                            <span className="text-2xl">💵</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Cash Collected</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                ₹{stats.overall.totalCashCollected?.toLocaleString() || '0'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="shrink-0">
                            <span className="text-2xl">💵</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Online Collected</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                ₹{stats.overall.totalOnlineAmount?.toLocaleString() || '0'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="shrink-0">
                            <span className="text-2xl">💵</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Overall Due Amount </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                ₹{stats.overall.totalDueAmount?.toLocaleString() || '0'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="shrink-0">
                            <span className="text-2xl">💵</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Received Amount </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                ₹{stats.overall.receivedAmount?.toLocaleString() || '0'}
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Agent-wise Statistics */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Agent-wise Collection Statistics</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Agent
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Collections
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cash Collections
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Digital Collections
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cash Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Digital Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Received Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Due Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stats.agents && stats.agents.length > 0 ? (
                                stats.agents.map((agentStat, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                Agent {agentStat._id || 'Unknown'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {agentStat.totalCollections || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{(agentStat.totalCollectedAmount || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {agentStat.cashCollections || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {agentStat.digitalCollections || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{(agentStat.cashAmount || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{(agentStat.digitalAmount || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{(agentStat.receivedAmount || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{(agentStat.dueAmount || 0).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No collection data found for the selected period
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                        <div className="shrink-0">
                            <span className="text-2xl">💳</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-blue-800">Digital Collections</p>
                            <p className="text-xl font-semibold text-blue-900">
                                ₹{stats.overall.totalOnlineAmount?.toLocaleString() || '0'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center">
                        <div className="shrink-0">
                            <span className="text-2xl">📈</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-green-800">Average per Agent</p>
                            <p className="text-xl font-semibold text-green-900">
                                ₹{stats.overall.totalAgents > 0
                                    ? Math.round(stats.overall.totalRevenue / stats.overall.totalAgents).toLocaleString()
                                    : '0'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <div className="flex items-center">
                        <div className="shrink-0">
                            <span className="text-2xl">🎯</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-purple-800">Active Rate</p>
                            <p className="text-xl font-semibold text-purple-900">
                                {stats.overall.totalAgents > 0
                                    ? Math.round((stats.overall.activeAgents / stats.overall.totalAgents) * 100)
                                    : 0}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentStats;