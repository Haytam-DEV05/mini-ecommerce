const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))
const admin = JSON.parse(localStorage.getItem("admin")) ;

if (!admin) {
  alert('Access Denied! Only admin can enter.')
  window.location.href = '../login.html'
}

// Logout
document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('loggedUser')
  window.location.href = '../login.html'
})

// ----------------- Users -----------------
const users = JSON.parse(localStorage.getItem('users')) || []
const usersTableBody = document.querySelector('#users-table tbody')

users.forEach(u => {
  if (u.email !== 'admin@test.com') {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${u.userName}</td>
      <td>${u.email}</td>
      <td>${u.phone}</td>
      <td><button class="delete-user" data-email="${u.email}">Delete</button></td>
    `
    usersTableBody.appendChild(tr)
  }
})

// Delete user
document.querySelectorAll('.delete-user').forEach(btn => {
  btn.addEventListener('click', e => {
    const email = e.target.dataset.email
    if (confirm('Are you sure?')) {
      const filteredUsers = users.filter(u => u.email !== email)
      localStorage.setItem('users', JSON.stringify(filteredUsers))
      localStorage.removeItem(`cart_${email}`)
      location.reload()
    }
  })
})

// ----------------- Orders -----------------
const ordersTableBody = document.querySelector('#orders-table tbody')

users.forEach(u => {
  const userCart = JSON.parse(localStorage.getItem(`cart_${u.email}`)) || []
  if (userCart.length > 0) {
    const total = userCart
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2)
    const products = userCart.map(p => `${p.title}(${p.quantity})`).join(' | ')
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${u.email}</td>
      <td>${products}</td>
      <td>${total} DH</td>
    `
    ordersTableBody.appendChild(tr)
  }
})
