
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('registerForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.preventDefault();

        var nameInput = document.getElementById('exampleInputUser1');
        var emailInput = document.getElementById('exampleInputEmail1');
        var passwordInput1 = document.getElementById('exampleInputPassword1');
        var passwordInput2 = document.getElementById('exampleInputPassword2');

       
        nameInput.classList.remove('is-invalid');
        emailInput.classList.remove('is-invalid');
        passwordInput1.classList.remove('is-invalid');
        passwordInput2.classList.remove('is-invalid');

        
        if (!nameInput.value.trim()) {
            nameInput.classList.add('is-invalid');
            return;
        }

     
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            emailInput.classList.add('is-invalid');
            return;
        }

        var password1 = passwordInput1.value.trim();
        var password2 = passwordInput2.value.trim();
        if (!password1 || !password2 || password1 !== password2) {
            passwordInput1.classList.add('is-invalid');
            passwordInput2.classList.add('is-invalid');
            return;
        }

        this.submit();
    });
});

        