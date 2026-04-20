import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { productsAPI } from '../../api/client';
import { 
  PlusIcon,
  XMarkIcon,
  PhotoIcon,
  CubeIcon,
  EllipsisHorizontalIcon 
} from '@heroicons/react/24/outline';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productsAPI.list({ limit: 50 });
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id?.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Products</h1>
          <p className="text-slate-600">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-slate-600 font-medium">Total Products</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{products.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-600 font-medium">In Stock</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">
            {products.filter(p => p.stock > 0).length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-600 font-medium">Low Stock</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">
            {products.filter(p => p.stock <= 10 && p.stock > 0).length}
          </p>
        </div>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Add New Product</h2>
            <button onClick={() => setShowForm(false)} className="btn-icon">
              <XMarkIcon className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          
          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault();
            toast.success('Product form submitted');
            setShowForm(false);
          }}>
            {/* Product Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g., Premium Wireless Headphones"
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Price (₹)</label>
                <input
                  type="number"
                  placeholder="₹0"
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Cost Price (₹)</label>
                <input
                  type="number"
                  placeholder="₹0"
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  placeholder="0"
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
              <textarea
                placeholder="Enter product description..."
                rows="4"
                className="form-textarea"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Product Image</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
                <PhotoIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 font-medium">Drag and drop your image here</p>
                <p className="text-slate-500 text-sm">or click to select</p>
                <input type="file" accept="image/*" className="hidden" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1">
                Add Product
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input pl-12"
        />
        <CubeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
      </div>

      {/* Products Grid or Empty State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="card text-center py-16">
          <CubeIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium text-lg">No products found</p>
          <p className="text-slate-500 text-sm mt-1 mb-6">Create your first product to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary mx-auto"
          >
            <PlusIcon className="w-5 h-5" />
            Create Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, idx) => (
            <div key={idx} className="card card-hover group">
              {/* Product Image Placeholder */}
              <div className="w-full h-40 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg mb-4 flex items-center justify-center">
                <PhotoIcon className="w-12 h-12 text-slate-400" />
              </div>
              
              {/* Product Info */}
              <div className="mb-4">
                <h3 className="font-bold text-slate-900 mb-2">Product {idx + 1}</h3>
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">Premium quality product with excellent features</p>
                
                {/* Price */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xl font-bold text-slate-900">₹0</span>
                  <span className="text-sm text-slate-500 line-through">₹0</span>
                </div>

                {/* Stock Status */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Stock: 0</span>
                  <span className="badge badge-success">In Stock</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-slate-200">
                <button className="btn-secondary flex-1 text-sm py-2">Edit</button>
                <button className="btn-icon bg-slate-100 hover:bg-slate-200">
                  <EllipsisHorizontalIcon className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
