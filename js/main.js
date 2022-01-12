const inputsElement = document.querySelectorAll('input[name]')

function getElementParent(element, selector) {
    while (element.parentElement) {
        if (element.parentElement.matches(selector)) {
            return element.parentElement
        }
        element = element.parentElement
    }
}

for (let input of inputsElement) {
    input.onfocus = function() {
        const parentElement = getElementParent(this, '.form-group')
        parentElement.classList.add('focus')
    }
}