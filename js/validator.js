function Validator(formSelector) {
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }
    let inputPassword
    const formRules = {}
    const formElement = document.querySelector(formSelector)
        /**
         * Quy ước tạo rule:
         * - Nếu có lỗi thì return `error message`
         * - Nếu  không có lỗi thì return `undefined`
         */
    const validatorRules = {
        required(value) {
            return value ? undefined : 'Please fill in this field'
        },
        username(value) {
            const regexUsername = /^[a-zA-Z0-9]+$/
            return regexUsername.test(value) ? undefined : 'Only the characters a-z, A-Z, 0-9 are valid'
        },
        email(value) {
            const regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
            return regexEmail.test(value) ? undefined : 'Please enter the correct email'
        },
        confirm(value) {
            return value === inputPassword.value ? undefined : 'Re-entered password is incorrect, please re-enter'
        },
        min(min) {
            return function(value) {
                return value.length >= min ? undefined : `Please enter at least ${min} characters`
            }
        },
        max(max) {
            return function(value) {
                return value.length <= max ? undefined : `Please enter up to ${max} characters`
            }
        },
    }
    if (formElement) {
        inputPassword = formElement.querySelector('input[name="password"]')
        const inputs = formElement.querySelectorAll('[name][rules]')
        for (let input of inputs) {
            const rules = input.getAttribute('rules').split('|');
            for (let rule of rules) {
                let ruleInfo
                const isRuleHasValue = rule.includes(':')
                if (isRuleHasValue) {
                    ruleInfo = rule.split(':')
                    rule = ruleInfo[0]
                }
                let ruleFunc = validatorRules[rule]

                if (isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1])
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc)
                } else {
                    formRules[input.name] = [ruleFunc];
                }
            }

            // Lắng nghe sự kiện để validate (blur, change, ....)
            input.onblur = handleValidate
            input.oninput = handleClearError
        }

        // Ham thực hiện validate
        function handleValidate(e) {
            const rules = formRules[e.target.name];
            let errorMessage

            for (let rule of rules) {
                errorMessage = rule(e.target.value)
                if (errorMessage) break
            }

            // Nếu có lỗi thì hiện thị message lỗi ra UI
            if (errorMessage) {
                const formGroup = getParent(e.target, '.form-group')
                if (formGroup) {
                    formGroup.classList.add('invalid')
                    const formMessage = formGroup.querySelector('.form-message')
                    if (formMessage) {
                        formMessage.innerText = errorMessage
                    }
                }
            }

            return !errorMessage
        }

        // Hàm clear message lỗi
        function handleClearError(e) {
            const formGroup = getParent(e.target, '.form-group')
            const formMessage = formGroup.querySelector('.form-message')
            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid')
            }
            if (formMessage) {
                formMessage.innerText = ''
            }
        }

        // Xử lí hành vi submit form
        formElement.onsubmit = (e) => {
            e.preventDefault()
            const inputs = formElement.querySelectorAll('[name][rules]')
            let isValid = true
            for (let input of inputs) {
                if (!handleValidate({ target: input })) {
                    isValid = false
                }
            }

            if (isValid) {
                if (typeof this.onSubmit === 'function') {

                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');

                    var formValues = Array.from(enableInputs).reduce((values, input) => {

                        switch (input.type) {
                            case 'checkbox':
                                if (input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                }
                                if (Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'radio':
                                if (input.matches(':checked')) {
                                    values[input.name] = input.value;
                                }
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }

                        return values;
                    }, {});

                    this.onSubmit(formValues);
                } else {
                    formElement.submit()
                }
            }
        }
    }
}