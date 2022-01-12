const inputPassword = document.querySelector('input[type="password"]')
const showPasswordIcon = document.querySelector('.show-password')
const hidePasswordIcon = document.querySelector('.hide-password')

showPasswordIcon.onclick = function() {
    inputPassword.type = "text"
    showPasswordIcon.style.display = "none"
    hidePasswordIcon.style.display = "block"
}

hidePasswordIcon.onclick = function() {
    inputPassword.type = "password"
    showPasswordIcon.style.display = "block"
    hidePasswordIcon.style.display = "none"
}