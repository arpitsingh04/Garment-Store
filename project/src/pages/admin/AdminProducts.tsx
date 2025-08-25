import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Product, ProductFormData, CATEGORIES } from '../../types/admin';
import { productsAPI, uploadAPI } from '../../utils/api';
import { getAssetUrl } from '../../config/api';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';
import './AdminProducts.css';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ProductFormData>();

  const imageFile = watch('image');

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Handle image preview
  useEffect(() => {
    if (imageFile && imageFile instanceof FileList && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (editingProduct && !imageFile) {
      // Show existing image when editing
      const imgSrc = editingProduct.image.startsWith('http') 
        ? editingProduct.image 
        : editingProduct.image.startsWith('/uploads/') 
        ? editingProduct.image 
        : `/uploads/${editingProduct.image}`;
      setImagePreview(getAssetUrl(imgSrc));
    } else {
      setImagePreview('');
    }
  }, [imageFile, editingProduct]);

  const openAddModal = () => {
    setEditingProduct(null);
    setImagePreview('');
    reset();
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setValue('name', product.name);
    setValue('category', product.category as any);
    setValue('description', product.description);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setImagePreview('');
    reset();
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setSubmitting(true);
      
      let imageUrl = '';
      
      // Upload new image if selected
      if (data.image && data.image instanceof FileList && data.image.length > 0) {
        const uploadResponse = await uploadAPI.uploadImage(data.image[0]);
        if (uploadResponse.success && uploadResponse.data) {
          imageUrl = uploadResponse.data.filePath;
        } else {
          throw new Error('Image upload failed');
        }
      }

      const productData = {
        name: data.name,
        category: data.category,
        description: data.description,
        ...(imageUrl && { image: imageUrl }),
        ...(editingProduct && !imageUrl && { image: editingProduct.image })
      };

      // Validate image for new products
      if (!editingProduct && !imageUrl) {
        toast.error('Please select an image');
        return;
      }

      let response;
      if (editingProduct) {
        response = await productsAPI.update(editingProduct._id, productData);
      } else {
        response = await productsAPI.create(productData);
      }

      if (response.success) {
        toast.success(`Product ${editingProduct ? 'updated' : 'created'} successfully`);
        closeModal();
        loadProducts();
      } else {
        toast.error(response.message || 'Failed to save product');
      }
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await productsAPI.delete(productToDelete._id);
      if (response.success) {
        toast.success('Product deleted successfully');
        setDeleteModalOpen(false);
        setProductToDelete(null);
        loadProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const getImageSrc = (image: string) => {
    if (image.startsWith('http')) return image;
    const path = image.startsWith('/uploads/') ? image : `/uploads/${image}`;
    return getAssetUrl(path);
  };

  // Calculate category stats
  const categoryStats = CATEGORIES.reduce((acc, category) => {
    acc[category] = products.filter(product => product.category === category).length;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="admin-loading">
        <Loader2 size={40} className="animate-spin" />
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="page-header">
        <div className="header-content">
          <h2>Products</h2>
          <p className="header-subtitle">Manage your product catalog and inventory</p>
        </div>
        
        <div className="header-actions">
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{products.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="header-divider"></div>
            <div className="stat-item">
              <span className="stat-number">{CATEGORIES.length}</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="header-divider"></div>
            <div className="stat-item">
              <span className="stat-number">{Object.values(categoryStats).filter(count => count > 0).length}</span>
              <span className="stat-label">Active</span>
            </div>
          </div>
          
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={20} />
            Add Product
          </button>
        </div>
      </div>

      <div className="products-table-container">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th className="hidden md:table-cell">Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="no-data">No products found</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img 
                        src={getImageSrc(product.image)} 
                        alt={product.name}
                        className="table-image"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td className="hidden md:table-cell">
                      <span className="description-preview">
                        {product.description.length > 50 
                          ? `${product.description.substring(0, 50)}...` 
                          : product.description
                        }
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => openEditModal(product)}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => openDeleteModal(product)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
        footer={
          <>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={closeModal}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              form="product-form"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </>
        }
      >
        <form id="product-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'error' : ''}`}
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <span className="error-message">{errors.name.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className={`form-select ${errors.category ? 'error' : ''}`}
              {...register('category', { required: 'Category is required' })}
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="error-message">{errors.category.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className={`form-control ${errors.description ? 'error' : ''}`}
              rows={3}
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && (
              <span className="error-message">{errors.description.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Image {!editingProduct && '*'}
            </label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              {...register('image', {
                required: !editingProduct ? 'Image is required' : false
              })}
            />
            {errors.image && (
              <span className="error-message">{errors.image.message}</span>
            )}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete"
        size="sm"
        footer={
          <>
            <button 
              className="btn btn-secondary" 
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-danger" 
              onClick={confirmDelete}
            >
              Delete
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default AdminProducts;