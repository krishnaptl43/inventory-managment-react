// components/CashCollection/CashCollectionTable.jsx

const CashCollectionTable = ({ collections, pagination, onPageChange }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Agent & Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Parsals
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment Method
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Notes
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {collections.map((collection) => (
            <tr key={collection._id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {collection.deliveryAgent?.name || 'Unknown Agent'}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(collection.collectionDate)}
                </div>
                <div className="text-xs text-gray-400">
                  {collection.deliveryAgent?.phone}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  <span className="font-medium">Delivered:</span> {collection.delivered_parsal}
                </div>
                <div className="text-sm text-gray-900">
                  <span className="font-medium">Pickup:</span> {collection.pickup_parsal}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  COD: {formatCurrency(collection.cod_amount)}
                </div>
                <div className="text-sm font-medium text-green-900">
                  Total: {formatCurrency(collection.total_amount)}
                </div>
                {collection.pay_amount > 0 && (
                  <div className="text-sm text-blue-600">
                    Received  : {formatCurrency(collection.pay_amount)}
                  </div>
                )}
                {collection.due_amount > 0 && (
                  <div className="text-sm text-red-600">
                    Due: {formatCurrency(collection.due_amount)}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Cash: {formatCurrency(collection.cash_amount)}
                </div>
                <div className="text-xs text-gray-500">
                  Online: {formatCurrency(collection.online_amount)}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  {collection.cash_amount > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      💵 Cash
                    </span>
                  )}
                  {collection.online_amount > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      💳 Online
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500 max-w-xs truncate">
                  {collection.notes || 'No notes'}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty State */}
      {collections.length === 0 && (
        <div className="text-center py-12">
          <div className="flex justify-center">
            <span className="text-4xl">💰</span>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No cash collections</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by recording a new cash collection.
          </p>
        </div>
      )}

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

export default CashCollectionTable;