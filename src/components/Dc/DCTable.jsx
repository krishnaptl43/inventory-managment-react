// components/DC/DCTable.jsx

const DCTable = ({ dcs, onEdit, onDelete, pagination, onPageChange ,loading}) => {
    return (
        <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Area
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {dcs.map((dc) => (
                        <tr key={dc._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{dc.dc_name}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">{dc.area}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${dc.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {dc.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEdit(dc)}
                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                    disabled={loading}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(dc)}
                                    className="text-red-600 hover:text-red-900"
                                    disabled={loading}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                                </span> of{' '}
                                <span className="font-medium">{pagination.total}</span> results
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onPageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${pagination.page === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                    }`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => onPageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.pages}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${pagination.page === pagination.pages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DCTable;