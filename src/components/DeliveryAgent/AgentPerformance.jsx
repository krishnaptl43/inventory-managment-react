// components/DeliveryAgent/AgentPerformance.jsx
import { useState, useEffect } from 'react';
import { deliveryAgentAPI } from '../../webservice/api';

const AgentPerformance = ({ dateRange }) => {
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [performance, setPerformance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch agents for dropdown
    const fetchAgents = async () => {

        try {
            setError('')

            const response = await deliveryAgentAPI.getAgents({ limit: 100 })

            if (response.success) {
                setAgents(response.data);
            }
        } catch (error) {
            console.error('Error fetching agents:', error)
            setError(error.message)
        }
    };

    // Fetch performance data
    const fetchPerformance = async (agentId) => {
        if (!agentId) return;

        setLoading(true);

        try {
            setError('')

            const queryParams = new URLSearchParams();

            if (dateRange.startDate) queryParams.append('startDate', dateRange.startDate);
            if (dateRange.endDate) queryParams.append('endDate', dateRange.endDate);

            const response = await deliveryAgentAPI.getAgentPerformance(agentId, queryParams);

            if (response.success) {
                setPerformance(response.data);
            }
        } catch (error) {
            console.error('Error deleting expense:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    useEffect(() => {
        if (selectedAgent) {
            fetchPerformance(selectedAgent);
        }
    }, [selectedAgent, dateRange]);

    const handleAgentChange = (e) => {
        setSelectedAgent(e.target.value);
    };

    const selectedAgentData = agents.find(agent => agent._id === selectedAgent);

    return (
        <div className="space-y-6">
            {/* Agent Selector */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Delivery Agent
                        </label>
                        <select
                            value={selectedAgent}
                            onChange={handleAgentChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Choose an agent...</option>
                            {agents.map((agent) => (
                                <option key={agent._id} value={agent._id}>
                                    {agent.name} - {agent.phone} {!agent.isActive && '(Inactive)'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedAgentData && (
                        <div className="flex gap-4">
                            <div className="text-sm">
                                <span className="font-medium">Phone:</span> {selectedAgentData.phone}
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">DC:</span> {selectedAgentData.dc?.name || 'N/A'}
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">Commission:</span> {selectedAgentData.commissionRate}%
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {loading && (
                <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}

            {error && (
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
            )}

            {performance && selectedAgentData && (
                <div className="space-y-6">
                    {/* Performance Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="shrink-0">
                                    <span className="text-2xl">📦</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Collections</p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {performance.cashPerformance[0]?.count || 0}
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
                                    <p className="text-sm font-medium text-gray-500">Total Amount Collected</p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        ₹{(performance.cashPerformance[0]?.totalAmount || 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="shrink-0">
                                    <span className="text-2xl">🎯</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Average per Collection</p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        ₹{performance.cashPerformance[0]?.count > 0
                                            ? Math.round(performance.cashPerformance[0].totalAmount / performance.cashPerformance[0].count).toLocaleString()
                                            : '0'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Agent Details */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Agent Details</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Agent Name</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedAgentData.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedAgentData.phone}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Distribution Center</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedAgentData.dc?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Commission Rate</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedAgentData.commissionRate}%</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Status</label>
                                    <p className="mt-1">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selectedAgentData.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {selectedAgentData.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Joining Date</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {new Date(selectedAgentData.joiningDate).toLocaleDateString()}
                                    </p>
                                </div>
                                {selectedAgentData.address && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-500">Address</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedAgentData.address}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Performance Summary */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="shrink-0">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div className="ml-4">
                                <h4 className="text-lg font-medium text-blue-900">Performance Summary</h4>
                                <p className="text-sm text-blue-700 mt-1">
                                    {dateRange.startDate && dateRange.endDate
                                        ? `Performance from ${new Date(dateRange.startDate).toLocaleDateString()} to ${new Date(dateRange.endDate).toLocaleDateString()}`
                                        : 'Overall performance'
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-500">Collections Completed</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {performance.cashPerformance[0]?.count || 0}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-500">Total Revenue Generated</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    ₹{(performance.cashPerformance[0]?.totalAmount || 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!selectedAgent && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                    <div className="flex justify-center">
                        <span className="text-4xl">👆</span>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-yellow-800">Select an Agent</h3>
                    <p className="mt-2 text-sm text-yellow-700">
                        Choose a delivery agent from the dropdown above to view their performance report
                    </p>
                </div>
            )}
        </div>
    );
};

export default AgentPerformance;