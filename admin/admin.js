document.addEventListener("DOMContentLoaded", () => {
    // 1. ЗАЩИТА МАРШРУТА (ROUTING GUARD)
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'administrator') {
        alert("Access Denied! Administrators only.");
        window.location.href = "../index.html"; 
        return;
    }

    const API_URL = "http://localhost:3000/products";
    const API_URL_USERS = "http://localhost:3000/users";
    const API_URL_FEEDBACK = "http://localhost:3000/feedback";

    // Картотека для быстрого сопоставления ID с Именами на клиенте
    let usersMap = {};
    let productsMap = {};

    // Элементы формы товаров
    const form = document.getElementById('product-form');
    const idInput = document.getElementById('prod-id');
    const nameInput = document.getElementById('prod-name');
    const priceInput = document.getElementById('prod-price');
    const ratingInput = document.getElementById('prod-rating');
    const catInput = document.getElementById('prod-category');
    const genderInput = document.getElementById('prod-gender');
    const imgInput = document.getElementById('prod-image');
    const descInput = document.getElementById('prod-desc');
    
    const btnSave = document.getElementById('btn-save-prod');
    const btnCancel = document.getElementById('btn-cancel-edit');
    const formTitle = document.getElementById('form-title');
    const tableBody = document.getElementById('admin-product-list');

    // Элементы управления отзывами (ЭТАП 5)
    const fbProductSelect = document.getElementById('filter-fb-product');
    const fbUserSelect = document.getElementById('filter-fb-user');
    const fbTableBody = document.getElementById('admin-feedback-list');

    // ==========================================
    // 2. ВАЛИДАЦИЯ ФОРМЫ ТОВАРОВ
    // ==========================================
    function showError(input) { input.closest('.form-group').classList.add('error'); return false; }
    function removeError(input) { input.closest('.form-group').classList.remove('error'); return true; }

    function validateForm() {
        let isValid = true;
        isValid = (nameInput.value.trim().length > 0) ? removeError(nameInput) : showError(nameInput) && false;
        isValid = (catInput.value.trim().length > 0) ? removeError(catInput) : showError(catInput) && false;
        isValid = (descInput.value.trim().length > 0) ? removeError(descInput) : showError(descInput) && false;
        
        const price = Number(priceInput.value);
        isValid = (price > 0) ? removeError(priceInput) : showError(priceInput) && false;
        
        const rating = Number(ratingInput.value);
        isValid = (rating >= 0 && rating <= 5 && ratingInput.value !== "") ? removeError(ratingInput) : showError(ratingInput) && false;
        
        isValid = (imgInput.value.includes('.')) ? removeError(imgInput) : showError(imgInput) && false;

        if (isValid) {
            btnSave.removeAttribute('disabled');
            btnSave.style.opacity = '1';
            btnSave.style.pointerEvents = 'auto';
        } else {
            btnSave.setAttribute('disabled', 'true');
            btnSave.style.opacity = '0.5';
            btnSave.style.pointerEvents = 'none';
        }
        return isValid;
    }

    [nameInput, priceInput, ratingInput, catInput, imgInput, descInput].forEach(input => {
        input.addEventListener('input', validateForm);
    });

    // ==========================================
    // 3. ИНИЦИАЛИЗАЦИЯ КАРТОТЕКИ (Для имен и названий)
    // ==========================================
    async function initAdminDashboard() {
        try {
            // 1. Получаем пользователей и строим карту имён
            const usersRes = await fetch(API_URL_USERS);
            const users = await usersRes.json();
            fbUserSelect.innerHTML = '<option value="all">-- All Users --</option>';
            users.forEach(u => {
                usersMap[u.id] = u.nickname || u.email;
                
                // Наполняем выпадающий список фильтра пользователей [5]
                const option = document.createElement('option');
                option.value = u.id;
                option.textContent = u.nickname || u.email;
                fbUserSelect.appendChild(option);
            });

            // 2. Получаем товары и строим карту названий
            const productsRes = await fetch(API_URL);
            const products = await productsRes.json();
            fbProductSelect.innerHTML = '<option value="all">-- All Products --</option>';
            products.forEach(p => {
                productsMap[p.id] = p.name;

                // Наполняем выпадающий список фильтра товаров [5]
                const option = document.createElement('option');
                option.value = p.id;
                option.textContent = p.name;
                fbProductSelect.appendChild(option);
            });

            // 3. Загружаем таблицы
            loadAdminProducts();
            loadAdminFeedbacks();

        } catch (error) {
            console.error("Ошибка инициализации админки:", error);
        }
    }

    // ==========================================
    // 4. УПРАВЛЕНИЕ ТОВАРАМИ (CRUD)
    // ==========================================

    // GET: Таблица товаров
    // GET: Таблица товаров (С ЖЕСТКИМ ОГРАНИЧЕНИЕМ КАРТИНОК И СТИЛЯМИ)
    async function loadAdminProducts() {
        try {
            const res = await fetch(API_URL);
            const products = await res.json();
            
            tableBody.innerHTML = '';
            products.forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <!-- Задаем инлайн-стили картинке, чтобы она точно была 50х50px -->
                    <td><img src="${p.image.startsWith('http') ? p.image : '../public/' + p.image}" alt="img" style="width: 50px !important; height: 50px !important; object-fit: cover; border-radius: 8px;"></td>
                    <td style="font-weight: 500; color: #171717;">${p.name}</td>
                    <td style="font-weight: bold; color: #171717;">$${p.price}</td>
                    <td>
                        <button class="btn-action btn-edit" data-id="${p.id}">Edit</button>
                        <button class="btn-action btn-delete" data-id="${p.id}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });

            document.querySelectorAll('.btn-edit').forEach(btn => btn.addEventListener('click', handleEdit));
            document.querySelectorAll('.btn-delete').forEach(btn => btn.addEventListener('click', handleDelete));
        } catch (error) {
            console.error("Ошибка загрузки таблицы:", error);
        }
    }

    // POST / PUT: Сохранение товара
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const productData = {
            name: nameInput.value.trim(),
            price: Number(priceInput.value),
            rating: Number(ratingInput.value),
            category: catInput.value.trim(),
            gender: genderInput.value,
            image: imgInput.value.trim(),
            description: descInput.value.trim()
        };

        const editId = idInput.value;
        const method = editId ? "PUT" : "POST";
        const url = editId ? `${API_URL}/${editId}` : API_URL;

        if (!editId) {
            productData.id = String(Date.now());
        }

        try {
            await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData)
            });
            
            alert(editId ? "Product updated!" : "Product added!");
            resetForm();
            initAdminDashboard(); // Перезапускаем дашборд для обновления списков
        } catch (error) {
            console.error(error);
        }
    });

    async function handleEdit(e) {
        const id = e.target.getAttribute('data-id');
        try {
            const res = await fetch(`${API_URL}/${id}`);
            const p = await res.json();

            idInput.value = p.id;
            nameInput.value = p.name;
            priceInput.value = p.price;
            ratingInput.value = p.rating;
            catInput.value = p.category;
            genderInput.value = p.gender || "unisex";
            imgInput.value = p.image;
            descInput.value = p.description;

            formTitle.innerText = "Edit Product";
            btnSave.innerText = "Update Product";
            btnCancel.style.display = "block";
            
            validateForm();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDelete(e) {
        const id = e.target.getAttribute('data-id');
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await fetch(`${API_URL}/${id}`, { method: "DELETE" });
                initAdminDashboard();
            } catch (error) {
                console.error(error);
            }
        }
    }

    btnCancel.addEventListener('click', resetForm);

    function resetForm() {
        form.reset();
        idInput.value = "";
        formTitle.innerText = "Add New Product";
        btnSave.innerText = "Save Product";
        btnCancel.style.display = "none";
        validateForm();
    }


    // ==========================================
    // 5. УПРАВЛЕНИЕ ОТЗЫВАМИ (ЭТАП 5) [5]
    // ==========================================

    // GET: Загрузка отзывов по фильтрам с сервера
    // GET: Загрузка отзывов по фильтрам с сервера [5]
    async function loadAdminFeedbacks() {
        try {
            let params = [];
            const prodFilter = fbProductSelect.value;
            const userFilter = fbUserSelect.value;

            // Серверная фильтрация отзывов [5]
            if (prodFilter !== 'all') params.push(`productId=${prodFilter}`);
            if (userFilter !== 'all') params.push(`userId=${userFilter}`);

            const queryString = params.length > 0 ? `?${params.join('&')}` : '';
            const res = await fetch(`${API_URL_FEEDBACK}${queryString}`);
            const feedbacks = await res.json();

            fbTableBody.innerHTML = '';

            if (feedbacks.length === 0) {
                fbTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#888;">No feedbacks found matching criteria.</td></tr>`;
                return;
            }

            feedbacks.forEach(fb => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <!-- Сопоставляем ID с реальными именами из картотеки -->
                    <td style="font-weight: 500; color: #171717;">${usersMap[fb.userId] || 'Deleted User'}</td>
                    <td style="color: #171717;">${productsMap[fb.productId] || 'Deleted Product'}</td>
                    <td style="color: #444;">${fb.text}</td>
                    <td>${fb.date}</td>
                    <td>
                        <!-- ИСПРАВЛЕННАЯ СТИЛЬНАЯ КНОПКА (Добавили классы btn-action и btn-delete) -->
                        <button class="btn-action btn-delete btn-delete-fb" data-id="${fb.id}">Delete</button>
                    </td>
                `;
                fbTableBody.appendChild(tr);
            });

            // Навешиваем клик на удаление отзыва [5]
            document.querySelectorAll('.btn-delete-fb').forEach(btn => {
                btn.addEventListener('click', handleDeleteFeedback);
            });

        } catch (error) {
            console.error("Ошибка загрузки отзывов:", error);
        }
    }

    // DELETE: Удаление отзыва на сервере [5]
    async function handleDeleteFeedback(e) {
        const id = e.target.getAttribute('data-id');
        if (confirm("Delete this feedback?")) {
            try {
                const res = await fetch(`${API_URL_FEEDBACK}/${id}`, { method: "DELETE" });
                if (res.ok) {
                    loadAdminFeedbacks(); // Перерисовываем список отзывов
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    // Навешиваем изменение фильтров
    fbProductSelect.addEventListener('change', loadAdminFeedbacks);
    fbUserSelect.addEventListener('change', loadAdminFeedbacks);

    // Запуск всего дашборда на старте
    initAdminDashboard();
});