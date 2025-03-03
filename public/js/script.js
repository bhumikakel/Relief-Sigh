// (() => {
//     'use strict'
  
//     // Fetch all the forms we want to apply custom Bootstrap validation styles to
//     const forms = document.querySelectorAll('.needs-validation')
  
//     // Loop over them and prevent submission
//     Array.from(forms).forEach(form => {
//       form.addEventListener('submit', event => {
//         if (!form.checkValidity()) {
//           event.preventDefault()
//           event.stopPropagation()
//         }
  
//         form.classList.add('was-validated')
//       }, false)
//     })
//   })()




(() => {
  'use strict';

  // Fetch all forms
  const forms = document.querySelectorAll('.needs-validation');

  // Loop through forms and validate on submit
  Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
          let valid = true;

          // Email Validation
          const emailInput = form.querySelector("#email");
          const emailError = form.querySelector("#emailError");
          const emailValue = emailInput.value;

          if (!emailValue.includes("@")) {
              emailError.textContent = 'Email must contain "@" symbol.';
              emailInput.setCustomValidity("Invalid email");
              valid = false;
          } else if (!emailValue.includes(".")) {
              emailError.textContent = 'Email must contain "." symbol.';
              emailInput.setCustomValidity("Invalid email");
              valid = false;
          } else if (/[A-Z]/.test(emailValue)) {  // Check for capital letters
            emailError.textContent = 'Email should not contain capital letters.';
            emailInput.setCustomValidity("Invalid email");
            valid = false;
        }else {
              emailError.textContent = "Please enter a valid email.";
              emailInput.setCustomValidity(""); // Reset validity
          }

          // Password Validation
          const passwordInput = form.querySelector("#password");
          const passwordError = form.querySelector("#passwordError");
          const passwordValue = passwordInput.value;

          if (!/[A-Z]/.test(passwordValue)) {
              passwordError.innerHTML = "Password must include at least one uppercase letter (A-Z).";
              passwordInput.setCustomValidity("Invalid password");
              valid = false;
          } else if (!/\d/.test(passwordValue)) {
              passwordError.innerHTML = "Password must include at least one number (0-9).";
              passwordInput.setCustomValidity("Invalid password");
              valid = false;
          } else if (!/[@$!%*?&]/.test(passwordValue)) {
              passwordError.innerHTML = "Password must include at least one special character (@$!%*?&).";
              passwordInput.setCustomValidity("Invalid password");
              valid = false;
          } else {
              passwordError.innerHTML = "Password must be at least 8 characters long and include:<ul><li>One uppercase letter</li><li>One number</li><li>One special character (@$!%*?&)</li></ul>";
              passwordInput.setCustomValidity("");
          }

          // Prevent form submission if validation fails
          if (!valid || !form.checkValidity()) {
              event.preventDefault();
              event.stopPropagation();
          }

          form.classList.add('was-validated');
      }, false);
  });
})();