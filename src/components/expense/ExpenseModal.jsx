import { useState, useEffect } from 'react'
import { twClasses } from '../../utils/twclasses'

const ExpenseModal = ({ isOpen, onClose, expense, onSave, categories, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    amount: '',
    expenseDate: '',
    paymentMethod: 'cash',
    paidTo: '',
    description: '',
    receiptNumber: '',
    isRecurring: false,
    recurringFrequency: 'monthly'
  })

  const [errors, setErrors] = useState({})

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank-transfer', label: 'Bank Transfer' },
    { value: 'card', label: 'Card' },
    { value: 'upi', label: 'UPI' },
    { value: 'cheque', label: 'Cheque' }
  ]

  const recurringFrequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ]

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || '',
        category: expense.category || '',
        amount: expense.amount || '',
        expenseDate: expense.expenseDate ? new Date(expense.expenseDate).toISOString().split('T')[0] : '',
        paymentMethod: expense.paymentMethod || 'cash',
        paidTo: expense.paidTo || '',
        description: expense.description || '',
        receiptNumber: expense.receiptNumber || '',
        isRecurring: expense.isRecurring || false,
        recurringFrequency: expense.recurringFrequency || 'monthly'
      })
    } else {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0]
      setFormData({
        title: '',
        category: '',
        amount: '',
        expenseDate: today,
        paymentMethod: 'cash',
        paidTo: '',
        description: '',
        receiptNumber: '',
        isRecurring: false,
        recurringFrequency: 'monthly'
      })
    }
    setErrors({})
  }, [expense, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Expense title is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Valid amount is required'
    if (!formData.expenseDate) newErrors.expenseDate = 'Expense date is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Prepare data for API
    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount)
    }

    onSave(submitData)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {expense ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expense Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`${twClasses.inputField} ${errors.title ? 'border-red-500' : ''}`}
                required
                placeholder="Enter expense title"
                disabled={loading}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`${twClasses.inputField} ${errors.category ? 'border-red-500' : ''}`}
                required
                disabled={loading}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className={`${twClasses.inputField} pl-8 ${errors.amount ? 'border-red-500' : ''}`}
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Expense Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense Date *
              </label>
              <input
                type="date"
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleChange}
                className={`${twClasses.inputField} ${errors.expenseDate ? 'border-red-500' : ''}`}
                required
                disabled={loading}
              />
              {errors.expenseDate && (
                <p className="text-red-500 text-sm mt-1">{errors.expenseDate}</p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className={twClasses.inputField}
                disabled={loading}
              >
                {paymentMethods.map(method => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Paid To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paid To
              </label>
              <input
                type="text"
                name="paidTo"
                value={formData.paidTo}
                onChange={handleChange}
                className={twClasses.inputField}
                placeholder="Enter recipient name"
                disabled={loading}
              />
            </div>

            {/* Receipt Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receipt Number
              </label>
              <input
                type="text"
                name="receiptNumber"
                value={formData.receiptNumber}
                onChange={handleChange}
                className={twClasses.inputField}
                placeholder="Enter receipt number"
                disabled={loading}
              />
            </div>

            {/* Recurring Expense */}
            <div className="md:col-span-2 flex items-center space-x-3">
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={loading}
              />
              <label className="text-sm font-medium text-gray-700">
                This is a recurring expense
              </label>
            </div>

            {/* Recurring Frequency */}
            {formData.isRecurring && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recurring Frequency
                </label>
                <select
                  name="recurringFrequency"
                  value={formData.recurringFrequency}
                  onChange={handleChange}
                  className={twClasses.inputField}
                  disabled={loading}
                >
                  {recurringFrequencies.map(freq => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={twClasses.inputField}
              placeholder="Enter expense description"
              disabled={loading}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className={twClasses.btn.secondary}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={twClasses.btn.primary}
              disabled={loading}
            >
              {loading ? 'Saving...' : (expense ? 'Update Expense' : 'Add Expense')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExpenseModal