import { useState } from 'react'

const ProductFilters = ({ onFilter, onClear }) => {
    const [filters, setFilters] = useState({
        category: '',
        status: '',
        supplier: '',
        minPrice: '',
        maxPrice: '',
        search: ''
    })

    const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Food & Beverages']
    const statusOptions = ['All', 'In Stock', 'Low Stock', 'Out of Stock']

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)
        onFilter(newFilters)
    }

    const handleClear = () => {
        const clearedFilters = {
            category: '',
            status: '',
            supplier: '',
            minPrice: '',
            maxPrice: '',
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
                        Search Products
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 focus:border-transparent pl-10"
                            placeholder="Search by name or SKU..."
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
                            className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 focus:border-transparent"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>
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
                            className="w-full px-3 py-1 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 focus:border-transparent"
                        >
                            {statusOptions.map(status => (
                                <option key={status} value={status === 'All' ? '' : status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Min Price
                        </label>
                        <input
                            type="number"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Price
                        </label>
                        <input
                            type="number"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 focus:border-transparent"
                            placeholder="1000"
                            min="0"
                        />
                    </div>
                </div>

                {/* Clear Button */}
                <div className="lg:ml-4">
                    <button
                        onClick={handleClear}
                        className="bg-gray-600 hover:bg-gray-700 text-sm text-white font-medium py-1.5 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring focus:ring-gray-500 focus:ring-offset w-full lg:w-auto"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
                {filters.category && (
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
                {filters.status && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Status: {filters.status}
                        <button
                            onClick={() => handleFilterChange('status', '')}
                            className="ml-2 hover:bg-green-200 rounded-full"
                        >
                            ×
                        </button>
                    </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Price: ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                        <button
                            onClick={() => {
                                handleFilterChange('minPrice', '')
                                handleFilterChange('maxPrice', '')
                            }}
                            className="ml-2 hover:bg-purple-200 rounded-full"
                        >
                            ×
                        </button>
                    </span>
                )}
            </div>
        </div>
    )
}

export default ProductFilters;