import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Loader2 } from 'lucide-react';
import { Contact } from '../../types/admin';
import { contactsAPI } from '../../utils/api';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';
import './AdminContacts.css';

const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const response = await contactsAPI.getAll();
      if (response.success && response.data) {
        setContacts(response.data);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openViewModal = (contact: Contact) => {
    setSelectedContact(contact);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedContact(null);
  };

  const updateContactStatus = async (status: string) => {
    if (!selectedContact) return;

    try {
      setUpdatingStatus(true);
      const response = await contactsAPI.updateStatus(selectedContact._id, status);
      
      if (response.success) {
        toast.success('Status updated successfully');
        setSelectedContact({ ...selectedContact, status: status as any });
        loadContacts(); // Refresh the list
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const openDeleteModal = (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!contactToDelete) return;

    try {
      const response = await contactsAPI.delete(contactToDelete._id);
      if (response.success) {
        toast.success('Contact deleted successfully');
        setDeleteModalOpen(false);
        setContactToDelete(null);
        loadContacts();
      } else {
        toast.error('Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <Loader2 size={40} className="animate-spin" />
        <p>Loading contacts...</p>
      </div>
    );
  }

  return (
    <div className="admin-contacts">
      <div className="page-header">
        <h2>Contact Submissions</h2>
      </div>

      <div className="contacts-table-container">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th className="hidden md:table-cell">Email</th>
                <th className="hidden sm:table-cell">Phone</th>
                <th className="hidden sm:table-cell">Product</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="no-data">No contact submissions found</td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact._id}>
                    <td>{contact.name}</td>
                    <td className="hidden md:table-cell">
                      <span className="email-text">{contact.email}</span>
                    </td>
                    <td className="hidden sm:table-cell">{contact.phone}</td>
                    <td className="hidden sm:table-cell">
                      <span className="product-text">{contact.product || 'N/A'}</span>
                    </td>
                    <td>
                      <span className="date-text">{formatDate(contact.createdAt)}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${contact.status}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-view"
                          onClick={() => openViewModal(contact)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => openDeleteModal(contact)}
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

      {/* Contact View Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={closeViewModal}
        title="Contact Details"
        size="md"
        footer={
          <>
            <button 
              className="btn btn-secondary" 
              onClick={closeViewModal}
            >
              Close
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => updateContactStatus(
                selectedContact?.status === 'new' ? 'read' :
                selectedContact?.status === 'read' ? 'responded' : 'new'
              )}
              disabled={updatingStatus}
            >
              {updatingStatus ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Updating...
                </>
              ) : (
                `Mark as ${
                  selectedContact?.status === 'new' ? 'Read' :
                  selectedContact?.status === 'read' ? 'Responded' : 'New'
                }`
              )}
            </button>
          </>
        }
      >
        {selectedContact && (
          <div className="contact-details">
            <div className="detail-row">
              <strong>Name:</strong>
              <span>{selectedContact.name}</span>
            </div>
            
            <div className="detail-row">
              <strong>Email:</strong>
              <span className="email-link">
                <a href={`mailto:${selectedContact.email}`}>
                  {selectedContact.email}
                </a>
              </span>
            </div>
            
            <div className="detail-row">
              <strong>Phone:</strong>
              <span className="phone-link">
                <a href={`tel:${selectedContact.phone}`}>
                  {selectedContact.phone}
                </a>
              </span>
            </div>
            
            <div className="detail-row">
              <strong>Product Interest:</strong>
              <span>{selectedContact.product || 'N/A'}</span>
            </div>
            
            <div className="detail-row">
              <strong>Date Submitted:</strong>
              <span>{formatDate(selectedContact.createdAt)}</span>
            </div>
            
            <div className="detail-row">
              <strong>Current Status:</strong>
              <span className={`status-badge ${selectedContact.status}`}>
                {selectedContact.status}
              </span>
            </div>
            
            <div className="message-section">
              <strong>Message:</strong>
              <div className="message-content">
                {selectedContact.message}
              </div>
            </div>

            <div className="status-update-section">
              <strong>Update Status:</strong>
              <div className="status-buttons">
                {['new', 'read', 'responded'].map((status) => (
                  <button
                    key={status}
                    className={`btn btn-sm ${selectedContact.status === status ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => updateContactStatus(status)}
                    disabled={updatingStatus || selectedContact.status === status}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
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
        <p>Are you sure you want to delete the contact submission from "{contactToDelete?.name}"? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default AdminContacts;
