const StatsCard = ({ title, value, change, icon, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500',
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
                <div className={`shrink-0 p-3 rounded-lg ${colorClasses[color]} bg-opacity-10`}>
                    <span className="text-2xl">{icon}</span>
                </div>
                <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <div className="flex items-baseline">
                        <p className="text-2xl font-semibold text-gray-900">{value}</p>
                        {change && (
                            <span className={`ml-2 text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {change > 0 ? '+' : ''}{change}%
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatsCard;