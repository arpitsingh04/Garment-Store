import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Testimonial, TestimonialFormData } from '../../types/admin';
import { testimonialsAPI, uploadAPI } from '../../utils/api';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';
import './AdminTestimonials.css';

const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [charCount, setCharCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<TestimonialFormData>();

  const imageFile = watch('image');
  const testimonialText = watch('testimonial');

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const response = await testimonialsAPI.getAll();
      if (response.success && response.data) {
        setTestimonials(response.data);
      }
    } catch (error) {
      console.error('Error loading testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  // Handle character count
  useEffect(() => {
    setCharCount(testimonialText?.length || 0);
  }, [testimonialText]);

  // Handle image preview
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (editingTestimonial && !imageFile) {
      // Show existing image when editing
      const imgSrc = editingTestimonial.image.startsWith('http') 
        ? editingTestimonial.image 
        : editingTestimonial.image.startsWith('/uploads/') 
        ? editingTestimonial.image 
        : `/uploads/${editingTestimonial.image}`;
      setImagePreview(imgSrc);
    } else {
      setImagePreview('');
    }
  }, [imageFile, editingTestimonial]);

  const openAddModal = () => {
    setEditingTestimonial(null);
    setImagePreview('');
    setCharCount(0);
    reset();
    setModalOpen(true);
  };

  const openEditModal = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setValue('name', testimonial.name);
    setValue('title', testimonial.title);
    setValue('company', testimonial.company);
    setValue('testimonial', testimonial.testimonial);
    setValue('rating', testimonial.rating);
    setValue('featured', testimonial.featured);
    setValue('approved', testimonial.approved);
    setCharCount(testimonial.testimonial.length);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTestimonial(null);
    setImagePreview('');
    setCharCount(0);
    reset();
  };

  const onSubmit = async (data: TestimonialFormData) => {
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

      const testimonialData = {
        name: data.name,
        title: data.title,
        company: data.company,
        testimonial: data.testimonial,
        rating: data.rating,
        featured: data.featured,
        approved: data.approved,
        ...(imageUrl && { image: imageUrl }),
        ...(editingTestimonial && !imageUrl && { image: editingTestimonial.image })
      };

      // Validate image for new testimonials
      if (!editingTestimonial && !imageUrl) {
        toast.error('Please select an image');
        return;
      }

      let response;
      if (editingTestimonial) {
        response = await testimonialsAPI.update(editingTestimonial._id, testimonialData);
      } else {
        response = await testimonialsAPI.create(testimonialData);
      }

      if (response.success) {
        toast.success(`Testimonial ${editingTestimonial ? 'updated' : 'created'} successfully`);
        closeModal();
        loadTestimonials();
      } else {
        toast.error(response.message || 'Failed to save testimonial');
      }
    } catch (error: any) {
      console.error('Error saving testimonial:', error);
      toast.error(error.message || 'Failed to save testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (testimonial: Testimonial) => {
    setTestimonialToDelete(testimonial);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!testimonialToDelete) return;

    try {
      const response = await testimonialsAPI.delete(testimonialToDelete._id);
      if (response.success) {
        toast.success('Testimonial deleted successfully');
        setDeleteModalOpen(false);
        setTestimonialToDelete(null);
        loadTestimonials();
      } else {
        toast.error('Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  const getImageSrc = (image: string) => {
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads/')) return image;
    return `/uploads/${image}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < rating ? '#fbbf24' : 'none'}
        color={i < rating ? '#fbbf24' : '#d1d5db'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <Loader2 size={40} className="animate-spin" />
        <p>Loading testimonials...</p>
      </div>
    );
  }

  return (
    <div className="admin-testimonials">
      <div className="page-header">
        <h2>Testimonials</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={20} />
          Add Testimonial
        </button>
      </div>

      <div className="testimonials-table-container">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Company</th>
                <th className="hidden md:table-cell">Rating</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.length === 0 ? (
                <tr>
                  <td colSpan={7} className="no-data">No testimonials found</td>
                </tr>
              ) : (
                testimonials.map((testimonial) => (
                  <tr key={testimonial._id}>
                    <td>
                      <img 
                        src={getImageSrc(testimonial.image)} 
                        alt={testimonial.name}
                        className="table-image"
                      />
                    </td>
                    <td>{testimonial.name}</td>
                    <td>{testimonial.company}</td>
                    <td className="hidden md:table-cell">
                      <div className="rating-stars">
                        {renderStars(testimonial.rating)}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${testimonial.featured ? 'featured' : 'not-featured'}`}>
                        {testimonial.featured ? 'Featured' : 'Not Featured'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${testimonial.approved ? 'approved' : 'pending'}`}>
                        {testimonial.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => openEditModal(testimonial)}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => openDeleteModal(testimonial)}
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

      {/* Testimonial Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
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
              form="testimonial-form"
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
        <form id="testimonial-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Customer Name *</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'error' : ''}`}
                maxLength={100}
                {...register('name', { 
                  required: 'Name is required',
                  maxLength: { value: 100, message: 'Name cannot exceed 100 characters' }
                })}
              />
              {errors.name && (
                <span className="error-message">{errors.name.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Title/Position *</label>
              <input
                type="text"
                className={`form-control ${errors.title ? 'error' : ''}`}
                maxLength={150}
                {...register('title', { 
                  required: 'Title is required',
                  maxLength: { value: 150, message: 'Title cannot exceed 150 characters' }
                })}
              />
              {errors.title && (
                <span className="error-message">{errors.title.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company *</label>
              <input
                type="text"
                className={`form-control ${errors.company ? 'error' : ''}`}
                maxLength={150}
                {...register('company', { 
                  required: 'Company is required',
                  maxLength: { value: 150, message: 'Company cannot exceed 150 characters' }
                })}
              />
              {errors.company && (
                <span className="error-message">{errors.company.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Rating *</label>
              <select
                className={`form-select ${errors.rating ? 'error' : ''}`}
                {...register('rating', { 
                  required: 'Rating is required',
                  valueAsNumber: true
                })}
              >
                <option value="">Select Rating</option>
                <option value={1}>1 Star</option>
                <option value={2}>2 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={5}>5 Stars</option>
              </select>
              {errors.rating && (
                <span className="error-message">{errors.rating.message}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Testimonial Text *</label>
            <textarea
              className={`form-control ${errors.testimonial ? 'error' : ''}`}
              rows={4}
              maxLength={1000}
              placeholder="Enter testimonial text (10-1000 characters, approximately 2-200 words)"
              {...register('testimonial', { 
                required: 'Testimonial text is required',
                minLength: { value: 10, message: 'Testimonial must be at least 10 characters' },
                maxLength: { value: 1000, message: 'Testimonial cannot exceed 1000 characters' }
              })}
            />
            <div className="char-counter">
              <span className={charCount < 10 ? 'text-red' : ''}>{charCount}</span>/1000 characters 
              {charCount < 10 && ' (minimum 10 required)'}
            </div>
            {errors.testimonial && (
              <span className="error-message">{errors.testimonial.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Customer Image {!editingTestimonial && '*'}
            </label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              {...register('image', {
                required: !editingTestimonial ? 'Image is required' : false
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

          <div className="form-row">
            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="featured"
                  className="form-checkbox"
                  {...register('featured')}
                />
                <label htmlFor="featured" className="checkbox-label">
                  Featured Testimonial
                </label>
              </div>
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="approved"
                  className="form-checkbox"
                  defaultChecked
                  {...register('approved')}
                />
                <label htmlFor="approved" className="checkbox-label">
                  Approved for Display
                </label>
              </div>
            </div>
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
        <p>Are you sure you want to delete the testimonial from "{testimonialToDelete?.name}"? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default AdminTestimonials;
