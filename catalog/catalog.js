// catalog/catalog.js

document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:3000/products";
    let loadedProducts = [];

    let currentSearchQuery = "";
    let currentSortCriterion = "default";
    let currentCategory = "all";
    let currentGender = "all";     
    let currentMinRating = "";     
    let currentMaxPrice = "";      
    let currentPage = 1;
    const limitPerPage = 6; 

    async function fetchProducts(queryParams = "") {
        try {
            await window.fetchFavoritesList(); 
            await window.fetchCartList(); 

            const url = `${API_URL}${queryParams}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

            const data = await response.json();
            loadedProducts = data; 

            const noProductsMsg = document.getElementById('no-products-message');
            noProductsMsg.style.display = data.length === 0 ? 'block' : 'none';

            renderProducts(data);

            if (queryParams === "" || queryParams.startsWith("?_page")) {
                generateCategoryFilters(data);
            }
        } catch (error) {
            console.error("Ошибка загрузки:", error);
        }
    }

    // ==========================================
    // ИСПРАВЛЕННАЯ ФУНКЦИЯ ОТРИСОВКИ (RENDER) [2]
    // ==========================================
    function renderProducts(productsArray) {
        const container = document.getElementById('product-grid');
        if (!container) return;
        container.innerHTML = ''; 

        productsArray.forEach(product => {
            const card = document.createElement('div');
            card.className = `card_1_hero_7`; 
            card.style.position = 'relative'; 

            // Считываем состояние избранного и корзины для окрашивания [2, 3]
            const isFavorite = window.favoriteIds.includes(String(product.id));
            const heartColor = isFavorite ? "#ffb3c7" : "#ccc"; 

            const isInCart = window.cartIds.includes(String(product.id));
            const cartBtnBg = isInCart ? "#000" : "#f0f0f0";
            const cartBtnColor = isInCart ? "#fff" : "#000";
            const cartBtnBorder = isInCart ? "1px solid #000" : "1px solid #ccc";
            const cartBtnText = isInCart ? "In Cart 🛒" : "Add to Cart";

            card.innerHTML = `
                <div class="product-image-container" style="width: 100%; height: 250px; overflow: hidden; border-top-left-radius: 16px; border-top-right-radius: 16px; position: relative;">
                    <!-- Картинка теперь ведет на страницу товара -->
                    <a href="product.html?id=${product.id}" style="display: block; width: 100%; height: 100%;">
                        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" />
                    </a>
                    <button type="button" class="heart-btn" data-id="${product.id}" style="position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.85); border: none; border-radius: 50%; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; cursor: pointer; font-size: 24px; color: ${heartColor}; transition: color 0.3s; z-index: 10; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">♥</button>
                </div>
                
                <div style="padding: 20px; display: flex; flex-direction: column; flex-grow: 1;">
                    <!-- Название теперь тоже ссылка -->
                    <a href="product.html?id=${product.id}" style="text-decoration: none; color: inherit;">
                        <p class="catalog__title" style="font-weight: bold; margin: 0 0 5px 0; font-size: 16px; padding: 0; cursor: pointer;">${product.name}</p>
                    </a>
                    <p style="font-size: 13px; color: #606060; margin: 0 0 10px 0;">Category: ${product.category}</p>
                    <p style="font-size: 13px; color: #606060; margin: 0; line-height: 1.4;">${product.description}</p>
                    
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button type="button" class="add-to-cart-btn" data-id="${product.id}" style="height: 35px; font-size: 12px; padding: 0 15px; border-radius: 10px; width: 100%; cursor: pointer; background: ${cartBtnBg}; color: ${cartBtnColor}; border: ${cartBtnBorder}; font-weight: 500; transition: all 0.3s ease;">${cartBtnText}</button>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 20px;">
                        <span style="font-size: 18px; font-weight: bold; color: #000;">$${product.price}</span>
                        <span style="font-size: 14px; color: #ffb3c7; font-weight: bold;">★ ${product.rating}</span>
                    </div>
                </div>
            `;
            container.appendChild(card); // Возвращаем добавление карточки в HTML [1]
        });

        // Навешиваем клики из services.js после рендеринга [2]
        document.querySelectorAll('.heart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                window.toggleFavorite(e.currentTarget.getAttribute('data-id'), e);
            });
        });
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault(); e.stopPropagation();
                const button = e.currentTarget;
                const productId = button.getAttribute('data-id');

                button.style.background = '#000';
                button.style.color = '#fff';
                button.style.borderColor = '#000';
                button.innerText = 'In Cart 🛒';

                await window.addToCart(productId, button);
            });
        });
    }

    // ==========================================
    // ОСТАВШАЯСЯ ЛОГИКА ФИЛЬТРОВ И КНОПОК МЕТОДОВ
    // ==========================================

    function filterAndSortProducts() {
        let params = [];
        if (currentSearchQuery.trim() !== "") params.push(`q=${encodeURIComponent(currentSearchQuery)}`);
        if (currentCategory !== "all") params.push(`category=${encodeURIComponent(currentCategory)}`);
        if (currentGender !== "all") params.push(`gender=${encodeURIComponent(currentGender)}`);
        if (currentMaxPrice !== "") params.push(`price_lte=${currentMaxPrice}`);
        if (currentMinRating !== "") params.push(`rating_gte=${currentMinRating}`);
        
        if (currentSortCriterion !== "default") {
            if (currentSortCriterion === "price-asc") params.push("_sort=price&_order=asc");
            else if (currentSortCriterion === "price-desc") params.push("_sort=price&_order=desc");
            else if (currentSortCriterion === "rating-desc") params.push("_sort=rating&_order=desc");
        }

        params.push(`_page=${currentPage}`, `_limit=${limitPerPage}`);

        const queryString = params.length > 0 ? `?${params.join("&")}` : "";
        fetchProducts(queryString);

        const pageInfo = document.getElementById('page-info');
        if (pageInfo) pageInfo.innerText = `Page ${currentPage}`;
    }

    document.getElementById('search-input')?.addEventListener('input', (e) => { currentSearchQuery = e.target.value; currentPage = 1; filterAndSortProducts(); });
    document.getElementById('sort-select')?.addEventListener('change', (e) => { currentSortCriterion = e.target.value; currentPage = 1; filterAndSortProducts(); });

    const priceSlider = document.getElementById('price-slider');
    if (priceSlider) {
        priceSlider.addEventListener('input', (e) => {
            document.getElementById('price-val').innerText = e.target.value; 
            currentMaxPrice = e.target.value; currentPage = 1; filterAndSortProducts();                 
        });
    }

    document.getElementById('btn-prev')?.addEventListener('click', () => { if (currentPage > 1) { currentPage--; filterAndSortProducts(); } });
    document.getElementById('btn-next')?.addEventListener('click', () => {
        const currentCards = document.querySelectorAll('.card_1_hero_7');
        if (currentCards.length === limitPerPage) { currentPage++; filterAndSortProducts(); }
    });

    function generateCategoryFilters(productsArray) {
        const container = document.getElementById('category-filters');
        if (!container) return;
        const uniqueCategories = new Set(productsArray.map(p => p.category));
        let buttonsHTML = `<button class="category-btn active" data-category="all" style="padding: 8px 20px; border-radius: 20px; border: 1px solid #000; background: #000; color: #fff; cursor: pointer; font-weight: 500;">All</button>`;
        uniqueCategories.forEach(category => {
            buttonsHTML += `<button class="category-btn" data-category="${category}" style="padding: 8px 20px; border-radius: 20px; border: 1px solid #ccc; background: #fff; color: #000; cursor: pointer; font-weight: 500;">${category}</button>`;
        });
        container.innerHTML = buttonsHTML;

        document.querySelectorAll('.category-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                document.querySelectorAll('.category-btn').forEach(btn => { btn.style.background = '#fff'; btn.style.color = '#000'; btn.style.border = '1px solid #ccc'; });
                event.target.style.background = '#000'; event.target.style.color = '#fff'; event.target.style.border = '1px solid #000';
                currentCategory = event.target.getAttribute('data-category');
                currentPage = 1; filterAndSortProducts();
            });
        });
    }

    document.getElementById('btn-reset')?.addEventListener('click', async () => {
        currentSearchQuery = ""; currentSortCriterion = "default"; currentCategory = "all"; currentGender = "all"; currentMinRating = ""; currentMaxPrice = ""; currentPage = 1;
        if(document.getElementById('search-input')) document.getElementById('search-input').value = "";
        if(document.getElementById('sort-select')) document.getElementById('sort-select').value = "default";
        if (priceSlider) { priceSlider.value = 500; document.getElementById('price-val').innerText = "500"; }
        
        await window.fetchCartList(); 
        filterAndSortProducts();
    });

    document.getElementById('btn-male')?.addEventListener('click', () => { currentGender = "male"; currentPage = 1; filterAndSortProducts(); });
    document.getElementById('btn-female')?.addEventListener('click', () => { currentGender = "female"; currentPage = 1; filterAndSortProducts(); });
    document.getElementById('btn-unisex')?.addEventListener('click', () => { currentGender = "unisex"; currentPage = 1; filterAndSortProducts(); });

    document.getElementById('btn-price-asc')?.addEventListener('click', () => { currentSortCriterion = "price-asc"; document.getElementById('sort-select').value = "price-asc"; currentPage = 1; filterAndSortProducts(); });
    document.getElementById('btn-price-desc')?.addEventListener('click', () => { currentSortCriterion = "price-desc"; document.getElementById('sort-select').value = "price-desc"; currentPage = 1; filterAndSortProducts(); });
    document.getElementById('btn-top-rated')?.addEventListener('click', () => { currentMinRating = "4.5"; currentPage = 1; filterAndSortProducts(); });

    document.getElementById('btn-reduce')?.addEventListener('click', () => {
        const total = loadedProducts.reduce((sum, p) => sum + p.price, 0);
        const avg = total / (loadedProducts.length || 1);
        alert(`Average price of current items: $${avg.toFixed(2)}`);
    });
    document.getElementById('btn-slice')?.addEventListener('click', () => { renderProducts(loadedProducts.slice(0, 3)); });
    document.getElementById('btn-concat')?.addEventListener('click', () => {
        const giftCard = { id: 99, name: "Klarna Gift Card", price: 50, category: "Gift", rating: 5.0, image: "../public/footer/logo.svg", description: "Gift card." };
        renderProducts(loadedProducts.concat(giftCard));
    });

    const arrayButtons = document.querySelectorAll('#btn-reset, #btn-male, #btn-female, #btn-unisex, #btn-price-asc, #btn-price-desc, #btn-top-rated, #btn-reduce, #btn-slice, #btn-concat');
    arrayButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            arrayButtons.forEach(btn => { btn.style.background = '#fff'; btn.style.color = '#000'; btn.style.border = '1px solid #ccc'; });
            event.target.style.background = '#000'; event.target.style.color = '#fff'; event.target.style.border = '1px solid #000';
        });
    });

    // ЗАПУСК ПРИ СТАРТЕ
    filterAndSortProducts();
});