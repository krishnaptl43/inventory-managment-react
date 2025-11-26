// components/CashCollection/CashCollectionFilter.jsx
import { twClasses } from "../../utils/twclasses";

const CashCollectionFilter = ({ filters, agents, onFilterChange }) => {

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Agent Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Agent
          </label>
          <select
            value={filters.agent}
            onChange={(e) => handleFilterChange('agent', e.target.value)}
            className={twClasses.inputField}
          >
            <option value="all">All Agents</option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name} - {agent.phone}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className={twClasses.inputField}
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className={twClasses.inputField}
          />
        </div>

        {/* Sort Options */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className={twClasses.inputField}
          >
            <option value="collectionDate">Collection Date</option>
            <option value="total_amount">Total Amount</option>
            <option value="createdAt">Created Date</option>
          </select>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order
          </label>
          <select
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className={twClasses.inputField}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        {/* Items Per Page */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Per Page
          </label>
          <select
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            className={twClasses.inputField}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>

        {/* Clear Filters */}
        <div className="self-end">
          <button
            onClick={() => onFilterChange({
              agent: 'all',
              startDate: '',
              endDate: '',
              page: 1
            })}
            className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashCollectionFilter;