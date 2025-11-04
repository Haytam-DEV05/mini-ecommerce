const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))


// CHECK THE USER =>
if (!loggedUser) {
  window.location.href = 'login.html'
} else if (
  loggedUser.password === 'admin123' &&
  loggedUser.email === 'admin@test.com'
) {
  window.location.href = 'admin/admin.html'
}

function getCart () {
  if (loggedUser) {
    return JSON.parse(localStorage.getItem(`cart_${loggedUser.email}`)) || []
  } else {
    return JSON.parse(localStorage.getItem('cart')) || []
  }
}

// FUNCTION TO SAVE CART
function saveCart () {
  if (loggedUser) {
    localStorage.setItem(`cart_${loggedUser.email}`, JSON.stringify(cart))
  } else {
    localStorage.setItem('cart', JSON.stringify(cart))
  }
}

// ---------------- LOGGED USER UI ----------------
if (loggedUser) {
  document.querySelector('.logo').innerHTML = `Hi ${loggedUser.userName}`
  document.querySelector('.btn-logout').addEventListener('click', () => {
    localStorage.removeItem('loggedUser')
    window.location.href = 'login.html'
  })
} else {
  document.querySelector('.btn-logout').textContent = 'Register'
  document.querySelector('.btn-logout').addEventListener('click', e => {
    e.preventDefault()
    window.location.href = 'register.html'
  })
}

// ---------------- CART UI ----------------
const shoppingIcon = document.querySelector('.shopping-icon')
const xMark = document.querySelector('.fa-xmark')
const cartSide = document.querySelector('.cart')

shoppingIcon.addEventListener('click', () => cartSide.classList.add('active'))
xMark.addEventListener('click', () => cartSide.classList.remove('active'))

// ---------------- PRODUCTS ----------------
const boxProducts = document.querySelector('.box-products')
const filterProducts = document.querySelector('.filter-products')
let products = []

fetch('https://fakestoreapi.com/products')
  .then(response => (response.ok ? response.json() : []))
  .then(data => {
    products = data
    displayProducts(products)
  })

filterProducts.addEventListener('click', e => {
  let type = e.target.value
  if (!type) return
  let filtered =
    type === 'all' ? products : products.filter(p => p.category === type)
  displayProducts(filtered)
})

function displayProducts (param) {
  boxProducts.innerHTML = ''
  param.forEach(product => {
    boxProducts.innerHTML += `
      <div class="box-product">
        <img class="img-product" src=${product.image} alt="" />
        <div class="content-product">
          <h2 class="title-product">${product.title}</h2>
          <p class="description-product">${product.description}</p>
          <b class="product-price">${product.price} DH</b>
          <i class="fa-regular fa-square-plus add-cart" data-id=${product.id}></i>
        </div>
      </div>
    `
  })

  // ADD TO CART
  const btnAdd = document.querySelectorAll('.add-cart')
  btnAdd.forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.dataset.id
      const productToAdd = products.find(p => p.id == id)
      addToCart(productToAdd)
    })
  })
}

// ---------------- CART LOGIC ----------------
let cart = getCart()

function renderCart () {
  updateCartLength()
  displayCartProducts()
  updateTotalPrice()
}

function addToCart (product) {
  const exist = cart.find(p => p.id === product.id)
  exist ? exist.quantity++ : cart.push({ ...product, quantity: 1 })
  saveCart()
  renderCart()
}

function displayCartProducts () {
  const productsCart = document.querySelector('.products-cart')
  productsCart.innerHTML = ''
  cart.forEach(p => {
    productsCart.innerHTML += `
      <div class="product-cart">
        <div class="content-cart">
          <img src=${p.image} alt="" />
          <div class="title-cart">${p.title}</div>
          <div class="price-cart">${(p.price * p.quantity).toFixed(2)} DH</div>
        </div>
        <div class="counter">
          <b class="increment" data-id="${p.id}">+</b>
          <span class="number-Product">${p.quantity}</span>
          <b class="decrement" data-id="${p.id}">-</b>
        </div>
        <i class="fa-solid fa-trash" data-id="${p.id}"></i>
      </div>
    `
  })
}

const productsCartEl = document.querySelector('.products-cart')
productsCartEl.addEventListener('click', e => {
  const id = e.target.dataset.id
  if (!id) return
  const product = cart.find(p => p.id == id)

  if (e.target.classList.contains('increment')) product.quantity++
  if (e.target.classList.contains('decrement') && product.quantity > 1)
    product.quantity--
  if (e.target.classList.contains('fa-trash')) {
    cart = cart.filter(p => p.id != id)
  }

  saveCart()
  renderCart()
})

function updateCartLength () {
  document.querySelector('.length-Product').textContent = cart.length
}

function updateTotalPrice () {
  const totalCart = document.querySelector('.total-cart')
  const result = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  if (totalCart) totalCart.innerHTML = `${result.toFixed(2)} DH`
}

// ---------------- CHECKOUT ----------------
document.querySelector('.footer-cart button').addEventListener('click', () => {
  if (loggedUser) {
    window.location.href = 'checkout.html'
  } else {
    alert('Please login first!')
  }
})

renderCart()
