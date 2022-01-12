const inputsPassword = document.querySelectorAll('input[type="password"]')
const checkboxShowPassword = document.querySelector('.handle-password input')

checkboxShowPassword.onchange = () => {
    if (checkboxShowPassword.checked) {
        for (let inputPassword of inputsPassword) {
            inputPassword.type = "text"
        }
    } else {
        for (let inputPassword of inputsPassword) {
            inputPassword.type = "password"
        }
    }
}