import { NavLink } from 'react-router'
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {

    const { user} = useAuth()

    const navigation = [
        { name: 'Dashboard', href: '/', icon: '📊' },
        { name: 'Cash Collection', href: '/cash-collections', icon: '💰' },
        { name: 'DC', href: '/dc', icon: '🏢' },
        { name: 'Delivery Agent', href: '/delivery-agents', icon: '🚚' },
        { name: 'Agent Analytics', href: '/agent-analytics', icon: '📈' },
        { name: 'Expenses', href: '/expenses', icon: '💰' },
        { name: 'Tasks', href: '/tasks', icon: '✅' },
        { name: 'Settings', href: '/settings', icon: '⚙️' },
    ];

    return (
        <>
            {/* Mobile Sidebar */}
            <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex flex-col h-full pt-5 pb-4 overflow-y-auto">
                    {/* Close Button for Mobile */}
                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">IM</span>
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-900">Inventory</span>
                        </div>
                        <button
                            type="button"
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="mt-8 flex-1 flex flex-col">
                        <div className="px-4 space-y-2">
                            {navigation.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) =>
                                        `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    {item.name}
                                </NavLink>
                            ))}
                        </div>

                        {/* User Section */}
                        <div className="mt-auto px-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center px-3 py-2">
                                <img
                                    className="h-8 w-8 rounded-full"
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt=""
                                />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700">John Doe</p>
                                    <p className="text-xs font-medium text-gray-500">Admin</p>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
                        {/* Logo */}
                        <div className="flex items-center shrink-0 px-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">IM</span>
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-900">Inventory</span>
                        </div>

                        {/* Navigation */}
                        <nav className="mt-8 flex-1 flex flex-col">
                            <div className="px-4 space-y-2">
                                {navigation.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.href}
                                        className={({ isActive }) =>
                                            `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`
                                        }
                                    >
                                        <span className="mr-3 text-lg">{item.icon}</span>
                                        {item.name}
                                    </NavLink>
                                ))}
                            </div>

                            {/* User Section */}
                            <div className="mt-auto px-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center px-3 py-2">
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        alt=""
                                    />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                                        <p className="text-xs font-medium text-gray-500">Admin</p>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar