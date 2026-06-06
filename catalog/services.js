// catalog/services.js
const FAV_URL = "http://localhost:3000/favorites";
const CART_URL = "http://localhost:3000/cart";

window.favoriteIds = [];
window.cartIds = [];

window.fetchFavoritesList = async function() {
    try {
        const response = await fetch(FAV_URL);
        if (response.ok) {
            const data = await response.json();
            window.favoriteIds = data.map(item => String(item.id));
        }
    } catch (error) {
        console.error("Ошибка при получении избранного:", error);
    }
};

window.fetchCartList = async function() {
    try {
        const response = await fetch(CART_URL);
        if (response.ok) {
            const data = await response.json();
            window.cartIds = data.map(item => String(item.id));
        }
    } catch (error) {
        console.error("Ошибка при получении корзины:", error);
    }
};

window.toggleFavorite = async function(productId, event) {
    event.preventDefault(); 
    event.stopPropagation(); 
    
    const button = event.currentTarget;
    const isFav = window.favoriteIds.includes(String(productId));
    const API_URL = "http://localhost:3000/products";

    try {
        if (isFav) {
            const response = await fetch(`${FAV_URL}/${productId}`, { method: "DELETE" });
            if (response.ok) {
                window.favoriteIds = window.favoriteIds.filter(id => id !== String(productId));
                button.style.color = "#ccc";
            }
        } else {
            const prodResponse = await fetch(`${API_URL}/${productId}`);
            const product = await prodResponse.json();

            const response = await fetch(FAV_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product)
            });
            if (response.ok) {
                window.favoriteIds.push(String(productId));
                button.style.color = "#ffb3c7"; 
            }
        }
    } catch (error) {
        console.error("Ошибка при переключении избранного:", error);
    }
};
window.addToCart = async function(productId, buttonElement) {
    const API_URL = "http://localhost:3000/products";
    const isAlreadyInCart = window.cartIds.includes(String(productId));

    try {
        if (isAlreadyInCart) {
            const response = await fetch(`${CART_URL}/${productId}`, {
                method: "DELETE"
            });
            if (response.ok) {
                window.cartIds = window.cartIds.filter(id => id !== String(productId));
                
                buttonElement.style.background = '#f0f0f0';
                buttonElement.style.color = '#000';
                buttonElement.style.borderColor = '#ccc';
                buttonElement.innerText = 'Add to Cart';
                
                alert("Товар удален из корзины! ❌");
            }
        } else {
            const prodResponse = await fetch(`${API_URL}/${productId}`);
            const product = await prodResponse.json();
            
            const response = await fetch(CART_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...product, quantity: 1 })
            });
            
            if (response.ok) {
                window.cartIds.push(String(productId));
                
                buttonElement.style.background = '#000';
                buttonElement.style.color = '#fff';
                buttonElement.style.borderColor = '#000';
                buttonElement.innerText = 'In Cart 🛒';
                
                alert("Товар добавлен в корзину! 🛒");
            }
        }
    } catch (error) {
        console.error("Ошибка при изменении корзины:", error);
    }
};