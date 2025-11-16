import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import ExpenseModal from '../components/expense/ExpenseModal'
import ExpenseTable from '../components/expense/ExpenseTable'
import ExpenseFilters from '../components/expense/ExpenseFilters'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import { expenseAPI } from '../webservice/api'
import { twClasses } from '../utils/twclasses'

const Expenses = () => {
    const [expenses, setExpenses] = useState([])
    const [filteredExpenses, setFilteredExpenses] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedExpense, setSelectedExpense] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const categories = useMemo(() => [
        { name: 'rent' },
        { name: 'utilities' },
        { name: 'salaries' },
        { name: 'office-supplies' },
        { name: 'maintenance' },
        { name: 'transport' },
        { name: 'marketing' },
        { name: 'internet-phone' }
    ], [])
    const [stats, setStats] = useState({
        total: 0,
        totalAmount: 0,
        approvedAmount: 0,
        paidAmount: 0,
        pendingAmount: 0
    })

    const { user } = useAuth()

    // Fetch expenses from API
    const fetchExpenses = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await expenseAPI.getExpenses()

            if (response.success) {
                setExpenses(response.data)
                setFilteredExpenses(response.data)
            }
        } catch (error) {
            console.error('Error fetching expenses:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    // Fetch expense statistics
    const fetchExpenseStats = async () => {
        try {
            const response = await expenseAPI.getExpenseStats()

            if (response.success) {
                setStats(response.data)
            }
        } catch (error) {
            console.error('Error fetching expense stats:', error)
        }
    }

    useEffect(() => {
        if (user) {
            fetchExpenses()
            fetchExpenseStats()
        }
    }, [user])

    const handleFilter = (filters) => {
        let filtered = expenses

        if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            filtered = filtered.filter(expense =>
                expense.title.toLowerCase().includes(searchLower) ||
                expense.expenseId.toLowerCase().includes(searchLower) ||
                expense.paidTo?.toLowerCase().includes(searchLower)
            )
        }

        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter(expense => expense.category === filters.category)
        }

        if (filters.status && filters.status !== 'all') {
            filtered = filtered.filter(expense => expense.status === filters.status)
        }

        if (filters.startDate) {
            filtered = filtered.filter(expense =>
                new Date(expense.expenseDate) >= new Date(filters.startDate)
            )
        }

        if (filters.endDate) {
            filtered = filtered.filter(expense =>
                new Date(expense.expenseDate) <= new Date(filters.endDate)
            )
        }

        if (filters.minAmount) {
            filtered = filtered.filter(expense => expense.amount >= parseFloat(filters.minAmount))
        }

        if (filters.maxAmount) {
            filtered = filtered.filter(expense => expense.amount <= parseFloat(filters.maxAmount))
        }

        setFilteredExpenses(filtered)
    }

    const handleClearFilters = () => {
        setFilteredExpenses(expenses)
    }

    const handleAddExpense = () => {
        setSelectedExpense(null)
        setIsModalOpen(true)
    }

    const handleEditExpense = (expense) => {
        setSelectedExpense(expense)
        setIsModalOpen(true)
    }

    const handleDeleteExpense = (expense) => {
        setSelectedExpense(expense)
        setIsDeleteModalOpen(true)
    }

    const handleSaveExpense = async (expenseData) => {
        try {
            setLoading(true)
            setError('')

            let response

            if (selectedExpense) {
                // Update existing expense
                response = await expenseAPI.updateExpense(selectedExpense._id, expenseData)
            } else {
                // Add new expense
                response = await expenseAPI.createExpense(expenseData)
            }

            if (response.success) {
                setIsModalOpen(false)
                setSelectedExpense(null)
                fetchExpenses() // Refresh the list
                fetchExpenseStats() // Refresh stats
            }
        } catch (error) {
            console.error('Error saving expense:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleConfirmDelete = async (expense) => {
        try {
            setLoading(true)
            setError('')

            const response = await expenseAPI.deleteExpense(expense._id)

            if (response.success) {
                setIsDeleteModalOpen(false)
                setSelectedExpense(null)
                fetchExpenses() // Refresh the list
                fetchExpenseStats() // Refresh stats
            }
        } catch (error) {
            console.error('Error deleting expense:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading && expenses.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className={twClasses.loading.spinner}></div>
            </div>
        )
    }

    return (
        <div>
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Expenses</h1>
                    <p className="text-gray-600 mt-2">Manage your office expenses</p>
                </div>

                {/* Add Expense Button - Main Action */}
                <button
                    onClick={handleAddExpense}
                    className="bg-blue-600 hover:bg-blue-700 text-sm text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring focus:ring-blue-500 mt-4 lg:mt-0 flex items-center space-x-2"
                    disabled={loading}
                >
                    <span>+</span>
                    <span>Add New Expense</span>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-700">{error}</span>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <span className="text-blue-600 text-lg">💰</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <span className="text-green-600 text-lg">✅</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Amount</p>
                            <p className="text-2xl font-semibold text-gray-900">₹{stats.totalAmount?.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <span className="text-indigo-600 text-lg">💳</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Paid</p>
                            <p className="text-2xl font-semibold text-gray-900">₹{stats.paidAmount?.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <ExpenseFilters
                onFilter={handleFilter}
                onClear={handleClearFilters}
                categories={categories}
            />

            {/* Expenses Table */}
            <ExpenseTable
                expenses={filteredExpenses}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
                loading={loading}
            />

            {/* Modals */}
            <ExpenseModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedExpense(null)
                    setError('')
                }}
                expense={selectedExpense}
                onSave={handleSaveExpense}
                categories={categories}
                loading={loading}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedExpense(null)
                    setError('')
                }}
                onConfirm={handleConfirmDelete}
                item={selectedExpense}
                loading={loading}
                title="Delete Expense"
                message="Are you sure you want to delete this expense? This action cannot be undone."
            />
        </div>
    )
}

export default Expenses