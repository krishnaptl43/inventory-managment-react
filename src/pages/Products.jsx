// pages/Products.jsx - Updated with proper Add Product button

import { useState, useEffect } from 'react'
import ProductModal from '../components/ProductModal'
import ProductTable from '../components/ProductTable'
import ProductFilters from '../components/ProductFilters'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'

const Products = () => {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    // Mock data - Replace with actual API calls
    useEffect(() => {
        const mockProducts = [
            { id: 1, name: 'MacBook Pro 16"', sku: 'MBP16-001', category: 'Electronics', price: 2499, quantity: 15, reorderLevel: 5, supplier: 'Apple Inc.', description: 'Latest MacBook Pro with M2 chip' },
            { id: 2, name: 'iPhone 15 Pro', sku: 'IP15P-001', category: 'Electronics', price: 999, quantity: 8, reorderLevel: 10, supplier: 'Apple Inc.', description: 'New iPhone with advanced camera' },
            { id: 3, name: 'AirPods Pro', sku: 'APP-001', category: 'Electronics', price: 249, quantity: 0, reorderLevel: 5, supplier: 'Apple Inc.', description: 'Wireless earbuds with noise cancellation' },
            { id: 4, name: 'iPad Air', sku: 'IPA-001', category: 'Electronics', price: 599, quantity: 22, reorderLevel: 8, supplier: 'Apple Inc.', description: 'Versatile tablet for work and play' },
            { id: 5, name: 'Nike Air Max', sku: 'NAM-001', category: 'Sports', price: 120, quantity: 3, reorderLevel: 5, supplier: 'Nike', description: 'Comfortable running shoes' },
            { id: 6, name: 'Coffee Maker', sku: 'CM-001', category: 'Home & Garden', price: 89, quantity: 12, reorderLevel: 4, supplier: 'KitchenAid', description: 'Automatic drip coffee maker' },
        ]

        setProducts(mockProducts)
        setFilteredProducts(mockProducts)
        setLoading(false)
    }, [])

    const handleFilter = (filters) => {
        let filtered = products

        if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchLower) ||
                product.sku.toLowerCase().includes(searchLower)
            )
        }

        if (filters.category) {
            filtered = filtered.filter(product => product.category === filters.category)
        }

        if (filters.status) {
            filtered = filtered.filter(product => {
                if (filters.status === 'In Stock') return product.quantity > product.reorderLevel
                if (filters.status === 'Low Stock') return product.quantity <= product.reorderLevel && product.quantity > 0
                if (filters.status === 'Out of Stock') return product.quantity === 0
                return true
            })
        }

        if (filters.minPrice) {
            filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice))
        }

        if (filters.maxPrice) {
            filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice))
        }

        setFilteredProducts(filtered)
    }

    const handleClearFilters = () => {
        setFilteredProducts(products)
    }

    const handleAddProduct = () => {
        setSelectedProduct(null)
        setIsModalOpen(true)
    }

    const handleEditProduct = (product) => {
        setSelectedProduct(product)
        setIsModalOpen(true)
    }

    const handleDeleteProduct = (product) => {
        setSelectedProduct(product)
        setIsDeleteModalOpen(true)
    }

    const handleSaveProduct = (productData) => {
        if (selectedProduct) {
            // Update existing product
            setProducts(prev => prev.map(p =>
                p.id === selectedProduct.id
                    ? { ...p, ...productData }
                    : p
            ))
        } else {
            // Add new product
            const newProduct = {
                id: Math.max(...products.map(p => p.id)) + 1,
                ...productData,
                sku: productData.sku || `SKU-${Date.now()}`
            }
            setProducts(prev => [...prev, newProduct])
        }
        setIsModalOpen(false)
        setSelectedProduct(null)
    }

    const handleConfirmDelete = (product) => {
        setProducts(prev => prev.filter(p => p.id !== product.id))
        setIsDeleteModalOpen(false)
        setSelectedProduct(null)
    }

    const getStats = () => {
        const total = products.length
        const inStock = products.filter(p => p.quantity > p.reorderLevel).length
        const lowStock = products.filter(p => p.quantity <= p.reorderLevel && p.quantity > 0).length
        const outOfStock = products.filter(p => p.quantity === 0).length

        return { total, inStock, lowStock, outOfStock }
    }

    const stats = getStats()

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="loading-spinner"></div>
            </div>
        )
    }

    return (
        <div>
            {/* Page Header with Add Product Button */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-2">Manage your inventory products</p>
                </div>

                {/* Add Product Button - Main Action */}
                <button
                    onClick={handleAddProduct}
                    className="bg-blue-600 hover:bg-blue-700 text-sm text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring focus:ring-blue-500 mt-4 lg:mt-0 flex items-center space-x-2"
                >
                    <span>+</span>
                    <span>Add New Product</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <span className="text-blue-600 text-lg">📦</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Products</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <span className="text-green-600 text-lg">✅</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">In Stock</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.inStock}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <span className="text-yellow-600 text-lg">⚠️</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Low Stock</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.lowStock}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <span className="text-red-600 text-lg">❌</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.outOfStock}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <ProductFilters
                onFilter={handleFilter}
                onClear={handleClearFilters}
            />

            {/* Products Table */}
            <ProductTable
                products={filteredProducts}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
            />

            {/* Modals */}
            {isModalOpen && <ProductModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedProduct(null)
                }}
                product={selectedProduct}
                onSave={handleSaveProduct}
            />}

            {isDeleteModalOpen && <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedProduct(null)
                }}
                onConfirm={handleConfirmDelete}
                product={selectedProduct}
            />}

        </div>
    )
}

export default Products;