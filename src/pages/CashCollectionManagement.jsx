// components/CashCollection/CashCollectionManagement.jsx
import { useState, useEffect } from 'react';
import CashCollectionTable from '../components/CashCollection/CashCollectionTable';
import CashCollectionFilter from '../components/CashCollection/CashCollectionFilter';
import CashCollectionForm from '../components/CashCollection/CashCollectionForm';
import CashCollectionReports from '../components/CashCollection/CashCollectionReports';
import { cashCollectionAPI, dcAPI, deliveryAgentAPI } from '../webservice/api';

const CashCollectionManagement = () => {
    const [collections, setCollections] = useState([]);
    const [agents, setAgents] = useState([]);
    const [dcs, setDcs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        agent: 'all',
        startDate: '',
        endDate: '',
        sortBy: 'collectionDate',
        sortOrder: 'desc',
        dc: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });
    const [formOpen, setFormOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [activeTab, setActiveTab] = useState('collections');

    // Fetch cash collections
    const fetchCollections = async () => {
        setLoading(true);

        try {
            setError('')

            const queryParams = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== 'all') {
                    queryParams.append(key, value);
                }
            });

            const response = await cashCollectionAPI.getCollections(queryParams)

            if (response.success) {
                setCollections(response.data);
                setPagination(response.pagination);
            }
        } catch (error) {
            console.error('Error fetching agents:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    };

    // Fetch delivery agents
    const fetchAgents = async () => {
        try {
            setError('')

            const response = await deliveryAgentAPI.getAgents()

            if (response.success) {
                setAgents(response.data);
            }
        } catch (error) {
            console.error('Error fetching agents:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    };

    // Fetch DCs
    const fetchDCs = async () => {

        try {
            setError('')

            const response = await dcAPI.getDcs()

            if (response.success) {
                setDcs(response.data);
                // Set default DC if available
                if (response.data.length > 0 && !filters.dc) {
                    setFilters(prev => ({ ...prev, dc: response.data[0]._id }));
                }
            }
        } catch (error) {
            console.error('Error fetching DCs:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }

    };

    useEffect(() => {
        fetchDCs();
        fetchAgents();
    }, []);

    useEffect(() => {
        if (filters.dc) {
            fetchCollections();
        }
    }, [filters]);

    const handleCreate = () => {
        setSelectedCollection(null);
        setFormOpen(true);
    };

    const handleSubmit = async (formData) => {
        try {
            setLoading(true)
            setError('')
            const response = await cashCollectionAPI.createCollection(formData);

            if (response.success) {
                setSuccess('Cash collection recorded successfully');
                setFormOpen(false);
                fetchCollections();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters({ ...filters, ...newFilters, page: 1 });
    };

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, page: newPage });
    };

    const tabs = [
        { id: 'collections', name: 'Cash Collections', icon: '💰' },
        { id: 'reports', name: 'Reports & Analytics', icon: '📊' }
    ];

    return (
        <>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Cash Collection Management</h1>
                    <p className="text-gray-600">Manage and track cash collections from delivery agents</p>
                </div>

                {/* Placeholder for future actions */}
                <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Collection
                </button>

            </div>

            {/* Alerts */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <div className="shrink-0">
                            <span className="text-red-400">⚠️</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                        <div className="ml-auto pl-3">
                            <button
                                onClick={() => setError('')}
                                className="text-red-400 hover:text-red-500"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <div className="shrink-0">
                            <span className="text-green-400">✅</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">{success}</p>
                        </div>
                        <div className="ml-auto pl-3">
                            <button
                                onClick={() => setSuccess('')}
                                className="text-green-400 hover:text-green-500"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

            {/* DC Selection */}
            {dcs.length > 0 && (
                <div className="mb-6 bg-white p-4 rounded-lg shadow">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Distribution Center
                    </label>
                    <select
                        value={filters.dc}
                        onChange={(e) => handleFilterChange({ dc: e.target.value })}
                        className="w-full max-w-xs px-3 py-2 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {dcs.map((dc) => (
                            <option key={dc._id} value={dc._id}>
                                {dc.dc_name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Content */}
            {activeTab === 'collections' && (
                <>
                    {/* Filters and Create Button */}
                    {filters.dc && (
                        <CashCollectionFilter
                            filters={filters}
                            agents={agents}
                            onFilterChange={handleFilterChange}
                        />
                    )}

                    {/* Table */}
                    {filters.dc ? (
                        <div className="bg-white rounded-lg shadow">
                            {loading ? (
                                <div className="flex justify-center items-center p-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <CashCollectionTable
                                    collections={collections}
                                    pagination={pagination}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                            <div className="flex justify-center">
                                <span className="text-4xl">🏢</span>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-yellow-800">Select a Distribution Center</h3>
                            <p className="mt-2 text-sm text-yellow-700">
                                Please select a distribution center to view cash collections
                            </p>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'reports' && filters.dc && (
                <CashCollectionReports dc={filters.dc} />
            )}

            {/* Forms */}
            {formOpen && filters.dc && (
                <CashCollectionForm
                    agents={agents}
                    dc={filters.dc}
                    onSubmit={handleSubmit}
                    onClose={() => setFormOpen(false)}
                    loading={loading}
                />
            )}
        </>
    );
};

export default CashCollectionManagement;