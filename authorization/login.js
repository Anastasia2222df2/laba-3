document.addEventListener("DOMContentLoaded", () => {
    const API_URL_USERS = "http://localhost:3000/users";
    
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    const loginError = document.getElementById('login-error');

    [emailInput, passInput].forEach(input => {
        input.addEventListener('input', () => {
            passInput.closest('.form-group').classList.remove('error');
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passInput.value;

        if (!email || !password) return;

        try {
            const response = await fetch(`${API_URL_USERS}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
            const users = await response.json();

            if (users.length > 0) {
                const user = users[0];
                localStorage.setItem('currentUser', JSON.stringify({
                    id: user.id,
                    role: user.role,
                    email: user.email,
                    name: user.nickname || user.fullName.firstName
                }));

                alert(`Welcome back, ${user.role === 'administrator' ? 'Admin' : 'Customer'}!`);
            
                if (user.role === 'administrator') {
                    window.location.href = "../admin/admin.html"; 
                } else {
                    window.location.href = "../catalog/catalog.html";
                }

            } else {
                passInput.closest('.form-group').classList.add('error');
            }

        } catch (error) {
            console.error("Ошибка при авторизации:", error);
            alert("Server error. Please try again.");
        }
    });
});