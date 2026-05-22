// 1. Массив из 15 товаров (у каждого ровно 6 полей)
// Все пути к картинкам ведут на уровень выше (../public)
const products = [
    {
        id: 1,
        name: "Shop Dresses",
        price: 89,
        category: "Fashion",
        rating: 4.8,
        image: "../public/section_7/img_1_hero_7.svg",
        description: "Elegant dresses for any occasion."
    },
    {
        id: 2,
        name: "Lift and Tone Shoes",
        price: 120,
        category: "Fashion",
        rating: 4.5,
        image: "../public/section_7/img_2_hero_7.svg",
        description: "Comfortable training shoes."
    },
    {
        id: 3,
        name: "Roses are Red Jacket",
        price: 150,
        category: "Fashion",
        rating: 4.9,
        image: "../public/section_7/img_3_hero_7.svg",
        description: "Bright red spring jacket."
    },
    {
        id: 4,
        name: "Shop Outerwear",
        price: 199,
        category: "Fashion",
        rating: 4.2,
        image: "../public/section_7/img_4_hero_7.svg",
        description: "Warm coats and winter jackets."
    },
    {
        id: 5,
        name: "Go the Distance",
        price: 95,
        category: "Sports",
        rating: 4.7,
        image: "../public/section_7/img_5_hero_7.svg",
        description: "Running gear for professionals."
    },
    {
        id: 6,
        name: "Shop Activewear",
        price: 75,
        category: "Sports",
        rating: 4.3,
        image: "../public/section_7/img_6_hero_7.svg",
        description: "Breathable and stretchable clothes."
    },
    {
        id: 7,
        name: "Furry Friend Faves",
        price: 45,
        category: "Pets",
        rating: 4.6,
        image: "../public/section_7/img_7_hero_7.svg",
        description: "Best toys and accessories for pets."
    },
    {
        id: 8,
        name: "Shop Jewelry",
        price: 250,
        category: "Accessories",
        rating: 5.0,
        image: "../public/section_7/img_8_hero_7.svg",
        description: "Gold plated chains and accessories."
    },
    {
        id: 9,
        name: "Affordable Tech",
        price: 320,
        category: "Electronics",
        rating: 4.4,
        image: "../public/section_7/img_9_hero_7.svg",
        description: "Gadgets and tech for daily life."
    },
    {
        id: 10,
        name: "Eco-Friendly Sneakers",
        price: 110,
        category: "Fashion",
        rating: 4.1,
        image: "../public/section_7/img_2_hero_7.svg",
        description: "Recycled material light sneakers."
    },
    {
        id: 11,
        name: "Smart Watch S5",
        price: 299,
        category: "Electronics",
        rating: 4.8,
        image: "../public/section_7/img_9_hero_7.svg",
        description: "Smartwatches with custom bands."
    },
    {
        id: 12,
        name: "Designer Leather Bag",
        price: 180,
        category: "Accessories",
        rating: 4.7,
        image: "../public/section_7/img_8_hero_7.svg",
        description: "Premium leather hand bags."
    },
    {
        id: 13,
        name: "Winter Warm Coat",
        price: 220,
        category: "Fashion",
        rating: 4.6,
        image: "../public/section_7/img_4_hero_7.svg",
        description: "Cozy coat for sub-zero temperatures."
    },
    {
        id: 14,
        name: "Professional Runners",
        price: 130,
        category: "Sports",
        rating: 4.9,
        image: "../public/section_7/img_5_hero_7.svg",
        description: "Shoes engineered for long distance running."
    },
    {
        id: 15,
        name: "Pet Sleeping Bed",
        price: 60,
        category: "Pets",
        rating: 4.2,
        image: "../public/section_7/img_7_hero_7.svg",
        description: "Soft bed for cats and dogs."
    }
];

// 2. Функция для динамической отрисовки карточек
function renderProducts(productsArray) {
    const container = document.getElementById('product-grid');
    if (!container) return;
    
    container.innerHTML = ''; // Очищаем контейнер перед отрисовкой

    productsArray.forEach(product => {
        // Создаем контейнер карточки
        const card = document.createElement('div');
        card.className = `card_1_hero_7`; // Используем твои базовые стили карточки

        // Наполняем карточку HTML-кодом
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <p class="catalog__title" style="font-weight: bold; margin-bottom: 5px;">${product.name}</p>
            <p style="font-size: 13px; color: #606060; padding: 0 12px;">Category: ${product.category}</p>
            <p style="font-size: 13px; color: #606060; padding: 0 12px; margin-top: 5px;">${product.description}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 12px 0 12px; margin-top: auto;">
                <span style="font-size: 18px; font-weight: bold; color: #000;">$${product.price}</span>
                <span style="font-size: 14px; color: #ffb3c7; font-weight: bold;">★ ${product.rating}</span>
            </div>
        `;

        // Добавляем готовую карточку в сетку
        container.appendChild(card);
    });
}

// 3. Запуск генерации при открытии страницы
renderProducts(products);

// ==========================================
// ЭТАП 2: РАБОТА С МЕТОДАМИ МАССИВОВ (10 КНОПОК)
// ==========================================

// Кнопка 0: Сброс (Reset) — возвращает исходный массив
document.getElementById('btn-reset').addEventListener('click', () => {
    renderProducts(products);
});

// Кнопка 1: filter() — оставляет только категорию Fashion
document.getElementById('btn-filter').addEventListener('click', () => {
    const fashionProducts = products.filter(product => product.category === "Fashion");
    renderProducts(fashionProducts);
});

// Кнопка 2: sort() — сортирует цены по возрастанию
document.getElementById('btn-sort').addEventListener('click', () => {
    // Делаем копию массива [...products], чтобы не сломать оригинальный порядок
    const sortedProducts = [...products].sort((a, b) => a.price - b.price);
    renderProducts(sortedProducts);
});

// Кнопка 3: map() — делает скидку 10% (уменьшает каждую цену на 10%)
document.getElementById('btn-map').addEventListener('click', () => {
    const discountedProducts = products.map(product => {
        return {
            ...product,
            price: Math.round(product.price * 0.9) // Округляем цену
        };
    });
    renderProducts(discountedProducts);
});

// Кнопка 4: reduce() — считает общую стоимость всех товаров на складе и выводит алертом
document.getElementById('btn-reduce').addEventListener('click', () => {
    const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
    alert(`Total price of all products: $${totalPrice}`);
});

// Кнопка 5: find() — находит первый товар с идеальным рейтингом 5.0
document.getElementById('btn-find').addEventListener('click', () => {
    const perfectProduct = products.find(product => product.rating === 5.0);
    if (perfectProduct) {
        // Отрендерим его одного в массиве
        renderProducts([perfectProduct]);
    } else {
        alert("Product with 5.0 rating not found.");
    }
});

// Кнопка 6: some() — проверяет, есть ли в магазине товары дешевле $50
document.getElementById('btn-some').addEventListener('click', () => {
    const hasCheapProducts = products.some(product => product.price < 50);
    alert(hasCheapProducts ? "Yes, we have products under $50!" : "No, all products are more expensive than $50.");
});

// Кнопка 7: every() — проверяет, все ли товары в магазине стоят меньше $500
document.getElementById('btn-every').addEventListener('click', () => {
    const allUnder500 = products.every(product => product.price < 500);
    alert(allUnder500 ? "Yes, all our products are under $500." : "No, some products are more expensive than $500.");
});

// Кнопка 8: slice() — показывает только первые 5 "избранных" товаров
document.getElementById('btn-slice').addEventListener('click', () => {
    const topFive = products.slice(0, 5);
    renderProducts(topFive);
});

// Кнопка 9: reverse() — разворачивает текущий массив задом наперед
document.getElementById('btn-reverse').addEventListener('click', () => {
    const reversedProducts = [...products].reverse();
    renderProducts(reversedProducts);
});

// Кнопка 10: concat() — добавляет в конец нашего каталога подарочную карту Klarna Gift Card
document.getElementById('btn-concat').addEventListener('click', () => {
    const giftCard = {
        id: 99,
        name: "Klarna Gift Card",
        price: 50,
        category: "Gift Cards",
        rating: 5.0,
        image: "../public/footer/logo.svg", // Логотип как картинка
        description: "Perfect gift for your friends and family."
    };
    const expandedProducts = products.concat(giftCard);
    renderProducts(expandedProducts);
});

// ==========================================
// ЭТАП 3: ФИЛЬТРАЦИЯ, ПОИСК И СОРТИРОВКА
// ==========================================

// Переменные состояния (хранят текущий выбор пользователя)
let currentSearchQuery = "";
let currentSortCriterion = "default";
let currentCategory = "all";

// Главная функция-контроллер: собирает все фильтры и обновляет экран
function filterAndSortProducts() {
    // Шаг 1: Копируем исходный массив
    let result = [...products];

    // Шаг 2: Фильтрация по категориям
    if (currentCategory !== "all") {
        result = result.filter(product => product.category === currentCategory);
    }

    // Шаг 3: Динамический поиск (по названию или описанию)
    if (currentSearchQuery.trim() !== "") {
        const query = currentSearchQuery.toLowerCase();
        result = result.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query)
        );
    }

    // Шаг 4: Сортировка по выбранному критерию
    if (currentSortCriterion === "price-asc") {
        result.sort((a, b) => a.price - b.price);
    } else if (currentSortCriterion === "price-desc") {
        result.sort((a, b) => b.price - a.price);
    } else if (currentSortCriterion === "name-asc") {
        result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSortCriterion === "rating-desc") {
        result.sort((a, b) => b.rating - a.rating);
    }

    // Шаг 5: Проверка на пустой результат (Обработка ошибки)
    const noProductsMsg = document.getElementById('no-products-message');
    if (result.length === 0) {
        noProductsMsg.style.display = 'block'; // Показываем ошибку
    } else {
        noProductsMsg.style.display = 'none';  // Скрываем ошибку
    }

    // Отрисовываем полученный результат
    renderProducts(result);
}

// --- НАВЕШИВАЕМ СЛУШАТЕЛИ СОБЫТИЙ ---

// 1. Поиск (событие 'input' срабатывает при каждом вводе буквы)
document.getElementById('search-input').addEventListener('input', (event) => {
    currentSearchQuery = event.target.value;
    filterAndSortProducts(); // Пересчитываем фильтры
});

// 2. Сортировка (селект)
document.getElementById('sort-select').addEventListener('change', (event) => {
    currentSortCriterion = event.target.value;
    filterAndSortProducts(); // Пересчитываем фильтры
});

// 3. Категории (кнопки)
const categoryButtons = document.querySelectorAll('.category-btn');
categoryButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        // Снимаем статус "активной" со всех кнопок категорий
        categoryButtons.forEach(btn => {
            btn.style.background = '#fff';
            btn.style.color = '#000';
            btn.style.border = '1px solid #ccc';
        });

        // Делаем активной только ту кнопку, на которую кликнули
        event.target.style.background = '#000';
        event.target.style.color = '#fff';
        event.target.style.border = '1px solid #000';

        // Запоминаем выбранную категорию и обновляем список
        currentCategory = event.target.getAttribute('data-category');
        filterAndSortProducts();
    });
});