if (JSON.parse(localStorage.getItem('loggedUser'))) {
  window.location.href = 'index.html'
}

// ---------------- REGISTRATION ----------------
const formRegistration = document.querySelector('.form-registration')
if (formRegistration) {
  formRegistration.addEventListener('submit', e => {
    e.preventDefault()

    const user = {
      userName: document.getElementById('name').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value.trim()
    }

    let isValidate = true

    // USERNAME
    if (user.userName.length < 5) isValidate = false

    // PHONE
    if (user.phone.length !== 10) isValidate = false

    // EMAIL
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) isValidate = false

    // PASSWORD
    if (
      user.password.length < 6 ||
      !/[A-Za-z]/.test(user.password) ||
      !/[0-9]/.test(user.password)
    )
      isValidate = false

    if (!isValidate) {
      Swal.fire({
        title: 'Error!',
        text: 'Pleas Fixe The Errors',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
      return
    }

    // LOCALSTORAGE
    let users = JSON.parse(localStorage.getItem('users')) || []
    if (users.find(u => u.email === user.email)) {
      Swal.fire({
        title: 'Error!',
        text: 'This email already exists!',
        icon: 'error'
      })
      return
    }

    users.push(user)
    localStorage.setItem('users', JSON.stringify(users))

    Swal.fire({
      title: 'Success!',
      text: 'Registration successful ✅',
      icon: 'success'
    }).then(() => {
      window.location.href = 'login.html'
    })
  })
}

// ---------------- LOGIN ----------------
const formLoging = document.querySelector('.form-loging')
if (formLoging) {
  formLoging.addEventListener('submit', e => {
    e.preventDefault()

    const emailValue = document.getElementById('email').value.trim()
    const passwordValue = document.getElementById('password').value.trim()

    // CHECK IF THE ADMIN LOGIN =>
    if(emailValue === "admin@test.com" && passwordValue === "admin123"){
      localStorage.setItem("admin",JSON.stringify("true")) ;
      window.location.href = "admin/admin.html" ;
      return ;
    }

    let users = JSON.parse(localStorage.getItem('users')) || []
    let validUser = users.find(
      u => u.email === emailValue && u.password === passwordValue
    )

    if (validUser) {
      Swal.fire({
        title: 'Success!',
        text: `Welcome Back ${validUser.userName}`,
        icon: 'success'
      }).then(() => {
        // ---------------- MERGE CART ----------------
        const guestCart = JSON.parse(localStorage.getItem('cart')) || []
        const userCartKey = `cart_${validUser.email}`
        const userCart = JSON.parse(localStorage.getItem(userCartKey)) || []

        guestCart.forEach(item => {
          const exist = userCart.find(p => p.id === item.id)
          if (exist) {
            exist.quantity += item.quantity
          } else {
            userCart.push(item)
          }
        })

        localStorage.setItem(userCartKey, JSON.stringify(userCart))
        localStorage.removeItem('cart') // clear guest cart

        // ---------------- LOGIN ----------------
        localStorage.setItem('loggedUser', JSON.stringify(validUser))
        window.location.href = 'index.html'
      })
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Invalid Email Or Password',
        icon: 'error'
      })
    }
  })
}
