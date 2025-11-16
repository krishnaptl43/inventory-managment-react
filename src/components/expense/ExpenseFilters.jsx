import { useState } from 'react'
import { twClasses } from '../../utils/twclasses'

const ExpenseFilters = ({ onFilter, onClear, categories }) => {
    const [filters, setFilters] = useState({
        category: '',
        status: '',
        startDate: '',
        endDate: '',
        minAmount: '',
        maxAmount: '',
        search: ''
    })

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'paid', label: 'Paid' },
    ]

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)
        onFilter(newFilters)
    }

    const handleClear = () => {
        const clearedFilters = {
            category: '',
            status: '',
            startDate: '',
            endDate: '',
            minAmount: '',
            maxAmount: '',
            search: ''
        }
        setFilters(clearedFilters)
        onClear()
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between space-y-4 lg:space-y-0">
                {/* Search */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Expenses
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className={`${twClasses.inputField} pl-10`}
                            placeholder="Search by title, ID, or recipient..."
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 lg:ml-4">
                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className={twClasses.inputField}
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.name} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className={twClasses.inputField}
                        >
                            {statusOptions.map(status => (
                                <option key={status.value} value={status.value}>{status.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Amount Range */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Min Amount
                        </label>
                        <input
                            type="number"
                            value={filters.minAmount}
                            onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                            className={twClasses.inputField}
                            placeholder="0"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Amount
                        </label>
                        <input
                            type="number"
                            value={filters.maxAmount}
                            onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                            className={twClasses.inputField}
                            placeholder="10000"
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>

                {/* Clear Button */}
                <div className="lg:ml-4">
                    <button
                        onClick={handleClear}
                        className="btn-secondary w-full lg:w-auto"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Date Range Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        className={twClasses.inputField}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        className={twClasses.inputField}
                    />
                </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
                {filters.category && filters.category !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Category: {filters.category}
                        <button
                            onClick={() => handleFilterChange('category', '')}
                            className="ml-2 hover:bg-blue-200 rounded-full"
                        >
                            ×
                        </button>
                    </span>
                )}
                {filters.status && filters.status !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Status: {statusOptions.find(s => s.value === filters.status)?.label}
                        <button
                            onClick={() => handleFilterChange('status', '')}
                            className="ml-2 hover:bg-green-200 rounded-full"
                        >
                            ×
                        </button>
                    </span>
                )}
                {(filters.minAmount || filters.maxAmount) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Amount: ${filters.minAmount || 0} - ${filters.maxAmount || '∞'}
                        <button
                            onClick={() => {
                                handleFilterChange('minAmount', '')
                                handleFilterChange('maxAmount', '')
                            }}
                            className="ml-2 hover:bg-purple-200 rounded-full"
                        >
                            ×
                        </button>
                    </span>
                )}
                {(filters.startDate || filters.endDate) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Date: {filters.startDate || 'Start'} to {filters.endDate || 'End'}
                        <button
                            onClick={() => {
                                handleFilterChange('startDate', '')
                                handleFilterChange('endDate', '')
                            }}
                            className="ml-2 hover:bg-yellow-200 rounded-full"
                        >
                            ×
                        </button>
                    </span>
                )}
            </div>
        </div>
    )
}

export default ExpenseFilters