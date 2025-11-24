// components/DC/DCForm.jsx
import { useState, useEffect } from 'react';
import { twClasses } from '../../utils/twclasses';

const DCForm = ({ loading, dc, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        dc_name: '',
        area: '',
        description: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (dc) {
            setFormData({
                name: dc.dc_name || '',
                area: dc.area || '',
                description: dc.description || ''
            });
        }
    }, [dc]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Handle nested fields
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.dc_name.trim()) {
            newErrors.dc_name = 'Name is required';
        }

        if (!formData.area.trim()) {
            newErrors.area = 'Area is required';
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
                        {dc ? 'Edit DC' : 'Create New DC'}
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
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    DC Name *
                                </label>
                                <input
                                    type="text"
                                    name="dc_name"
                                    value={formData.dc_name}
                                    onChange={handleChange}
                                    className={`${twClasses.inputField} ${errors.dc_name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter DC name"
                                />
                                {errors.dc_name && <p className="mt-1 text-sm text-red-600">{errors.dc_name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    DC Area *
                                </label>
                                <input
                                    type="text"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleChange}
                                    className={`${twClasses.inputField} ${errors.area ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter DC area"
                                />
                                {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className={twClasses.inputField}
                                    placeholder="Enter DC description"
                                />
                            </div>
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
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {loading ? 'saving...' : dc ? 'Update DC' : 'Create DC'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DCForm;