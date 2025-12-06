// shop.js – shared data + helpers for the toy shop

const TOYSHOP_CART_KEY = "toyshop_cart";
const TOYSHOP_ORDER_KEY = "toyshop_last_order";

const toyProducts = [
  {
    id: "TOY-ROBOT-001",
    name: "Retro Space Robot",
    price: 39.99,
    category: "Robots"
  },
  {
    id: "TOY-DINO-001",
    name: "Neon Dino Plush",
    price: 24.5,
    category: "Plush Toys"
  },
  {
    id: "TOY-BLOCKS-001",
    name: "Galaxy Building Blocks",
    price: 19.0,
    category: "Building Sets"
  }
];

function getProductById(id) {
  return toyProducts.find((p) => p.id === id) || toyProducts[0];
}

function getCart() {
  try {
    const raw = localStorage.getItem(TOYSHOP_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading cart", e);
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(TOYSHOP_CART_KEY, JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
  const product = getProductById(productId);
  let cart = getCart();
  const existing = cart.find((item) => item.item_id === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      quantity: quantity
    });
  }

  saveCart(cart);
  updateCartCountDisplay();
  return cart;
}

function clearCart() {
  localStorage.removeItem(TOYSHOP_CART_KEY);
  updateCartCountDisplay();
}

function getCartTotal(cart) {
  const c = cart || getCart();
  return c.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateCartCountDisplay() {
  const el = document.querySelector("[data-cart-count]");
  if (!el) return;
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  el.textContent = count;
}

function pushEcomEvent(eventName, params) {
  window.dataLayer = window.dataLayer || [];
  const payload = Object.assign({ event: eventName }, params || {});
  window.dataLayer.push(payload);
  console.log("dataLayer.push", payload);
}

function saveLastOrder(order) {
  localStorage.setItem(TOYSHOP_ORDER_KEY, JSON.stringify(order));
}

function getLastOrder() {
  try {
    const raw = localStorage.getItem(TOYSHOP_ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Error reading last order", e);
    return null;
  }
}

function formatPrice(value) {
  return "€" + value.toFixed(2);
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

