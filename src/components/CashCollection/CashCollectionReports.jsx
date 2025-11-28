// components/CashCollection/CashCollectionReports.jsx
import { useState, useEffect } from 'react';
import { cashCollectionAPI } from '../../webservice/api';

const CashCollectionReports = ({ dc }) => {
  const [dailyReport, setDailyReport] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [statsDateRange, setStatsDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const fetchDailyReport = async () => {
    setLoading(true);

    try {
      setError('')

      const queryParams = new URLSearchParams({ date: reportDate, dc });

      const response = await cashCollectionAPI.getDailyCollectionReport(queryParams);

      if (response.success) {
        setDailyReport(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }

  };

  const fetchStats = async () => {
    setLoading(true);

    try {
      setError('')

      const queryParams = new URLSearchParams({ dc });

      if (statsDateRange.startDate) queryParams.append('startDate', statsDateRange.startDate);
      if (statsDateRange.endDate) queryParams.append('endDate', statsDateRange.endDate);

      const response = await cashCollectionAPI.getCollectionStats(queryParams);

      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dc) {
      fetchDailyReport();
      fetchStats();
    }
  }, [dc, reportDate, statsDateRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
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

      {/* Daily Report Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-medium text-gray-900">Daily Collection Report</h3>
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={fetchDailyReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {dailyReport && (
          <div className="p-6">
            {/* Day Total */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-800">Total Collections</div>
                <div className="text-2xl font-semibold text-green-900">
                  {dailyReport.dayTotal.totalCollections}
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="text-sm font-medium text-orange-800">COD Amount</div>
                <div className="text-2xl font-semibold text-orange-900">
                  {formatCurrency(dailyReport.dayTotal.codAmount)}
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-800">Total Amount</div>
                <div className="text-2xl font-semibold text-blue-900">
                  {formatCurrency(dailyReport.dayTotal.totalAmount)}
                </div>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <div className="text-sm font-medium text-pink-800">Received Amount</div>
                <div className="text-2xl font-semibold text-pink-900">
                  {formatCurrency(dailyReport.dayTotal.receivedAmount)}
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-sm font-medium text-yellow-800">Cash Amount</div>
                <div className="text-2xl font-semibold text-yellow-900">
                  {formatCurrency(dailyReport.dayTotal.cashAmount)}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-sm font-medium text-purple-800">Digital Amount</div>
                <div className="text-2xl font-semibold text-purple-900">
                  {formatCurrency(dailyReport.dayTotal.digitalAmount)}
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-sm font-medium text-red-800">Due Amount</div>
                <div className="text-2xl font-semibold text-red-900">
                  {formatCurrency(dailyReport.dayTotal.dueAmount)}
                </div>
              </div>
            </div>

            {/* Agent-wise Breakdown */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Agent-wise Collections</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Collections</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">COD/Total Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cash/Online</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Received Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dailyReport.agentCollections.map((agent, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{agent.agentName}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{agent.totalCollections}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(agent.codAmount) + "/" + formatCurrency(agent.totalAmount)}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(agent.cashAmount) + "/" + formatCurrency(agent.digitalAmount)}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(agent.receivedAmount)}</td>
                        <td className="px-6 py-4 text-sm text-red-900">{formatCurrency(agent.dueAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-medium text-gray-900">Collection Statistics</h3>
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={statsDateRange.startDate}
                onChange={(e) => setStatsDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={statsDateRange.endDate}
                onChange={(e) => setStatsDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="End Date"
              />
              <button
                onClick={fetchStats}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {stats && (
          <div className="p-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Total Collections</div>
                <div className="text-2xl font-semibold text-gray-900">{stats.totalCollections}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Total COD</div>
                <div className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.codAmount)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Total Revenue</div>
                <div className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalAmount)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Cash Collected</div>
                <div className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.cashAmount)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Digital Collected</div>
                <div className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.digitalAmount)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Total Received</div>
                <div className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.receivedAmount)}</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-red-800">Due Amount</div>
                <div className="text-2xl font-semibold text-red-900">{formatCurrency(stats.dueAmount)}</div>
              </div>
            </div>

            {/* Daily Trend */}
            {stats.dailyTrend && stats.dailyTrend.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Last 7 Days Trend</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Collections</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">COD/Total Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cash/Online</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Received Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.dailyTrend.map((day, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 text-sm text-gray-900">{day._id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{day.collectionCount}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(day.codAmount) + "/" + formatCurrency(day.totalAmount)}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(day.cashAmount) + "/" + formatCurrency(day.digitalAmount)}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(day.receivedAmount)}</td>
                          <td className="px-6 py-4 text-sm text-red-900">{formatCurrency(day.dueAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CashCollectionReports;