// components/DeliveryAgent/DeliveryAgentFilter.jsx
import { twClasses } from "../../utils/twclasses";

const DeliveryAgentFilter = ({ filters, onFilterChange }) => {
    const handleSearchChange = (e) => {
        onFilterChange({ search: e.target.value });
    };

    const handleSortChange = (e) => {
        onFilterChange({ sortBy: e.target.value });
    };

    const handleOrderChange = (e) => {
        onFilterChange({ sortOrder: e.target.value });
    };

    const handleStatusChange = (e) => {
        onFilterChange({ isActive: e.target.value });
    };

    const handleLimitChange = (e) => {
        onFilterChange({ limit: parseInt(e.target.value) });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search agents..."
                        value={filters.search}
                        onChange={handleSearchChange}
                        className={`${twClasses.inputField} pl-10`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 lg:ml-4">
                    {/* Status Filter */}
                    <select
                        value={filters.isActive}
                        onChange={handleStatusChange}
                        className={twClasses.inputField}
                    >
                        <option value="all">All Status</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>

                    {/* Sort By */}
                    <select
                        value={filters.sortBy}
                        onChange={handleSortChange}
                        className={twClasses.inputField}
                    >
                        <option value="name">Name</option>
                        <option value="joiningDate">Joining Date</option>
                        <option value="commissionRate">Commission</option>
                        <option value="createdAt">Date Created</option>
                    </select>

                    {/* Sort Order */}
                    <select
                        value={filters.sortOrder}
                        onChange={handleOrderChange}
                        className={twClasses.inputField}
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>

                    {/* Items Per Page */}
                    <select
                        value={filters.limit}
                        onChange={handleLimitChange}
                        className={twClasses.inputField}
                    >
                        <option value="5">5 per page</option>
                        <option value="10">10 per page</option>
                        <option value="20">20 per page</option>
                        <option value="50">50 per page</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default DeliveryAgentFilter;