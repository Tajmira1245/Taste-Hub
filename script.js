// ==========================================
// DAY 3: Three-Page Navigation (Home, About, Dashboard)
// ==========================================
function showPage(pageId, btnElement) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(pageId).classList.add('active');
    if (btnElement) btnElement.classList.add('active');
}

// ==========================================
// DAY 4: Database Simulation (JSON in LocalStorage)
// ==========================================
let currentUser = "Guest Customer";
let orders = JSON.parse(localStorage.getItem('tasteHubOrders')) || [
    { id: 101, customer: 'Rahim Ahmed', food: 'Classic Beef Burger', qty: 2, price: 350, status: 'Delivered' },
    { id: 102, customer: 'Sadia Islam', food: 'BBQ Chicken Pizza', qty: 1, price: 650, status: 'Preparing' }
];

function saveToDatabase() {
    localStorage.setItem('tasteHubOrders', JSON.stringify(orders));
}

// ==========================================
// DAY 1: Customer Registration
// ==========================================
const regForm = document.getElementById('regForm');
const regMessage = document.getElementById('regMessage');

regForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('username').value.trim();
    const address = document.getElementById('address').value.trim();
    const password = document.getElementById('password').value;

    if (password.length < 6) {
        regMessage.style.color = 'red';
        regMessage.textContent = '❌ Password must be at least 6 characters!';
        return;
    }

    currentUser = name;
    document.getElementById('customerInput').value = name;
    document.getElementById('activeUserBanner').innerHTML = `Logged in as: <strong>${name}</strong> (📍 ${address})`;
    
    regMessage.style.color = 'green';
    regMessage.textContent = `✅ Welcome, ${name}! Redirecting to Dashboard...`;
    regForm.reset();

    setTimeout(() => {
        const dashBtn = document.querySelectorAll('.nav-btn')[2];
        showPage('dashboard', dashBtn);
    }, 1000);
});

// হোম পেজ থেকে কুইক অর্ডার বাটন
function quickOrder(foodName, price) {
    const newOrder = {
        id: Date.now(),
        customer: currentUser,
        food: foodName,
        qty: 1,
        price: price,
        status: 'Pending'
    };
    orders.push(newOrder);
    saveToDatabase();
    renderTable();
    
    const dashBtn = document.querySelectorAll('.nav-btn')[2];
    showPage('dashboard', dashBtn);
}

// ==========================================
// DAY 4 & DAY 5: CRUD Operations (GET, POST, PUT, DELETE)
// ==========================================
const orderForm = document.getElementById('orderForm');
const orderTableBody = document.getElementById('orderTableBody');

// GET: Read & Display Data in Table
function renderTable() {
    orderTableBody.innerHTML = '';
    let grandTotal = 0;

    orders.forEach(order => {
        const itemTotal = order.qty * order.price;
        grandTotal += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.customer}</td>
            <td><strong>${order.food}</strong></td>
            <td>${order.qty}</td>
            <td>৳${itemTotal}</td>
            <td><span class="status-pill status-${order.status}">${order.status}</span></td>
            <td>
                <button class="edit-btn" onclick="editOrder(${order.id})">Edit</button>
                <button class="del-btn" onclick="deleteOrder(${order.id})">Delete</button>
            </td>
        `;
        orderTableBody.appendChild(row);
    });

    document.getElementById('navOrderCount').textContent = `Orders: ${orders.length}`;
    document.getElementById('totalBill').textContent = `৳${grandTotal}`;
}

// POST (Create) & PUT (Update)
orderForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const editId = document.getElementById('editOrderId').value;
    const customer = document.getElementById('customerInput').value.trim();
    const food = document.getElementById('foodInput').value.trim();
    const qty = parseInt(document.getElementById('qtyInput').value);
    const price = parseInt(document.getElementById('priceInput').value);
    const status = document.getElementById('statusInput').value;

    if (editId) {
        // PUT: Update existing order
        orders = orders.map(order => 
            order.id == editId ? { ...order, customer, food, qty, price, status } : order
        );
        document.getElementById('editOrderId').value = '';
        document.getElementById('submitOrderBtn').textContent = 'Add Order';
    } else {
        // POST: Create new order
        const newOrder = {
            id: Date.now(),
            customer,
            food,
            qty,
            price,
            status
        };
        orders.push(newOrder);
    }

    saveToDatabase();
    orderForm.reset();
    document.getElementById('qtyInput').value = 1;
    renderTable();
});

// ফর্মে ডাটা লোড করে Edit করার প্রস্তুতি
function editOrder(id) {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    document.getElementById('editOrderId').value = order.id;
    document.getElementById('customerInput').value = order.customer;
    document.getElementById('foodInput').value = order.food;
    document.getElementById('qtyInput').value = order.qty;
    document.getElementById('priceInput').value = order.price;
    document.getElementById('statusInput').value = order.status;
    document.getElementById('submitOrderBtn').textContent = 'Update Order';
}

// DELETE: Remove order
function deleteOrder(id) {
    orders = orders.filter(order => order.id !== id);
    saveToDatabase();
    renderTable();
}

// শুরুতে টেবিল রেন্ডার করা
renderTable();
