        // بيانات المنتجات المصغرة
const products = [
    { id: 1, name: "هاتف آيفون 15", category: "phones", price: 999, image: "https://via.placeholder.com/200?text=iPhone+15" },
    { id: 2, name: "سامسونج جالاكسي S24", category: "phones", price: 899, image: "https://via.placeholder.com/200?text=Galaxy+S24" },
    { id: 3, name: "لابتوب ماك بوك برو", category: "laptops", price: 1299, image: "https://via.placeholder.com/200?text=MacBook+Pro" },
    { id: 4, name: "لابتوب ديل XPS", category: "laptops", price: 1100, image: "https://via.placeholder.com/200?text=Dell+XPS" },
    { id: 5, name: "سماعات أبل إيربودز", category: "accessories", price: 199, image: "https://via.placeholder.com/200?text=AirPods" },
    { id: 6, name: "ساعة ذكية", category: "accessories", price: 150, image: "https://via.placeholder.com/200?text=Smart+Watch" }
];

let cart = [];

// عناصر DOM
const productGrid = document.getElementById("product-grid");
const cartSidebar = document.getElementById("cart-sidebar");
const cartBtn = document.getElementById("cart-btn");
const closeCart = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const filterBtns = document.querySelectorAll(".filter-btn");

// 1. عرض المنتجات
function displayProducts(items) {
    productGrid.innerHTML = items.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price} $</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">إضافة للسلة</button>
        </div>
    `).join('');
}

// 2. فلترة المنتجات حسب القسم
filterBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        filterBtns.forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        
        const category = e.target.dataset.category;
        if (category === "all") {
            displayProducts(products);
        } else {
            const filtered = products.filter(p => p.category === category);
            displayProducts(filtered);
        }
    });
});

// 3. التحكم في السلة (فتح وإغلاق)
cartBtn.addEventListener("click", () => cartSidebar.classList.add("open"));
closeCart.addEventListener("click", () => cartSidebar.classList.remove("open"));

// 4. إضافة عنصر للسلة
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

// 5. تحديث واجهة السلة
function updateCartUI() {
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h4>${item.name}</h4>
                <p>${item.price} $ × ${item.qty}</p>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:red; cursor:pointer;">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    // حساب العدد والإجمالي
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    cartCount.innerText = totalQty;
    cartTotal.innerText = totalPrice;
}

// 6. حذف عنصر من السلة
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// تشغيل عرض المنتجات عند التحميل
displayProducts(products);