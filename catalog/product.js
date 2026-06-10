document.addEventListener("DOMContentLoaded", async () => {
    // 1. Получаем ID товара из адресной строки (например, ?id=3)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = "catalog.html";
        return;
    }

    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('review-rating');
    const ratingError = document.getElementById('rating-error');

    stars.forEach(star => {
        star.addEventListener('mouseover', (e) => {
            const hoverValue = parseInt(e.target.getAttribute('data-value'));
            highlightStars(hoverValue);
        });
        star.addEventListener('mouseout', () => {
            highlightStars(parseInt(ratingInput.value));
        });

        star.addEventListener('click', (e) => {
            const clickValue = parseInt(e.target.getAttribute('data-value'));
            ratingInput.value = clickValue;
            highlightStars(clickValue);
            ratingError.style.display = 'none'; 
        });
    });
    function highlightStars(count) {
        stars.forEach((star, index) => {
            if (index < count) {
                star.style.color = '#ffb3c7';
                star.style.textShadow = '0 0 5px rgba(255,179,199,0.3)';
            } else {
                star.style.color = '#ccc'; 
                star.style.textShadow = 'none';
            }
        });
    }

    const API_URL = `http://localhost:3000/products/${productId}`;
    const FAV_URL = `http://localhost:3000/favorites/${productId}`;
    const REVIEWS_URL = `http://localhost:3000/feedback?productId=${productId}`;
    const USERS_URL = "http://localhost:3000/users";
    const ORDERS_URL = "http://localhost:3000/orders";

    const detailsContainer = document.getElementById('product-details-container');
    const reviewsList = document.getElementById('reviews-list');
    const addReviewBox = document.getElementById('add-review-box');
    const restrictedMessage = document.getElementById('review-restricted-message');
    const reviewForm = document.getElementById('product-review-form');
    const reviewText = document.getElementById('review-text');

    let usersMap = {};
    async function loadUsersMap() {
        try {
            const res = await fetch(API_URL_USERS || "http://localhost:3000/users");
            const users = await res.json();
            users.forEach(u => {
                usersMap[u.id] = u.nickname || u.fullName.firstName;
            });
        } catch (e) {}
    }

    async function loadProductDetails() {
        try {
            await window.fetchFavoritesList();
            await window.fetchCartList();
            await loadUsersMap();

            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Товар не найден");
            const product = await response.json();

            const isFavorite = window.favoriteIds.includes(String(product.id));
            const heartColor = isFavorite ? "#ffb3c7" : "#ccc";

            const isInCart = window.cartIds.includes(String(product.id));
            const cartBtnBg = isInCart ? "#000" : "#f0f0f0";
            const cartBtnColor = isInCart ? "#fff" : "#000";
            const cartBtnText = isInCart ? "In Cart 🛒" : "Add to Cart";

detailsContainer.innerHTML = `
    <div class="product-image-large">
        <img src="${product.image}" alt="${product.name}" />
        <button class="heart-btn" style="position: absolute; top: 25px; right: 25px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 50px; height: 50px; display: flex; justify-content: center; align-items: center; cursor: pointer; font-size: 28px; color: ${heartColor}; transition: 0.3s; z-index: 10; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">♥</button>
    </div>
    <div class="product-info-large">
        <span style="font-size: 14px; text-transform: uppercase; color: #888; font-weight: bold; margin-bottom: 5px;">${product.category}</span>
        <h2 style="font-size: 36px; font-weight: bold; margin-bottom: 15px; color: #171717;">${product.name}</h2>
        <p style="font-size: 24px; font-weight: bold; color: #000; margin-bottom: 20px;">$${product.price}</p>
        <p style="font-size: 16px; line-height: 1.6; color: #444; margin-bottom: 30px;">${product.description}</p>
        
        <!-- ДВЕ КНОПКИ В ОДИН РЯД -->
        <div style="display: flex; gap: 15px; margin-bottom: 30px; align-items: center; max-width: 420px; width: 100%;">
            <button class="add-to-cart-large" style="height: 45px; font-size: 14px; padding: 0 20px; border-radius: 20px; flex: 1.2; cursor: pointer; background: ${cartBtnBg}; color: ${cartBtnColor}; border: 1px solid #ccc; font-weight: bold; transition: 0.3s; white-space: nowrap;">${cartBtnText}</button>
            <a href="cart.html" class="button_hero_11 button_white_11" style="height: 45px; font-size: 14px; padding: 0 20px; border-radius: 20px; flex: 1; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; border: 1px solid #000; color: #000; background: #fff; transition: 0.3s; white-space: nowrap; cursor: pointer;">Go to Cart 🛒</a>
        </div>
        
        <div style="font-size: 16px; color: #666; font-weight: bold;">Rating: <span style="color: #ffb3c7;">★ ${product.rating}</span></div>
    </div>
`;

            document.querySelector('.heart-btn').addEventListener('click', (e) => {
                window.toggleFavorite(product.id, e);
            });
            document.querySelector('.add-to-cart-large').addEventListener('click', (e) => {
                const button = e.currentTarget;
                button.style.background = '#000';
                button.style.color = '#fff';
                button.style.borderColor = '#000';
                button.innerText = 'In Cart 🛒';
                window.addToCart(product.id, button);
            });

            checkReviewPermission();

        } catch (error) {
            console.error(error);
            detailsContainer.innerHTML = `<p style="text-align:center; font-size: 18px;">Product not found.</p>`;
        }
    }

    async function loadReviews() {
        try {
            const response = await fetch(REVIEWS_URL);
            const reviews = await response.json();
            reviewsList.innerHTML = '';

            if (reviews.length === 0) {
                reviewsList.innerHTML = `<p style="color: #888; font-style: italic;">No reviews yet. Be the first to leave a review!</p>`;
                return;
            }

            reviews.forEach(r => {
                const div = document.createElement('div');
                div.className = 'review-card';

                const starsCount = r.rating || 5; 
                const starsHtml = '★'.repeat(starsCount) + '☆'.repeat(5 - starsCount);

                div.innerHTML = `
                    <div class="review-author" style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: bold; font-size: 15px; color: #171717;">
                            ${usersMap[r.userId] || 'Anonymous'} 
                            <!-- Выводим оценку розовыми звездами -->
                            <span style="color: #ffb3c7; margin-left: 10px; letter-spacing: 2px;">${starsHtml}</span>
                        </span>
                        <span style="font-size: 12px; color: #999; font-weight: normal;">${r.date}</span>
                    </div>
                    <p style="margin: 10px 0 0 0; color: #444; line-height: 1.4;">${r.text}</p>
                `;
                reviewsList.appendChild(div);
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function checkReviewPermission() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser || currentUser.role === 'administrator') {
            restrictedMessage.style.display = 'block';
            restrictedMessage.innerText = !currentUser ? "Log in to leave a review. ❤️" : "Administrators cannot leave reviews.";
            addReviewBox.style.display = 'none';
            return;
        }

        try {
            const ordersResponse = await fetch(`${ORDERS_URL}?userId=${currentUser.id}`);
            const orders = await ordersResponse.json();

            let totalPurchased = 0;
            orders.forEach(order => {
                order.items.forEach(item => {
                    if (String(item.productId) === String(productId)) {
                        totalPurchased += Number(item.quantity || 1);
                    }
                });
            });

            const feedbackResponse = await fetch(`http://localhost:3000/feedback?userId=${currentUser.id}&productId=${productId}`);
            const feedbacks = await feedbackResponse.json();
            const totalReviewsLeft = feedbacks.length;

            console.log(`Куплено штук: ${totalPurchased}, Отзывов написано: ${totalReviewsLeft}`);

            // В. Сверяем лимиты [5]
            if (totalPurchased === 0) {
                // Если не покупал вообще
                restrictedMessage.style.display = 'block';
                restrictedMessage.innerText = "You can review this product only after purchasing it. 🛍️";
                addReviewBox.style.display = 'none';
            } else if (totalReviewsLeft >= totalPurchased) {
                // Если лимит отзывов исчерпан (отзывов >= покупок) [5]
                restrictedMessage.style.display = 'block';
                restrictedMessage.innerText = `You have already left ${totalReviewsLeft} of ${totalPurchased} available review(s) for this product. Purchase it again to write more! 🛍️`;
                addReviewBox.style.display = 'none';
            } else {
                // Если лимит позволяет оставить отзыв
                addReviewBox.style.display = 'block';
                restrictedMessage.style.display = 'none';

                // Добавим красивую подсказку о количестве доступных отзывов
                let limitHint = document.getElementById('review-limit-hint');
                if (!limitHint) {
                    limitHint = document.createElement('p');
                    limitHint.id = 'review-limit-hint';
                    limitHint.style = "font-size: 13px; color: #666; font-style: italic; margin-bottom: 15px; text-align: left;";
                    addReviewBox.insertBefore(limitHint, reviewForm);
                }
                limitHint.innerText = `Available review slots: ${totalPurchased - totalReviewsLeft} (Purchased: ${totalPurchased}, Reviewed: ${totalReviewsLeft})`;
            }
        } catch (error) {
            console.error("Ошибка проверки лимитов отзывов:", error);
        }
    }

    // Отправка отзыва с оценкой
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        const ratingValue = parseInt(ratingInput.value);

        if (ratingValue === 0) {
            ratingError.style.display = 'block';
            return;
        }

        if (reviewText.value.trim().length < 10) {
            alert("Review must be at least 10 characters long!");
            return;
        }

        const newFeedback = {
            id: String(Date.now()),
            userId: currentUser.id,
            productId: productId,
            text: reviewText.value.trim(),
            rating: ratingValue, 
            date: new Date().toISOString().split('T')[0]
        };

        try {
            const response = await fetch("http://localhost:3000/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newFeedback)
            });

            if (response.ok) {
            alert("Review submitted successfully! Thank you. ❤️");
            reviewText.value = '';
            ratingInput.value = 0;
            highlightStars(0);
            
            await loadReviews(); 
            
            await checkReviewPermission(); 
        }
        } catch (error) {
            console.error(error);
        }
    });

    // Запуск
    await loadProductDetails();
    await loadReviews();
});