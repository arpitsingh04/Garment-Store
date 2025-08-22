import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { GalleryItem, GalleryFormData, CATEGORIES } from '../../types/admin';
import { galleryAPI, uploadAPI } from '../../utils/api';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';
import './AdminGallery.css';

const AdminGallery: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<GalleryFormData>();

  const imageFile = watch('image');

  const loadGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await galleryAPI.getAll();
      if (response.success && response.data) {
        setGalleryItems(response.data);
      }
    } catch (error) {
      console.error('Error loading gallery items:', error);
      toast.error('Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGalleryItems();
  }, []);

  // Handle image preview
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (editingItem && !imageFile) {
      // Show existing image when editing
      const imgSrc = editingItem.image.startsWith('http') 
        ? editingItem.image 
        : editingItem.image.startsWith('/uploads/') 
        ? editingItem.image 
        : `/uploads/${editingItem.image}`;
      setImagePreview(imgSrc);
    } else {
      setImagePreview('');
    }
  }, [imageFile, editingItem]);

  const openAddModal = () => {
    setEditingItem(null);
    setImagePreview('');
    reset();
    setModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setValue('title', item.title);
    setValue('category', item.category as any);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setImagePreview('');
    reset();
  };

  const onSubmit = async (data: GalleryFormData) => {
    try {
      setSubmitting(true);
      
      let imageUrl = '';
      
      // Upload new image if selected
      if (data.image && data.image.length > 0) {
        const uploadResponse = await uploadAPI.uploadImage(data.image[0]);
        if (uploadResponse.success && uploadResponse.data) {
          imageUrl = uploadResponse.data.filePath;
        } else {
          throw new Error('Image upload failed');
        }
      }

      const galleryData = {
        title: data.title,
        category: data.category,
        ...(imageUrl && { image: imageUrl }),
        ...(editingItem && !imageUrl && { image: editingItem.image })
      };

      // Validate image for new items
      if (!editingItem && !imageUrl) {
        toast.error('Please select an image');
        return;
      }

      let response;
      if (editingItem) {
        response = await galleryAPI.update(editingItem._id, galleryData);
      } else {
        response = await galleryAPI.create(galleryData);
      }

      if (response.success) {
        toast.success(`Gallery item ${editingItem ? 'updated' : 'created'} successfully`);
        closeModal();
        loadGalleryItems();
      } else {
        toast.error(response.message || 'Failed to save gallery item');
      }
    } catch (error: any) {
      console.error('Error saving gallery item:', error);
      toast.error(error.message || 'Failed to save gallery item');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (item: GalleryItem) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await galleryAPI.delete(itemToDelete._id);
      if (response.success) {
        toast.success('Gallery item deleted successfully');
        setDeleteModalOpen(false);
        setItemToDelete(null);
        loadGalleryItems();
      } else {
        toast.error('Failed to delete gallery item');
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      toast.error('Failed to delete gallery item');
    }
  };

  const getImageSrc = (image: string) => {
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads/')) return image;
    return `/uploads/${image}`;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <Loader2 size={40} className="animate-spin" />
        <p>Loading gallery items...</p>
      </div>
    );
  }

  return (
    <div className="admin-gallery">
      <div className="page-header">
        <h2>Gallery</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={20} />
          Add Gallery Item
        </button>
      </div>

      <div className="gallery-table-container">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {galleryItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="no-data">No gallery items found</td>
                </tr>
              ) : (
                galleryItems.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <img 
                        src={getImageSrc(item.image)} 
                        alt={item.title}
                        className="table-image"
                      />
                    </td>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => openEditModal(item)}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => openDeleteModal(item)}
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

      {/* Gallery Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
        size="md"
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
              form="gallery-form"
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
        <form id="gallery-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              className={`form-control ${errors.title ? 'error' : ''}`}
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <span className="error-message">{errors.title.message}</span>
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
            <label className="form-label">
              Image {!editingItem && '*'}
            </label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              {...register('image', {
                required: !editingItem ? 'Image is required' : false
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
        <p>Are you sure you want to delete "{itemToDelete?.title}"? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default AdminGallery;
