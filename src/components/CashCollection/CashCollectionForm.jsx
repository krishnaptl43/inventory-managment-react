// components/CashCollection/CashCollectionForm.jsx
import { useState } from 'react';

const CashCollectionForm = ({ agents, dc, onSubmit, onClose,loading }) => {
  const [formData, setFormData] = useState({
    deliveryAgent: '',
    delivered_parsal: '',
    pickup_parsal: '',
    total_amount: '',
    cash_amount: '',
    online_amount: '',
    pay_amount: '',
    collectionDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [calculating, setCalculating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Auto-calculate total amount if cash or online amounts are entered
    if (name === 'cash_amount' || name === 'online_amount') {
      const cash = name === 'cash_amount' ? parseInt(value) || 0 : parseInt(formData.cash_amount) || 0;
      const online = name === 'online_amount' ? parseInt(value) || 0 : parseInt(formData.online_amount) || 0;
      setFormData(prev => ({
        ...prev,
        total_amount: (cash + online).toString()
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.deliveryAgent) {
      newErrors.deliveryAgent = 'Delivery agent is required';
    }

    if (!formData.delivered_parsal || formData.delivered_parsal < 0) {
      newErrors.delivered_parsal = 'Valid delivered parsal count is required';
    }

    if (!formData.pickup_parsal || formData.pickup_parsal < 0) {
      newErrors.pickup_parsal = 'Valid pickup parsal count is required';
    }

    if (!formData.total_amount || formData.total_amount < 0) {
      newErrors.total_amount = 'Valid total amount is required';
    }

    if (!formData.collectionDate) {
      newErrors.collectionDate = 'Collection date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submissionData = {
        ...formData,
        dc: dc,
        delivered_parsal: parseInt(formData.delivered_parsal),
        pickup_parsal: parseInt(formData.pickup_parsal),
        total_amount: parseInt(formData.total_amount),
        cash_amount: parseInt(formData.cash_amount) || 0,
        online_amount: parseInt(formData.online_amount) || 0,
        pay_amount: parseInt(formData.pay_amount) || 0
      };
      onSubmit(submissionData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Record Cash Collection</h2>
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
          {/* Agent and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Agent *
              </label>
              <select
                name="deliveryAgent"
                value={formData.deliveryAgent}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.deliveryAgent ? 'border-red-500' : 'border-gray-300'
                  }`}
              >
                <option value="">Select Agent</option>
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name} - {agent.phone}
                  </option>
                ))}
              </select>
              {errors.deliveryAgent && <p className="mt-1 text-sm text-red-600">{errors.deliveryAgent}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Collection Date *
              </label>
              <input
                type="date"
                name="collectionDate"
                value={formData.collectionDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.collectionDate ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.collectionDate && <p className="mt-1 text-sm text-red-600">{errors.collectionDate}</p>}
            </div>
          </div>

          {/* Parsal Counts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivered Parsals *
              </label>
              <input
                type="number"
                name="delivered_parsal"
                value={formData.delivered_parsal}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.delivered_parsal ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Number of delivered parsals"
              />
              {errors.delivered_parsal && <p className="mt-1 text-sm text-red-600">{errors.delivered_parsal}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Parsals *
              </label>
              <input
                type="number"
                name="pickup_parsal"
                value={formData.pickup_parsal}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.pickup_parsal ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Number of pickup parsals"
              />
              {errors.pickup_parsal && <p className="mt-1 text-sm text-red-600">{errors.pickup_parsal}</p>}
            </div>
          </div>

          {/* Amount Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cash Amount (₹)
              </label>
              <input
                type="number"
                name="cash_amount"
                value={formData.cash_amount}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Online Amount (₹)
              </label>
              <input
                type="number"
                name="online_amount"
                value={formData.online_amount}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Amount (₹) *
              </label>
              <input
                type="number"
                name="total_amount"
                value={formData.total_amount}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.total_amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="0.00"
                readOnly
              />
              {errors.total_amount && <p className="mt-1 text-sm text-red-600">{errors.total_amount}</p>}
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Paid (₹)
              </label>
              <input
                type="number"
                name="pay_amount"
                value={formData.pay_amount}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
              <p className="mt-1 text-xs text-gray-500">
                Amount actually paid by the agent
              </p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes about this collection..."
              maxLength="500"
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.notes.length}/500 characters
            </p>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Collection Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-blue-700">Delivered Parsals:</div>
              <div className="text-blue-900 font-medium">{formData.delivered_parsal || 0}</div>

              <div className="text-blue-700">Pickup Parsals:</div>
              <div className="text-blue-900 font-medium">{formData.pickup_parsal || 0}</div>

              <div className="text-blue-700">Total Amount:</div>
              <div className="text-blue-900 font-medium">₹{formData.total_amount || '0.00'}</div>

              <div className="text-blue-700">Amount Paid:</div>
              <div className="text-blue-900 font-medium">₹{formData.pay_amount || '0.00'}</div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Record Collection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CashCollectionForm;