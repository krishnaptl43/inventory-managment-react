// components/DeliveryAgent/DeliveryAgentManagement.jsx
import { useState, useEffect } from 'react';
import DeliveryAgentTable from '../components/DeliveryAgent/DeliveryAgentTable';
import DeliveryAgentFilter from '../components/DeliveryAgent/DeliveryAgentFilter';
import DeliveryAgentForm from '../components/DeliveryAgent/DeliveryAgentForm';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { dcAPI, deliveryAgentAPI } from '../webservice/api';


const DeliveryAgentManagement = () => {
    const [agents, setAgents] = useState([]);
    const [dcs, setDcs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: '',
        sortBy: 'name',
        sortOrder: 'asc',
        isActive: 'all'
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);

    // Fetch delivery agents
    const fetchAgents = async () => {

        try {
            const queryParams = new URLSearchParams(filters);

            setLoading(true)
            setError('')

            const response = await deliveryAgentAPI.getAgents(queryParams)

            if (response.success) {
                setAgents(response.data);
                setPagination(response.pagination);
            }
        } catch (error) {
            console.error('Error fetching expenses:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    };

    // Fetch DCs for dropdown
    const fetchDCs = async () => {
        try {
            setError('')
            const response = await dcAPI.getDcs()

            if (response.success) {
                setDcs(response.data);
            }

        } catch (error) {
            console.error('Error fetching expenses:', error)
            setError(error.message)
        }
    };

    useEffect(() => {
        fetchAgents();
        fetchDCs();
    }, [filters]);

    const handleCreate = () => {
        setSelectedAgent(null);
        setFormOpen(true);
    };

    const handleEdit = (agent) => {
        setSelectedAgent(agent);
        setFormOpen(true);
    };

    const handleDelete = (agent) => {
        setSelectedAgent(agent);
        setDeleteOpen(true);
    };

    const handleSubmit = async (formData) => {

        try {
            setLoading(true)
            setError('')

            let response

            if (selectedAgent) {
                // Update existing agent
                response = await deliveryAgentAPI.updateAgent(selectedAgent._id, formData)
            } else {
                // Add new agent
                response = await deliveryAgentAPI.createAgent(formData)
            }

            if (response.success) {
                setSuccess(`Delivery agent ${selectedAgent ? 'updated' : 'created'} successfully`);
                setFormOpen(false);
                fetchAgents();
            }
        } catch (error) {
            console.error('Error saving Delivery agent:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    };

    const confirmDelete = async () => {

        try {
            setLoading(true)
            setError('')

            const response = await deliveryAgentAPI.deleteAgent(selectedAgent._id)

            if (response.success) {
                setSuccess('Delivery agent deleted successfully');
                setDeleteOpen(false);
                fetchAgents();
            }
        } catch (error) {
            console.error('Error deleting agent:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters({ ...filters, ...newFilters, page: 1 });
    };

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, page: newPage });
    };

    const toggleAgentStatus = async (agent) => {

        try {
            setError('')

            const response = await deliveryAgentAPI.updateAgentStatus(agent._id, !agent.isActive)

            if (response.success) {
                setSuccess(`Agent ${!agent.isActive ? 'activated' : 'deactivated'} successfully`);
                fetchAgents();
            }
        } catch (error) {
            console.error('Error deleting expense:', error)
            setError(error.message)
        }
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Delivery Agents</h1>
                    <p className="text-gray-600">Manage your delivery agents and their assignments</p>
                </div>

                <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Agent
                </button>

            </div>

            {/* Alerts */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <div className="shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                        <div className="ml-auto pl-3">
                            <button
                                onClick={() => setError('')}
                                className="text-red-400 hover:text-red-500"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <div className="shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">{success}</p>
                        </div>
                        <div className="ml-auto pl-3">
                            <button
                                onClick={() => setSuccess('')}
                                className="text-green-400 hover:text-green-500"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters and Create Button */}
            <DeliveryAgentFilter
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            {/* Table */}
            <div className="bg-white rounded-lg shadow">
                {loading ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <DeliveryAgentTable
                        agents={agents}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleStatus={toggleAgentStatus}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>

            {/* Forms */}
            {formOpen && (
                <DeliveryAgentForm
                    agent={selectedAgent}
                    dcs={dcs}
                    onSubmit={handleSubmit}
                    onClose={() => setFormOpen(false)}
                />
            )}

            {deleteOpen && (
                <DeleteConfirmationModal
                    isOpen={deleteOpen}
                    onClose={() => {
                        setDeleteOpen(false)
                        setSelectedAgent(null)
                        setError('')
                    }}
                    onConfirm={confirmDelete}
                    item={selectedAgent}
                    loading={loading}
                    title="Delete Agent"
                    message="Are you sure you want to delete this agent? This action cannot be undone."
                />
            )}
        </>
    );
};

export default DeliveryAgentManagement;