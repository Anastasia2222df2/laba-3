document.addEventListener("DOMContentLoaded", () => {
    const CART_URL = "http://localhost:3000/cart";

    async function fetchCart() {
        try {
            const response = await fetch(CART_URL);
            if (!response.ok) throw new Error("Ошибка сервера");
            const data = await response.json();
            renderCart(data);
            calculateTotal(data);
        } catch (error) {
            console.error("Ошибка при получении корзины:", error);
        }
    }

    function renderCart(cartItems) {
        const container = document.getElementById('cart-grid');
        const summary = document.getElementById('cart-summary');
        if (!container || !summary) return;

        if (cartItems.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; background: #f9f9f9; border-radius: 16px; width: 100%;">
                    <p style="font-size: 18px; color: #666; font-family: 'Roboto', sans-serif;">Your Cart is empty. Add some products! 🛒</p>
                </div>
            `;
            summary.style.display = 'none'; 
            return;
        }

        summary.style.display = 'block'; 
        container.innerHTML = ''; 

        cartItems.forEach(item => {
            const row = document.createElement('div');
            row.style = "display: flex; align-items: center; justify-content: space-between; padding: 15px; border: 1px solid #EAEAEA; border-radius: 12px; margin-bottom: 15px; background: #fff; font-family: 'Roboto', sans-serif; gap: 15px; flex-wrap: wrap;";

            row.innerHTML = `
    <!-- Картинка-ссылка -->
    <a href="product.html?id=${item.id}" style="display: block;">
        <img src="${item.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;" />
    </a>
    <div style="flex-grow: 1; min-width: 150px; font-family: 'Roboto', sans-serif;">
        <!-- Название-ссылка -->
        <a href="product.html?id=${item.id}" style="text-decoration: none; color: inherit;">
            <p style="font-weight: bold; font-size: 16px; margin: 0 0 5px 0; cursor: pointer;">${item.name}</p>
        </a>
        <p style="font-size: 13px; color: #606060; margin: 0;">Category: ${item.category}</p>
    </div>
    
    <!-- Управление количеством (PATCH) -->
    <div style="display: flex; align-items: center; gap: 10px;">
        <button class="qty-btn" data-id="${item.id}" data-action="decrease" style="width: 30px; height: 30px; border-radius: 50%; border: 1px solid #ccc; background: #fff; cursor: pointer; font-weight: bold;">-</button>
        <span style="font-weight: bold; font-size: 16px; min-width: 20px; text-align: center;">${item.quantity}</span>
        <button class="qty-btn" data-id="${item.id}" data-action="increase" style="width: 30px; height: 30px; border-radius: 50%; border: 1px solid #ccc; background: #fff; cursor: pointer; font-weight: bold;">+</button>
    </div>
    
    <!-- Итоговая стоимость этой позиции -->
    <div style="font-size: 18px; font-weight: bold; min-width: 80px; text-align: right;">
        $${item.price * item.quantity}
    </div>
    
    <!-- Векторная кнопка удаления (Розовая мусорка) вместо эмодзи -->
    <button class="delete-cart-btn" data-id="${item.id}" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 5px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffb3c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
    </button>
`;
            container.appendChild(row);
        });

        setupCartListeners();
    }

    // Навешиваем клики
    function setupCartListeners() {
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const action = e.target.getAttribute('data-action');
                changeQuantity(id, action);
            });
        });

        document.querySelectorAll('.delete-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                removeFromCart(id);
            });
        });
    }

    // Подсчет общей суммы и количества товаров в корзине [2]
    function calculateTotal(cartItems) {
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        // Считаем общее количество всех штук товаров
        const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        document.getElementById('cart-total').innerText = total;
        document.getElementById('cart-count').innerText = `${totalCount} item(s)`; // Обновляем количество штук
    }

    async function changeQuantity(id, action) {
        try {
            const response = await fetch(`${CART_URL}/${id}`);
            const item = await response.json();
            let newQty = item.quantity;

            if (action === "increase") {
                newQty += 1;
            } else if (action === "decrease" && newQty > 1) {
                newQty -= 1;
            } else {
                return; 
            }

            const patchResponse = await fetch(`${CART_URL}/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity: newQty })
            });

            if (patchResponse.ok) {
                fetchCart(); 
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function removeFromCart(id) {
        try {           // удаление товара
            const response = await fetch(`${CART_URL}/${id}`, { method: "DELETE" });
            if (response.ok) fetchCart();
        } catch (error) {
            console.error(error);
        }
    }

    // Оформление покупки (Очистка корзины и сохранение заказа в orders на реального юзера) [4, 5]
    document.getElementById('btn-checkout')?.addEventListener('click', async () => {
        try {
            // 1. Получаем текущие товары из корзины
            const response = await fetch(CART_URL);
            const items = await response.json();

            if (items.length === 0) {
                alert("Your cart is empty!");
                return;
            }

            // ====================================================================
            // Умная проверка: кто сейчас покупает?
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                alert("Please log in to make a purchase! ❤️");
                window.location.href = "../authorization/login.html"; // Отправляем на вход
                return;
            }
            // ====================================================================

            // 2. Формируем объект заказа (orders) [4]
            const newOrder = {
                id: String(Date.now()), // уникальный ID заказа на основе времени
                userId: currentUser.id, // <--- ИСПРАВЛЕНО: Берем ID реального вошедшего юзера!
                date: new Date().toISOString().split('T')[0], // Дата в формате YYYY-MM-DD
                items: items.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                totalCost: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };

            // 3. Отправляем заказ в коллекцию orders на сервер (POST) [4, 5]
            const orderResponse = await fetch("http://localhost:3000/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newOrder)
            });

            if (!orderResponse.ok) {
                throw new Error("Failed to save order on server");
            }

            // 4. Очищаем корзину на сервере параллельно (DELETE-запросы) [5]
            await Promise.all(items.map(item => 
                fetch(`${CART_URL}/${item.id}`, { method: "DELETE" })
            ));

            alert("Purchase successful! Order saved to history. 🛍️❤️");
            fetchCart(); // Обновляем экран корзины (покажет, что она пуста)
        } catch (error) {
            console.error("Ошибка при оформлении покупки:", error);
            alert("Something went wrong during checkout.");
        }
    });
    fetchCart();
}); 