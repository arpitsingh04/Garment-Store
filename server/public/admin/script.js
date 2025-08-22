// DOM Elements
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');
const sidebarMenuItems = document.querySelectorAll('.sidebar-menu li');
const pages = document.querySelectorAll('.page');
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const adminName = document.getElementById('adminName');

// Modal elements
const productModal = new bootstrap.Modal(document.getElementById('productModal'));
const galleryModal = new bootstrap.Modal(document.getElementById('galleryModal'));
const contactViewModal = new bootstrap.Modal(document.getElementById('contactViewModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

// API Base URL
const API_URL = '/api';

// Simple browser identification without fingerprinting
function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  let browserName = "Unknown";

  if (userAgent.indexOf("Firefox") > -1) {
    browserName = "Firefox";
  } else if (userAgent.indexOf("SamsungBrowser") > -1) {
    browserName = "Samsung Browser";
  } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    browserName = "Opera";
  } else if (userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Edg") > -1) {
    browserName = "Edge";
  } else if (userAgent.indexOf("Chrome") > -1) {
    browserName = "Chrome";
  } else if (userAgent.indexOf("Safari") > -1) {
    browserName = "Safari";
  }

  return {
    browser: browserName,
    userAgent: userAgent,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    language: navigator.language
  };
}

// Check if user is logged in
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    showPage('loginPage');
    // Hide sidebar and topbar when on login page
    document.querySelector('.sidebar').style.display = 'none';
    document.querySelector('.topbar').style.display = 'none';
    document.querySelector('.main-content').style.marginLeft = '0';
    return false;
  }

  // Show sidebar and topbar when logged in
  document.querySelector('.sidebar').style.display = 'block';
  document.querySelector('.topbar').style.display = 'flex';

  // Apply margin only on larger screens
  if (window.innerWidth >= 768) {
    document.querySelector('.main-content').style.marginLeft = '250px';
  } else {
    document.querySelector('.main-content').style.marginLeft = '0';
  }

  // Fetch user info
  fetch(`${API_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Session-ID': getSessionId()
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Not authenticated');
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      adminName.textContent = data.data.name;
      showPage('dashboardPage');
      loadDashboardData();
    } else {
      localStorage.removeItem('token');
      showPage('loginPage');
      // Hide sidebar and topbar when on login page
      document.querySelector('.sidebar').style.display = 'none';
      document.querySelector('.topbar').style.display = 'none';
      document.querySelector('.main-content').style.marginLeft = '0';
    }
  })
  .catch(error => {
    console.error('Auth error:', error);
    localStorage.removeItem('token');
    showPage('loginPage');
    // Hide sidebar and topbar when on login page
    document.querySelector('.sidebar').style.display = 'none';
    document.querySelector('.topbar').style.display = 'none';
    document.querySelector('.main-content').style.marginLeft = '0';
  });

  return true;
}

// Show specific page
function showPage(pageId) {
  pages.forEach(page => {
    page.classList.add('d-none');
  });

  document.getElementById(pageId).classList.remove('d-none');

  // Update active sidebar item
  sidebarMenuItems.forEach(item => {
    if (item.dataset.page === pageId.replace('Page', '')) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Load dashboard data
function loadDashboardData() {
  const token = localStorage.getItem('token');

  // Fetch products count
  fetch(`${API_URL}/products`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Session-ID': getSessionId()
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      document.getElementById('productCount').textContent = data.count;

      // Load recent products
      const recentProducts = data.data.slice(0, 5);
      const recentProductsTable = document.getElementById('recentProductsTable');
      recentProductsTable.innerHTML = '';

      if (recentProducts.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="3" class="text-center">No products found</td>`;
        recentProductsTable.appendChild(row);
      } else {
        recentProducts.forEach(product => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td class="text-truncate" style="max-width: 100px;">${product.name}</td>
            <td>${product.category}</td>
            <td>${formatDate(product.createdAt)}</td>
          `;
          recentProductsTable.appendChild(row);
        });
      }
    }
  })
  .catch(error => console.error('Error loading products:', error));

  // Fetch gallery count
  fetch(`${API_URL}/gallery`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Session-ID': getSessionId()
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      document.getElementById('galleryCount').textContent = data.count;
    }
  })
  .catch(error => console.error('Error loading gallery:', error));

  // Fetch contacts count and recent contacts
  fetch(`${API_URL}/contact`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Session-ID': getSessionId()
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      document.getElementById('contactCount').textContent = data.count;

      // Load recent contacts
      const recentContacts = data.data.slice(0, 5);
      const recentContactsTable = document.getElementById('recentContactsTable');
      recentContactsTable.innerHTML = '';

      if (recentContacts.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4" class="text-center">No contacts found</td>`;
        recentContactsTable.appendChild(row);
      } else {
        recentContacts.forEach(contact => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td class="text-truncate" style="max-width: 80px;">${contact.name}</td>
            <td class="text-truncate" style="max-width: 80px;">${contact.product || 'N/A'}</td>
            <td>${formatDate(contact.createdAt)}</td>
            <td><span class="badge badge-${contact.status}">${contact.status}</span></td>
          `;
          recentContactsTable.appendChild(row);
        });
      }
    }
  })
  .catch(error => console.error('Error loading contacts:', error));
}

// Load products
function loadProducts() {
  const token = localStorage.getItem('token');

  fetch(`${API_URL}/products`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Session-ID': getSessionId()
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const productsTable = document.getElementById('productsTable');
      productsTable.innerHTML = '';

      data.data.forEach(product => {
        // Log the image path for debugging
        console.log('Product image path:', product.image);

        // Construct the correct image URL
        let imgSrc;
        if (product.image.startsWith('http')) {
          imgSrc = product.image;
        } else if (product.image.startsWith('/uploads/')) {
          imgSrc = product.image;
        } else {
          imgSrc = '/uploads/' + product.image;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
          <td><img src="${imgSrc}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td class="d-none d-md-table-cell">${product.description.substring(0, 50)}${product.description.length > 50 ? '...' : ''}</td>
          <td>
            <span class="badge ${product.featured ? 'badge-featured' : 'badge-not-featured'}">
              ${product.featured ? 'Featured' : 'Not Featured'}
            </span>
          </td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-sm btn-primary edit-product" data-id="${product._id}" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-danger delete-product" data-id="${product._id}" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        `;
        productsTable.appendChild(row);
      });

      // Add event listeners to edit and delete buttons
      document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', () => editProduct(button.dataset.id));
      });

      document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', () => {
          document.getElementById('deleteId').value = button.dataset.id;
          document.getElementById('deleteType').value = 'product';
          deleteModal.show();
        });
      });
    }
  })
  .catch(error => console.error('Error loading products:', error));
}

// Load gallery
function loadGallery() {
  const token = localStorage.getItem('token');

  fetch(`${API_URL}/gallery`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Session-ID': getSessionId()
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const galleryTable = document.getElementById('galleryTable');
      galleryTable.innerHTML = '';

      data.data.forEach(item => {
        // Log the image path for debugging
        console.log('Gallery item image path:', item.image);

        // Construct the correct image URL
        let imgSrc;
        if (item.image.startsWith('http')) {
          imgSrc = item.image;
        } else if (item.image.startsWith('/uploads/')) {
          imgSrc = item.image;
        } else {
          imgSrc = '/uploads/' + item.image;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
          <td><img src="${imgSrc}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover;"></td>
          <td>${item.title}</td>
          <td>${item.category}</td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-sm btn-primary edit-gallery" data-id="${item._id}" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-danger delete-gallery" data-id="${item._id}" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        `;
        galleryTable.appendChild(row);
      });

      // Add event listeners to edit and delete buttons
      document.querySelectorAll('.edit-gallery').forEach(button => {
        button.addEventListener('click', () => editGallery(button.dataset.id));
      });

      document.querySelectorAll('.delete-gallery').forEach(button => {
        button.addEventListener('click', () => {
          document.getElementById('deleteId').value = button.dataset.id;
          document.getElementById('deleteType').value = 'gallery';
          deleteModal.show();
        });
      });
    }
  })
  .catch(error => console.error('Error loading gallery:', error));
}

// Load contacts
function loadContacts() {
  const token = localStorage.getItem('token');

  fetch(`${API_URL}/contact`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Session-ID': getSessionId()
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const contactsTable = document.getElementById('contactsTable');
      contactsTable.innerHTML = '';

      data.data.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${contact.name}</td>
          <td class="d-none d-md-table-cell">${contact.email}</td>
          <td class="d-none d-sm-table-cell">${contact.phone}</td>
          <td class="d-none d-sm-table-cell">${contact.product || 'N/A'}</td>
          <td>${formatDate(contact.createdAt)}</td>
          <td><span class="badge badge-${contact.status}">${contact.status}</span></td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-sm btn-primary view-contact" data-id="${contact._id}" title="View">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-danger delete-contact" data-id="${contact._id}" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        `;
        contactsTable.appendChild(row);
      });

      // Add event listeners to view and delete buttons
      document.querySelectorAll('.view-contact').forEach(button => {
        button.addEventListener('click', () => viewContact(button.dataset.id));
      });

      document.querySelectorAll('.delete-contact').forEach(button => {
        button.addEventListener('click', () => {
          document.getElementById('deleteId').value = button.dataset.id;
          document.getElementById('deleteType').value = 'contact';
          deleteModal.show();
        });
      });
    }
  })
  .catch(error => console.error('Error loading contacts:', error));
}

// Event Listeners
// Generate a simple session ID that doesn't rely on fingerprinting
function generateSessionId() {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 1000000);
  return `session_${timestamp}_${randomPart}`;
}

// Store or retrieve session ID
function getSessionId() {
  let sessionId = localStorage.getItem('admin_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('admin_session_id', sessionId);
  }
  return sessionId;
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize session tracking
  const sessionId = getSessionId();
  console.log('Session initialized:', sessionId);

  // Check authentication
  checkAuth();

  // Toggle sidebar on mobile
  toggleSidebarBtn.addEventListener('click', () => {
    sidebar.classList.add('active');

    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
    }

    // Show the overlay
    overlay.classList.add('active');

    // Prevent body scrolling when sidebar is open
    document.body.style.overflow = 'hidden';

    // Add click event to close sidebar
    overlay.addEventListener('click', closeSidebar);
  });

  // Function to close sidebar
  function closeSidebar() {
    sidebar.classList.remove('active');

    // Hide overlay
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }

    // Restore body scrolling
    document.body.style.overflow = '';
  }

  closeSidebarBtn.addEventListener('click', closeSidebar);

  // Sidebar menu navigation
  sidebarMenuItems.forEach(item => {
    if (item.id !== 'logoutBtn') {
      item.addEventListener('click', () => {
        const pageId = item.dataset.page + 'Page';
        showPage(pageId);

        // Load data based on page
        if (pageId === 'productsPage') {
          loadProducts();
        } else if (pageId === 'galleryPage') {
          loadGallery();
        } else if (pageId === 'contactsPage') {
          loadContacts();
        } else if (pageId === 'dashboardPage') {
          loadDashboardData();
        }

        // Close sidebar on mobile
        if (window.innerWidth < 768) {
          closeSidebar();
        }
      });
    }
  });

  // Login form submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const browserInfo = getBrowserInfo();

    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        clientInfo: {
          browser: browserInfo.browser,
          screenSize: `${browserInfo.screenWidth}x${browserInfo.screenHeight}`,
          language: browserInfo.language
        }
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('token', data.token);
        checkAuth();
      } else {
        loginError.textContent = data.message || 'Login failed';
        loginError.classList.remove('d-none');
      }
    })
    .catch(error => {
      console.error('Login error:', error);
      loginError.textContent = 'An error occurred. Please try again.';
      loginError.classList.remove('d-none');
    });
  });

  // Logout
  logoutBtn.addEventListener('click', () => {
    const token = localStorage.getItem('token');

    // Call logout API
    fetch(`${API_URL}/auth/logout`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Session-ID': getSessionId()
      }
    })
    .then(() => {
      // Clear session data
      localStorage.removeItem('token');
      localStorage.removeItem('admin_session_id');

      showPage('loginPage');

      // Hide sidebar and topbar when on login page
      document.querySelector('.sidebar').style.display = 'none';
      document.querySelector('.topbar').style.display = 'none';
      document.querySelector('.main-content').style.marginLeft = '0';

      // Make sure sidebar is closed and overlay is removed
      sidebar.classList.remove('active');
      const overlay = document.querySelector('.sidebar-overlay');
      if (overlay) {
        overlay.classList.remove('active');
      }
      document.body.style.overflow = '';

      // Generate a new session ID for next login
      generateSessionId();
    })
    .catch(error => {
      console.error('Logout error:', error);
      // Clear session data
      localStorage.removeItem('token');
      localStorage.removeItem('admin_session_id');

      showPage('loginPage');

      // Hide sidebar and topbar when on login page
      document.querySelector('.sidebar').style.display = 'none';
      document.querySelector('.topbar').style.display = 'none';
      document.querySelector('.main-content').style.marginLeft = '0';

      // Make sure sidebar is closed and overlay is removed
      sidebar.classList.remove('active');
      const overlay = document.querySelector('.sidebar-overlay');
      if (overlay) {
        overlay.classList.remove('active');
      }
      document.body.style.overflow = '';

      // Generate a new session ID for next login
      generateSessionId();
    });
  });

  // Handle window resize for responsive layout
  window.addEventListener('resize', () => {
    if (localStorage.getItem('token')) {
      if (window.innerWidth >= 768) {
        document.querySelector('.main-content').style.marginLeft = '250px';
      } else {
        document.querySelector('.main-content').style.marginLeft = '0';
      }
    }
  });

  // Initialize the rest of the event listeners and functionality
  initializeAdminPanel();
});

// Initialize admin panel functionality
function initializeAdminPanel() {
  // Product form handling
  const addProductBtn = document.getElementById('addProductBtn');
  const saveProductBtn = document.getElementById('saveProductBtn');
  const productForm = document.getElementById('productForm');
  const productImageInput = document.getElementById('productImage');
  const productImagePreview = document.getElementById('productImagePreview');

  addProductBtn.addEventListener('click', () => {
    document.getElementById('productModalTitle').textContent = 'Add Product';
    productForm.reset();
    document.getElementById('productId').value = '';
    productImagePreview.innerHTML = '';
    productModal.show();
  });

  productImageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        productImagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      };

      reader.readAsDataURL(file);
    }
  });

  saveProductBtn.addEventListener('click', saveProduct);

  // Gallery form handling
  const addGalleryBtn = document.getElementById('addGalleryBtn');
  const saveGalleryBtn = document.getElementById('saveGalleryBtn');
  const galleryForm = document.getElementById('galleryForm');
  const galleryImageInput = document.getElementById('galleryImage');
  const galleryImagePreview = document.getElementById('galleryImagePreview');

  addGalleryBtn.addEventListener('click', () => {
    document.getElementById('galleryModalTitle').textContent = 'Add Gallery Item';
    galleryForm.reset();
    document.getElementById('galleryId').value = '';
    galleryImagePreview.innerHTML = '';
    galleryModal.show();
  });

  galleryImageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        galleryImagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      };

      reader.readAsDataURL(file);
    }
  });

  saveGalleryBtn.addEventListener('click', saveGallery);

  // Contact status update
  const updateStatusBtn = document.getElementById('updateStatusBtn');
  updateStatusBtn.addEventListener('click', updateContactStatus);

  // Delete confirmation
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  confirmDeleteBtn.addEventListener('click', confirmDelete);
}

// Edit product
function editProduct(id) {
  const token = localStorage.getItem('token');

  fetch(`${API_URL}/products/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const product = data.data;

      document.getElementById('productModalTitle').textContent = 'Edit Product';
      document.getElementById('productId').value = product._id;
      document.getElementById('productName').value = product.name;
      document.getElementById('productCategory').value = product.category;
      document.getElementById('productDescription').value = product.description;
      document.getElementById('productFeatured').checked = product.featured || false;

      // Show image preview
      if (product.image) {
        // Log the image path for debugging
        console.log('Edit product image path:', product.image);

        // Construct the correct image URL
        let imgSrc;
        if (product.image.startsWith('http')) {
          imgSrc = product.image;
        } else if (product.image.startsWith('/uploads/')) {
          imgSrc = product.image;
        } else {
          imgSrc = '/uploads/' + product.image;
        }

        productImagePreview.innerHTML = `<img src="${imgSrc}" alt="${product.name}" style="max-width: 100%; max-height: 200px; object-fit: contain;">`;
      } else {
        productImagePreview.innerHTML = '';
      }

      productModal.show();
    }
  })
  .catch(error => console.error('Error fetching product:', error));
}

// Save product
async function saveProduct() {
  const token = localStorage.getItem('token');
  const productId = document.getElementById('productId').value;
  const name = document.getElementById('productName').value;
  const category = document.getElementById('productCategory').value;
  const description = document.getElementById('productDescription').value;
  const featured = document.getElementById('productFeatured').checked;
  const imageFile = document.getElementById('productImage').files[0];

  if (!name || !category || !description) {
    alert('Please fill all required fields');
    return;
  }

  let imageUrl = '';
  let existingImage = '';

  // If editing, get the existing product to retrieve the current image
  if (productId) {
    try {
      const productResponse = await fetch(`${API_URL}/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const productData = await productResponse.json();

      if (productData.success) {
        existingImage = productData.data.image;
      }
    } catch (error) {
      console.error('Error fetching existing product:', error);
    }
  }

  // Upload image if selected
  if (imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const uploadResponse = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Session-ID': getSessionId()
        },
        body: formData
      });

      const uploadData = await uploadResponse.json();

      if (uploadData.success) {
        imageUrl = uploadData.data.filePath;
      } else {
        throw new Error(uploadData.message || 'Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      return;
    }
  }

  // Prepare product data
  const productData = {
    name,
    category,
    description,
    featured
  };

  // Use new image if uploaded, otherwise keep existing image when editing
  if (imageUrl) {
    productData.image = imageUrl;
  } else if (existingImage && productId) {
    productData.image = existingImage;
  } else if (!productId) {
    // For new products, image is required
    alert('Please select an image');
    return;
  }

  // Create or update product
  const url = productId ? `${API_URL}/products/${productId}` : `${API_URL}/products`;
  const method = productId ? 'PUT' : 'POST';

  fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Session-ID': getSessionId()
    },
    body: JSON.stringify(productData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      productModal.hide();
      loadProducts();
      loadDashboardData();
    } else {
      alert(data.message || 'Failed to save product');
    }
  })
  .catch(error => {
    console.error('Error saving product:', error);
    alert('An error occurred. Please try again.');
  });
}

// Edit gallery item
function editGallery(id) {
  const token = localStorage.getItem('token');

  fetch(`${API_URL}/gallery/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const item = data.data;

      document.getElementById('galleryModalTitle').textContent = 'Edit Gallery Item';
      document.getElementById('galleryId').value = item._id;
      document.getElementById('galleryTitle').value = item.title;
      document.getElementById('galleryCategory').value = item.category;

      // Show image preview
      if (item.image) {
        // Log the image path for debugging
        console.log('Edit gallery image path:', item.image);

        // Construct the correct image URL
        let imgSrc;
        if (item.image.startsWith('http')) {
          imgSrc = item.image;
        } else if (item.image.startsWith('/uploads/')) {
          imgSrc = item.image;
        } else {
          imgSrc = '/uploads/' + item.image;
        }

        galleryImagePreview.innerHTML = `<img src="${imgSrc}" alt="${item.title}" style="max-width: 100%; max-height: 200px; object-fit: contain;">`;
      } else {
        galleryImagePreview.innerHTML = '';
      }

      galleryModal.show();
    }
  })
  .catch(error => console.error('Error fetching gallery item:', error));
}

// Save gallery item
async function saveGallery() {
  const token = localStorage.getItem('token');
  const galleryId = document.getElementById('galleryId').value;
  const title = document.getElementById('galleryTitle').value;
  const category = document.getElementById('galleryCategory').value;
  const imageFile = document.getElementById('galleryImage').files[0];

  if (!title || !category) {
    alert('Please fill all required fields');
    return;
  }

  let imageUrl = '';
  let existingImage = '';

  // If editing, get the existing gallery item to retrieve the current image
  if (galleryId) {
    try {
      const galleryResponse = await fetch(`${API_URL}/gallery/${galleryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const galleryData = await galleryResponse.json();

      if (galleryData.success) {
        existingImage = galleryData.data.image;
      }
    } catch (error) {
      console.error('Error fetching existing gallery item:', error);
    }
  }

  // Upload image if selected
  if (imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const uploadResponse = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Session-ID': getSessionId()
        },
        body: formData
      });

      const uploadData = await uploadResponse.json();

      if (uploadData.success) {
        imageUrl = uploadData.data.filePath;
      } else {
        throw new Error(uploadData.message || 'Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      return;
    }
  }

  // Prepare gallery data
  const galleryData = {
    title,
    category
  };

  // Use new image if uploaded, otherwise keep existing image when editing
  if (imageUrl) {
    galleryData.image = imageUrl;
  } else if (existingImage && galleryId) {
    galleryData.image = existingImage;
  } else if (!galleryId) {
    // For new gallery items, image is required
    alert('Please select an image');
    return;
  }

  // Create or update gallery item
  const url = galleryId ? `${API_URL}/gallery/${galleryId}` : `${API_URL}/gallery`;
  const method = galleryId ? 'PUT' : 'POST';

  fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Session-ID': getSessionId()
    },
    body: JSON.stringify(galleryData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      galleryModal.hide();
      loadGallery();
      loadDashboardData();
    } else {
      alert(data.message || 'Failed to save gallery item');
    }
  })
  .catch(error => {
    console.error('Error saving gallery item:', error);
    alert('An error occurred. Please try again.');
  });
}

// View contact details
function viewContact(id) {
  const token = localStorage.getItem('token');

  fetch(`${API_URL}/contact/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const contact = data.data;

      document.getElementById('viewName').textContent = contact.name;
      document.getElementById('viewEmail').textContent = contact.email;
      document.getElementById('viewPhone').textContent = contact.phone;
      document.getElementById('viewProduct').textContent = contact.product || 'N/A';
      document.getElementById('viewDate').textContent = formatDate(contact.createdAt);
      document.getElementById('viewStatus').textContent = contact.status;
      document.getElementById('viewMessage').textContent = contact.message;
      document.getElementById('contactStatus').value = contact.status;

      // Store contact ID for status update
      document.getElementById('contactStatus').dataset.id = contact._id;

      contactViewModal.show();
    }
  })
  .catch(error => console.error('Error fetching contact:', error));
}

// Update contact status
function updateContactStatus() {
  const token = localStorage.getItem('token');
  const contactId = document.getElementById('contactStatus').dataset.id;
  const status = document.getElementById('contactStatus').value;

  fetch(`${API_URL}/contact/${contactId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      contactViewModal.hide();
      loadContacts();
      loadDashboardData();
    } else {
      alert(data.message || 'Failed to update status');
    }
  })
  .catch(error => {
    console.error('Error updating status:', error);
    alert('An error occurred. Please try again.');
  });
}

// Confirm delete
function confirmDelete() {
  const token = localStorage.getItem('token');
  const id = document.getElementById('deleteId').value;
  const type = document.getElementById('deleteType').value;

  if (!token) {
    alert('You must be logged in to perform this action');
    return;
  }

  if (!id || !type) {
    alert('Missing item information');
    return;
  }

  let url = '';

  switch (type) {
    case 'product':
      url = `${API_URL}/products/${id}`;
      break;
    case 'gallery':
      url = `${API_URL}/gallery/${id}`;
      break;
    case 'contact':
      url = `${API_URL}/contact/${id}`;
      break;
    default:
      alert('Invalid item type');
      return;
  }

  fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Session-ID': getSessionId()
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      deleteModal.hide();

      // Reload appropriate data
      if (type === 'product') {
        loadProducts();
      } else if (type === 'gallery') {
        loadGallery();
      } else if (type === 'contact') {
        loadContacts();
      }

      loadDashboardData();
    } else {
      alert(data.message || 'Failed to delete item');
    }
  })
  .catch(error => {
    console.error('Error deleting item:', error);
    alert('An error occurred. Please try again.');
  });
}
