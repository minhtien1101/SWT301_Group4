

// Đối tượng validator
function Validator(options) {

    var selectorRules = {};

    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;
        //lấy ra các rule của selector
        var rules = selectorRules[rule.selector];
        //lặp qua từng rule and kiểm tra
        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            // inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            // inputElement.parentElement.classList.remove('invalid');
        }
    }

    var formElement = document.querySelector(options.form);

    if (formElement) {

        formElement.onsubmit = function (e){
            e.preventDefault();
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                validate(inputElement, rule)
            });
        }
        //lặp qua mỗi rule và kiểm tra các sự kiện
        options.rules.forEach(function (rule) {

            // lưu lại các rulé cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test]
            }

            var inputElement = formElement.querySelector(rule.selector);

            if (inputElement) {
                //Xử lý blur
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }
            }
            //xử lý khi người dùng nhập vào input
            inputElement.oninput = function () {
                var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                errorElement.innerText = '';
            }
        });
    }
}

// Định nghĩa rule
Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : 'Vui Lòng Nhập Dữ Liệu';
        }
    };
}

Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập email'
        }
    };
}
Validator.minLengt = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`;
        }
    };
}
Validator.isReEnterPass = function (selector, getPass, message) {
    return {
        selector: selector,
        test: function (value) {
            // return value === getPass() ? undefined : message || "hihi";
            return value === getPass() ? undefined : message;
        }
    };
}