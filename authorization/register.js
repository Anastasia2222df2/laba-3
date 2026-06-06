document.addEventListener("DOMContentLoaded", () => {
    const API_URL_USERS = "http://localhost:3000/users";

    const form = document.getElementById('register-form');
    const fNameInput = document.getElementById('reg-firstname');
    const lNameInput = document.getElementById('reg-lastname');
    const mNameInput = document.getElementById('reg-middlename');
    const emailInput = document.getElementById('reg-email');
    const phoneInput = document.getElementById('reg-phone');
    const birthdateInput = document.getElementById('reg-birthdate');
    const nickInput = document.getElementById('reg-nickname');
    const passInput = document.getElementById('reg-password');
    const passConfirmInput = document.getElementById('reg-password-confirm');
    const termsCheckbox = document.getElementById('reg-terms');
    const btnGenerateNick = document.getElementById('btn-generate-nick');
    const btnSubmit = document.getElementById('btn-submit-reg');

    let nickAttempts = 0;
    const MAX_NICK_ATTEMPTS = 5;

    const top100Passwords = ["Password123!", "Admin1234@", "Qwerty987#", "Klarna2024!"];

    // ==========================================
    // 1. ФУНКЦИИ ВАЛИДАЦИИ ОТДЕЛЬНЫХ ПОЛЕЙ
    // ==========================================

    function showError(input, message) {
        const group = input.closest('.form-group');
        group.classList.add('error');
        if (message) {
            group.querySelector('.error-message').innerText = message;
        }
    }

    function removeError(input) {
        input.closest('.form-group').classList.remove('error');
    }

    function validateName(input) {
        if (input.value.trim().length < 2) {
            showError(input, "Minimum 2 characters");
            return false;
        }
        removeError(input);
        return true;
    }

    function validateEmail() {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(emailInput.value.trim())) {
            showError(emailInput, "Invalid email format");
            return false;
        }
        removeError(emailInput);
        return true;
    }

    function validatePhone() {
        const re = /^\+375\d{9}$/;
        if (!re.test(phoneInput.value.trim())) {
            showError(phoneInput, "Must be format: +375XXXXXXXXX");
            return false;
        }
        removeError(phoneInput);
        return true;
    }

    function validateAge() {
        if (!birthdateInput.value) {
            showError(birthdateInput, "Select your birthdate");
            return false;
        }
        const birthDate = new Date(birthdateInput.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        if (age < 16) {
            showError(birthdateInput, "You must be at least 16 years old");
            return false;
        }
        removeError(birthdateInput);
        return true;
    }

    function validatePassword() {
        const val = passInput.value;
        // Минимум 8, максимум 20, 1 заглавная, 1 строчная, 1 цифра, 1 спецсимвол
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
        
        if (!re.test(val)) {
            showError(passInput, "8-20 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char");
            return false;
        }
        if (top100Passwords.includes(val)) {
            showError(passInput, "Password is too common (in TOP-100)");
            return false;
        }
        removeError(passInput);
        return true;
    }

    function validateConfirmPassword() {
        if (passConfirmInput.value !== passInput.value || passConfirmInput.value === "") {
            showError(passConfirmInput, "Passwords do not match");
            return false;
        }
        removeError(passConfirmInput);
        return true;
    }

    function validateTerms() {
        if (!termsCheckbox.checked) {
            document.getElementById('terms-error').style.display = 'block';
            return false;
        }
        document.getElementById('terms-error').style.display = 'none';
        return true;
    }

    passConfirmInput.addEventListener('paste', (e) => {
        e.preventDefault();
        alert("Pasting is not allowed. Please type your password manually.");
    });


    // ==========================================
    // 2. ГЕНЕРАТОР НИКНЕЙМА И ПРОВЕРКА В БАЗЕ
    // ==========================================

    async function checkNicknameUnique(nick) {
        try {
            const res = await fetch(`${API_URL_USERS}?nickname=${nick}`);
            const data = await res.json();
            return data.length === 0;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    btnGenerateNick.addEventListener('click', async () => {
        const fName = fNameInput.value.trim() || "User";
        const lName = lNameInput.value.trim() || "Name";

        nickAttempts++;
        const sliceF = fName.slice(0, Math.floor(Math.random() * 3) + 1);
        const sliceL = lName.slice(0, Math.floor(Math.random() * 3) + 1);
        const randomNum = Math.floor(Math.random() * (999 - 10) + 10);
        
        let newNick = `${sliceF}${sliceL}${randomNum}`;

        if (nickAttempts >= MAX_NICK_ATTEMPTS) {
            nickInput.removeAttribute('readonly');
            nickInput.style.background = "#fff";
            nickInput.placeholder = "Enter manually...";
            showError(nickInput, "Out of auto-attempts. Enter manually.");
        }

        const isUnique = await checkNicknameUnique(newNick);
        if (isUnique) {
            nickInput.value = newNick;
            removeError(nickInput);
        } else {
            showError(nickInput, "Generated nickname exists, try again!");
        }
        
        checkFormValidity();
    });


    // ==========================================
    // 3. ГЛОБАЛЬНАЯ ПРОВЕРКА ФОРМЫ (В РЕАЛЬНОМ ВРЕМЕНИ)
    // ==========================================

    function checkFormValidity() {
        const isV1 = validateName(fNameInput);
        const isV2 = validateName(lNameInput);
        const isV3 = validateEmail();
        const isV4 = validatePhone();
        const isV5 = validateAge();
        const isV6 = validatePassword();
        const isV7 = validateConfirmPassword();
        const isV8 = validateTerms();
        const isV9 = nickInput.value.trim() !== "";

        if (isV1 && isV2 && isV3 && isV4 && isV5 && isV6 && isV7 && isV8 && isV9) {
            btnSubmit.removeAttribute('disabled');
            btnSubmit.style.opacity = '1';
            btnSubmit.style.pointerEvents = 'auto';
        } else {
            btnSubmit.setAttribute('disabled', 'true');
            btnSubmit.style.opacity = '0.5';
            btnSubmit.style.pointerEvents = 'none';
        }
    }

    const allInputs = [fNameInput, lNameInput, emailInput, phoneInput, birthdateInput, passInput, passConfirmInput, termsCheckbox, nickInput];
    allInputs.forEach(input => {
        input.addEventListener('input', () => {
            removeError(input); 
            checkFormValidity();
        });
    });


    // ==========================================
    // 4. ОТПРАВКА ДАННЫХ (POST НА СЕРВЕР)
    // ==========================================

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const isUnique = await checkNicknameUnique(nickInput.value);
        if (!isUnique) {
            showError(nickInput, "This nickname is already taken!");
            return;
        }

        const newUser = {
            id: String(Date.now()),
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim(),
            password: passInput.value, 
            birthdate: birthdateInput.value,
            nickname: nickInput.value.trim(),
            fullName: {
                firstName: fNameInput.value.trim(),
                lastName: lNameInput.value.trim(),
                middleName: mNameInput.value.trim() 
            },
            role: "customer" 
        };

        try {
            const response = await fetch(API_URL_USERS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                alert("Registration successful! Welcome to Klarna.");
                form.reset();
                btnSubmit.setAttribute('disabled', 'true');
                btnSubmit.style.opacity = '0.5';
                btnSubmit.style.pointerEvents = 'none';
            }
        } catch (error) {
            console.error("Ошибка при регистрации:", error);
            alert("Server error. Please try again later.");
        }
    });
});