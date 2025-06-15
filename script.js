// Select DOM elements
const cartContainer = document.getElementById("cart-container");
const productsContainer = document.getElementById("products-container");
const dessertCards = document.getElementById("dessert-card-container");
const cartBtn = document.getElementById("cart-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");
const totalNumberOfItems = document.getElementById("total-items");
const cartSubTotal = document.getElementById("subtotal");
const cartTaxes = document.getElementById("taxes");
const cartTotal = document.getElementById("total");
const showHideCartSpan = document.getElementById("show-hide-cart");
let isCartShowing = false;

// Product list
const products = [
  { id: 13, name: "Red Velvet Cake", price: 6.99, category: "Cake" },
  { id: 14, name: "Blueberry Muffins", price: 5.49, category: "Muffin" },
  { id: 15, name: "Mint Chocolate Cream", price: 3.49, category: "Ice Cream" },
  { id: 16, name: "Hazelnut Chocolate", price: 7.99, category: "Chocolate" },
  { id: 17, name: "Coconut Macaroons", price: 4.75, category: "Macaron" },
  { id: 18, name: "Carrot Cake (Slice)", price: 5.25, category: "Cake" },
  { id: 19, name: "Churros (5 pcs)", price: 4.99, category: "Pastry" },
  { id: 20, name: "Oreo Cheesecake Bar", price: 6.50, category: "Cheesecake" },
  { id: 21, name: "Caramel Brownie", price: 3.99, category: "Brownie" },
  { id: 22, name: "Tiramisu Cup", price: 6.75, category: "Dessert Cup" },
];

// Render products
products.forEach(({ name, id, price, category }) => {
  dessertCards.innerHTML += `
    <div class="dessert-card">
      <h2>${name}</h2>
      <p class="dessert-price">$${price}</p>
      <p class="product-category">Category: ${category}</p>
      <button id="${id}" class="btn add-to-cart-btn">Add to Cart</button>
    </div>
  `;
});

// ShoppingCart class
class ShoppingCart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.taxRate = 7.5;
  }

  addItem(id) {
    const product = products.find(p => p.id === id);
    this.items.push(product);

    const countMap = {};
    this.items.forEach(item => {
      countMap[item.id] = (countMap[item.id] || 0) + 1;
    });

    const currentCount = countMap[product.id];
    const productCountSpan = document.getElementById(`count-${product.id}`);

    if (currentCount > 1 && productCountSpan) {
      productCountSpan.textContent = `${currentCount}x`;
    } else if (!productCountSpan) {
      productsContainer.innerHTML += `
        <div id="product-${product.id}" class="product">
          <p><span class="product-count" id="count-${product.id}"></span>${product.name}</p>
          <p>$${product.price}</p>
        </div>
      `;
    }
  }

  getCounts() {
    return this.items.length;
  }

  calculateTaxes(amount) {
    return parseFloat(((this.taxRate / 100) * amount).toFixed(2));
  }

  calculateTotal() {
    const subTotal = this.items.reduce((acc, item) => acc + item.price, 0);
    const tax = this.calculateTaxes(subTotal);
    this.total = subTotal + tax;

    cartSubTotal.textContent = `$${subTotal.toFixed(2)}`;
    cartTaxes.textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${this.total.toFixed(2)}`;

    return this.total;
  }

  clearCart() {
    if (!this.items.length) {
      alert("Your shopping cart is already empty");
      return;
    }

    const confirmClear = confirm("Are you sure you want to clear your cart?");
    if (confirmClear) {
      this.items = [];
      this.total = 0;
      productsContainer.innerHTML = "";
      totalNumberOfItems.textContent = 0;
      cartSubTotal.textContent = "$0";
      cartTaxes.textContent = "$0";
      cartTotal.textContent = "$0";
    }
  }
}

// Init cart instance
const cart = new ShoppingCart();

// Attach listeners
[...document.getElementsByClassName("add-to-cart-btn")].forEach(btn => {
  btn.addEventListener("click", e => {
    cart.addItem(Number(e.target.id));
    totalNumberOfItems.textContent = cart.getCounts();
    cart.calculateTotal();
  });
});

cartBtn.addEventListener("click", () => {
  isCartShowing = !isCartShowing;
  showHideCartSpan.textContent = isCartShowing ? "Hide" : "Show";
  cartContainer.style.display = isCartShowing ? "block" : "none";
});

clearCartBtn.addEventListener("click", cart.clearCart.bind(cart));
