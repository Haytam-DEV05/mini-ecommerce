if(!JSON.parse(localStorage.getItem("loggedUser"))){
  window.location.href = "index.html";
}

const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
let cart = JSON.parse(localStorage.getItem(`cart_${loggedUser.email}`)) || []

const tbody = document.querySelector('.tbody')
const totalPrice = document.querySelector('.total .total-cart')

// DISPLAY PRODUCTS IN CHECKOUT

if(cart.length > 0){
  cart.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td><img src="${p.image}" alt="product" style="width:60px;height:60px;object-fit:contain"></td>
        <td>${p.category}</td>
        <td><span>${p.quantity}</span></td>
        <td>${(p.price * p.quantity).toFixed(2)} DH</td>
      </tr>
    `
  })
  totalPrice.innerHTML = `${cart.reduce((acc, item) => acc + item.price*item.quantity,0).toFixed(2)} DH`
}else{
  tbody.innerHTML = `<tr><td colspan="4">🛒 Cart is empty</td></tr>`
}

// ORDER FORM
document.querySelector('.order-summary form').addEventListener('submit', e => {
  e.preventDefault()
  if(cart.length > 0){
    localStorage.setItem(`cart_${loggedUser.email}`, JSON.stringify(cart))
    localStorage.removeItem('cart')  // clear guest cart
    window.location.href = 'success.html'
  }
})
