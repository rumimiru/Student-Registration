function isValidStudentNumber(value) {
  return /^\d{2}-\d{4}-\d{3}$/.test(String(value).trim());
}

function isValidPassword(value) {
  const password = String(value);
  return password.length >= 8
    && /[A-Z]/.test(password)
    && /\d/.test(password)
    && /[@$!]/.test(password)
    && !/\s/.test(password);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { isValidStudentNumber, isValidPassword };
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");
    const fullName = document.getElementById("fullName");
    const studentNumber = document.getElementById("studentNumber");
    const email = document.getElementById("email");
    const mobileNumber = document.getElementById("mobileNumber");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const course = document.getElementById("course");
    const terms = document.getElementById("terms");

    const errors = {
      fullName: document.getElementById("fullNameError"),
      studentNumber: document.getElementById("studentNumberError"),
      email: document.getElementById("emailError"),
      mobileNumber: document.getElementById("mobileNumberError"),
      password: document.getElementById("passwordError"),
      confirmPassword: document.getElementById("confirmPasswordError"),
      course: document.getElementById("courseError"),
      terms: document.getElementById("termsError")
    };

    const passwordFeedback = document.getElementById("passwordFeedback");
    const successMessage = document.getElementById("successMessage");
    const summary = document.getElementById("registrationSummary");

    const controls = {
      fullName,
      studentNumber,
      email,
      mobileNumber,
      password,
      confirmPassword,
      course,
      terms
    };

    function setError(field, message) {
      errors[field].textContent = message;
      controls[field].setAttribute("aria-invalid", message ? "true" : "false");
    }

    function validateFullName() {
      const value = fullName.value.trim();
      if (!value) {
        setError("fullName", "Full name is required.");
        return false;
      }
      if (value.length < 2) {
        setError("fullName", "Full name must be at least two characters.");
        return false;
      }
      setError("fullName", "");
      return true;
    }

    function validateStudentNumber() {
      const value = studentNumber.value.trim();
      if (!value) {
        setError("studentNumber", "Student number is required.");
        return false;
      }
      if (!isValidStudentNumber(value)) {
        setError("studentNumber", "Enter a student number in the format 24-1234-123.");
        return false;
      }
      setError("studentNumber", "");
      return true;
    }

    function validateEmail() {
      const value = email.value.trim();
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        setError("email", "Email address is required.");
        return false;
      }
      if (!pattern.test(value)) {
        setError("email", "Enter a valid email address.");
        return false;
      }
      setError("email", "");
      return true;
    }

    function validateMobile() {
      const value = mobileNumber.value.trim();
      const pattern = /^(09\d{9}|\+639\d{9})$/;
      if (!value) {
        setError("mobileNumber", "Mobile number is required.");
        return false;
      }
      if (!pattern.test(value)) {
        setError("mobileNumber", "Enter 09 followed by nine digits or +639 followed by nine digits.");
        return false;
      }
      setError("mobileNumber", "");
      return true;
    }

    function validatePassword() {
      if (!password.value) {
        setError("password", "Password is required.");
        return false;
      }
      if (!isValidPassword(password.value)) {
        setError("password", "Password must be at least 8 characters, contain one uppercase letter, one digit, one of @, $, or !, and no whitespace.");
        return false;
      }
      setError("password", "");
      return true;
    }

    function updatePasswordFeedback() {
      if (!password.value) {
        passwordFeedback.textContent = "";
      } else if (isValidPassword(password.value)) {
        passwordFeedback.textContent = "Password meets all stated requirements.";
      } else {
        passwordFeedback.textContent = "Password must have at least 8 characters, one uppercase letter, one digit, one of @, $, or !, and no whitespace.";
      }
    }

    function validateConfirmPassword() {
      if (!confirmPassword.value) {
        setError("confirmPassword", "Please confirm your password.");
        return false;
      }
      if (confirmPassword.value !== password.value) {
        setError("confirmPassword", "Passwords do not match.");
        return false;
      }
      setError("confirmPassword", "");
      return true;
    }

    function validateCourse() {
      if (course.value !== "BSIT" && course.value !== "BSCS") {
        setError("course", "Please select BSIT or BSCS.");
        return false;
      }
      setError("course", "");
      return true;
    }

    function validateTerms() {
      if (!terms.checked) {
        setError("terms", "You must agree to the terms.");
        return false;
      }
      setError("terms", "");
      return true;
    }

    function validateAll() {
      const results = [
        validateFullName(),
        validateStudentNumber(),
        validateEmail(),
        validateMobile(),
        validatePassword(),
        validateConfirmPassword(),
        validateCourse(),
        validateTerms()
      ];
      return results.every(Boolean);
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      successMessage.textContent = "";
      summary.hidden = true;

      if (!validateAll()) {
        return;
      }

      document.getElementById("summaryName").textContent = fullName.value.trim();
      document.getElementById("summaryStudentNumber").textContent = studentNumber.value.trim();
      document.getElementById("summaryEmail").textContent = email.value.trim();
      document.getElementById("summaryMobileNumber").textContent = mobileNumber.value.trim();
      document.getElementById("summaryCourse").textContent = course.value;

      successMessage.textContent = "Registration details validated successfully!";
      summary.hidden = false;
    });

    password.addEventListener("input", () => {
      updatePasswordFeedback();
      if (password.value) {
        validatePassword();
      } else {
        setError("password", "");
      }
      if (confirmPassword.value) {
        validateConfirmPassword();
      }
    });

    confirmPassword.addEventListener("input", validateConfirmPassword);

    fullName.addEventListener("blur", validateFullName);

    studentNumber.addEventListener("blur", validateStudentNumber);
    email.addEventListener("blur", validateEmail);
    mobileNumber.addEventListener("blur", validateMobile);

    course.addEventListener("change", validateCourse);
    terms.addEventListener("change", validateTerms);

    form.addEventListener("reset", () => {
      setTimeout(() => {
        Object.keys(errors).forEach((key) => setError(key, ""));
        passwordFeedback.textContent = "";
        successMessage.textContent = "";
        summary.hidden = true;
        [
          "summaryName",
          "summaryStudentNumber",
          "summaryEmail",
          "summaryMobileNumber",
          "summaryCourse"
        ].forEach((id) => {
          document.getElementById(id).textContent = "";
        });
        Object.values(controls).forEach((control) => {
          control.setAttribute("aria-invalid", "false");
        });
      }, 0);
    });

    Object.values(controls).forEach((control) => {
      control.setAttribute("aria-invalid", "false");
    });
  });
}
