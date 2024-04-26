
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('registerForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        
        var emailInput = document.getElementById('exampleInputEmail1');
        var passwordInput1 = document.getElementById('exampleInputPassword1');
        
       
        emailInput.classList.remove('is-invalid');
        passwordInput1.classList.remove('is-invalid');
        

       
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            emailInput.classList.add('is-invalid');
            return;
        }

     
        var password1 = passwordInput1.value.trim();

        if(!password1){
            passwordInput1.classList.add('is-invalid');
            return ;
        }
        this.submit();
    });
});

        