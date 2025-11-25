// components/DeliveryAgent/DeliveryAgentForm.jsx
import { useState, useEffect } from 'react';
import { twClasses } from '../../utils/twclasses';

const DeliveryAgentForm = ({ loading ,agent, dcs, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    commissionRate: 0,
    dc: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name || '',
        phone: agent.phone || '',
        address: agent.address || '',
        commissionRate: agent.commissionRate || 0,
        dc: agent.dc?._id || agent.dc || '',
        isActive: agent.isActive !== undefined ? agent.isActive : true
      });
    }
  }, [agent]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name cannot be more than 100 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (formData.address.length > 500) {
      newErrors.address = 'Address cannot be more than 500 characters';
    }

    if (!formData.dc) {
      newErrors.dc = 'Distribution Center is required';
    }

    if (formData.commissionRate < 0 || formData.commissionRate > 100) {
      newErrors.commissionRate = 'Commission rate must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {agent ? 'Edit Delivery Agent' : 'Create New Delivery Agent'}
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
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`${twClasses.inputField} ${errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter agent name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`${twClasses.inputField} ${errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className={`${twClasses.inputField} ${errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter complete address"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.address.length}/500 characters
                </p>
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Work Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distribution Center *
                </label>
                <select
                  name="dc"
                  value={formData.dc}
                  onChange={handleChange}
                  className={`${twClasses.inputField} ${errors.dc ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Select DC</option>
                  {dcs.map((dc) => (
                    <option key={dc._id} value={dc._id}>
                      {dc.name}
                    </option>
                  ))}
                </select>
                {errors.dc && <p className="mt-1 text-sm text-red-600">{errors.dc}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  name="commissionRate"
                  value={formData.commissionRate}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className={`${twClasses.inputField} ${errors.commissionRate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter commission rate"
                />
                {errors.commissionRate && <p className="mt-1 text-sm text-red-600">{errors.commissionRate}</p>}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Active Agent
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {agent ? 'Update Agent' : 'Create Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryAgentForm;