document.addEventListener('DOMContentLoaded', () => {
  let products = []; // [{name, price}]
  const orderForm = document.getElementById('orderForm');
  const productFields = document.getElementById('productFields');
  const addProductBtn = document.getElementById('addProductBtn');
  const totalPriceDisplay = document.getElementById('totalPrice');
  const modal = document.getElementById('orderModal');
  const orderNumberDisplay = document.getElementById('orderNumber');
  const closeModalBtn = document.getElementById('closeModalBtn');

  let productCount = 1;

  // Load products from backend (which reads Excel/CSV from Drive/OneDrive)
  fetch('/api/products')
    .then(r => r.json())
    .then(data => {
      products = Array.isArray(data) ? data : [];
      initProductRow(document.querySelector('.product-row'));
      updateTotal();
    })
    .catch(err => {
      console.error('Failed to load products:', err);
      alert('Could not load the product list. Please check the backend and PRODUCT_SHEET_URL.');
      initProductRow(document.querySelector('.product-row')); // still allow typing
    });

  addProductBtn.addEventListener('click', () => {
    if (productCount >= 20) {
      alert('Maximum 20 products allowed per order');
      return;
    }
    productCount++;
    const row = document.createElement('div');
    row.className = 'product-row';
    row.innerHTML = `
      <div class="form-group product-search">
        <label>Product ${productCount}</label>
        <input type="text" class="product-input" placeholder="Search products..." autocomplete="off">
        <div class="suggestions"></div>
      </div>
      <div class="form-group quantity">
        <label>Quantity</label>
        <input type="number" min="1" value="1" class="quantity-input">
      </div>
      <div class="form-group price">
        <label>Price</label>
        <div class="price-display">₹0</div>
      </div>
    `;
    productFields.appendChild(row);
    initProductRow(row);
    updateTotal();
  });

  function initProductRow(row) {
    const productInput = row.querySelector('.product-input');
    const suggestions = row.querySelector('.suggestions');
    const quantityInput = row.querySelector('.quantity-input');
    const priceDisplay = row.querySelector('.price-display');

    let selected = null;

    function showSuggestions(list) {
      suggestions.innerHTML = '';
      if (!list.length) {
        suggestions.innerHTML = '<div class="suggestion-item">No products found</div>';
      } else {
        list.forEach(p => {
          const item = document.createElement('div');
          item.className = 'suggestion-item';
          item.textContent = `${p.name}`;
          item.addEventListener('click', () => {
            productInput.value = p.name;
            selected = p;
            suggestions.style.display = 'none';
            updatePrice();
          });
          suggestions.appendChild(item);
        });
      }
      suggestions.style.display = 'block';
    }

    productInput.addEventListener('input', () => {
      const q = productInput.value.trim().toLowerCase();
      if (q.length < 2) { suggestions.style.display = 'none'; return; }
      const filtered = products.filter(p => p.name.toLowerCase().includes(q)).slice(0, 50);
      showSuggestions(filtered);
    });

    document.addEventListener('click', (e) => {
      if (!row.contains(e.target)) suggestions.style.display = 'none';
    });

    quantityInput.addEventListener('input', updatePrice);

    function updatePrice() {
      const qty = Math.max(1, parseInt(quantityInput.value || '1', 10));
      let price = 0;
      if (!selected || selected.name.toLowerCase() !== productInput.value.trim().toLowerCase()) {
        // try exact match from full list
        const exact = products.find(p => p.name.toLowerCase() === productInput.value.trim().toLowerCase());
        if (exact) selected = exact;
      }
      if (selected) {
        price = (selected.price || 0) * qty;
      }
      priceDisplay.textContent = `₹${Math.round(price)}`;
      updateTotal();
    }

    // Store a handle so we can read back later
    row._getItem = () => {
      const qty = Math.max(1, parseInt(quantityInput.value || '1', 10));
      const name = productInput.value.trim();
      const exact = products.find(p => p.name.toLowerCase() === name.toLowerCase());
      const unit = exact ? exact.price : 0;
      const line = unit * qty;
      return name ? { name, quantity: qty, unit_price: unit, line_total: line } : null;
    };

    updatePrice();
  }

  function updateTotal() {
    let total = 0;
    document.querySelectorAll('.product-row').forEach(row => {
      const item = row._getItem ? row._getItem() : null;
      if (item) total += item.line_total || 0;
    });
    totalPriceDisplay.textContent = `₹${Math.round(total)}`;
  }

  // Submit order → backend emails + returns order number
  document.getElementById('orderForm').addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validations
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    if (!name || !/^[a-zA-Z\s]+$/.test(name)) {
      alert('Please enter a valid name (letters and spaces only)');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    const addrInputs = Array.from(document.querySelectorAll('.order-section input[type="text"]')).slice(0, 4);
    const address = addrInputs.map(i => i.value.trim());
    if (address.some(v => !v)) {
      alert('Please complete all 4 address lines.');
      return;
    }

    const items = Array.from(document.querySelectorAll('.product-row'))
      .map(row => row._getItem && row._getItem())
      .filter(Boolean);

    if (!items.length) {
      alert('Please add at least one valid product.');
      return;
    }

    const total = items.reduce((s, it) => s + (it.line_total || 0), 0);

    fetch('/api/order', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        customer: { name, phone, address },
        products: items,
        total
      })
    })
      .then(r => r.json())
      .then(res => {
        const orderNo = res.order_number || 'THO-UNKNOWN';
        orderNumberDisplay.textContent = orderNo;
        modal.style.display = 'flex';
      })
      .catch(err => {
        console.error(err);
        alert('Order failed to submit. Please try again.');
      });
  });

  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    orderForm.reset();
    productFields.innerHTML = document.querySelector('.product-row').outerHTML;
    productCount = 1;
    initProductRow(document.querySelector('.product-row'));
    updateTotal();
  });

  document.querySelector('.close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
  });
});
