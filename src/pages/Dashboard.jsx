import StatsCard from '../components/StatsCard'
import RecentProducts from '../components/RecentProducts'
import { useNavigate } from 'react-router'

const Dashboard = () => {
    const navigate = useNavigate()
    const stats = [
        { title: 'Total Products', value: '1,248', change: 12, icon: '📦', color: 'blue' },
        { title: 'Total Categories', value: '24', change: 4, icon: '🏷️', color: 'green' },
        { title: 'Low Stock Items', value: '18', change: -2, icon: '⚠️', color: 'yellow' },
        { title: 'Out of Stock', value: '7', change: 1, icon: '❌', color: 'red' },
    ]

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome to your inventory management system</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {stats.map((stat, index) => (
                    <StatsCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        change={stat.change}
                        icon={stat.icon}
                        color={stat.color}
                    />
                ))}
            </div>

            {/* Charts and Recent Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Stock Overview Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Overview</h3>
                    <div className="h-48 sm:h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Stock chart will be displayed here</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <button onClick={() => navigate('/products')} className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                            <div className="text-blue-600 text-lg mb-2">➕</div>
                            <div className="text-sm font-medium text-blue-900">Add Product</div>
                        </button>
                        <button className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
                            <div className="text-green-600 text-lg mb-2">📊</div>
                            <div className="text-sm font-medium text-green-900">View Reports</div>
                        </button>
                        <button className="p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors">
                            <div className="text-yellow-600 text-lg mb-2">⚠️</div>
                            <div className="text-sm font-medium text-yellow-900">Low Stock</div>
                        </button>
                        <button onClick={() => navigate('/categories')} className="p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors">
                            <div className="text-purple-600 text-lg mb-2">🏷️</div>
                            <div className="text-sm font-medium text-purple-900">Categories</div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Products */}
            <div className="mt-6 lg:mt-8">
                <RecentProducts />
            </div>
        </div>
    )
}

export default Dashboard