// Tailwind CSS Classes Utility
export const twClasses = {
    // Input Fields
    inputField: "w-full px-3 py-1 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed",

    inputFieldError: "w-full px-3 py-1 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed",

    inputFieldWithIcon: "w-full pl-10 pr-3 py- border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed",

    // Buttons
    btn: {
        primary: "bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",

        secondary: "bg-gray-600 hover:bg-gray-700 text-white font-medium py-1 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",

        success: "bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",

        warning: "bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-1 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",

        danger: "bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",

        info: "bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",

        outline: {
            primary: "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
            danger: "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        },

        sizes: {
            sm: "bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm",
            lg: "bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        }
    },

    // Loading
    loading: {
        spinner: "animate-spin rounded-full h-6 w-6 border-b-2 border-white",
        spinnerLarge: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
    },
}