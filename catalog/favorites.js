const FAV_URL = "http://localhost:3000/favorites";
async function fetchFavorites() {
    try {
        const response = await fetch(FAV_URL);
        if (!response.ok) throw new Error("Server error");
        
        const data = await response.json();
        renderFavorites(data);
    } catch (error) {
        console.error("Ошибка при получении избранного:", error);
    }
}
function renderFavorites(favoritesArray) {
    const container = document.getElementById('favorites-grid');
    if (!container) return;

    if (favoritesArray.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: #f9f9f9; border-radius: 16px; width: 100%;">
                <p style="font-size: 18px; color: #666; font-family: 'Roboto', sans-serif;">Your Favorites list is empty. Go add some! ❤️</p>
            </div>
        `;
        return;
    }
    container.innerHTML = ''; 

    favoritesArray.forEach(product => {
        const card = document.createElement('div');
        card.className = `card_1_hero_7`;
        card.style.position = 'relative';

        card.innerHTML = `
    <div class="product-image-container" style="width: 100%; height: 250px; overflow: hidden; border-top-left-radius: 16px; border-top-right-radius: 16px; position: relative;">
        <!-- Картинка теперь ссылка -->
        <a href="product.html?id=${product.id}" style="display: block; width: 100%; height: 100%;">
            <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" />
        </a>
        <button type="button" class="remove-fav-btn" data-id="${product.id}" style="position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.85); border: none; border-radius: 50%; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; cursor: pointer; font-size: 24px; color: #ffb3c7; -webkit-text-stroke: 1px #000; transition: color 0.3s; z-index: 10; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">♥</button>
    </div>
    <div style="padding: 20px; display: flex; flex-direction: column; flex-grow: 1; font-family: 'Roboto', sans-serif;">
        <!-- Название теперь ссылка -->
        <a href="product.html?id=${product.id}" style="text-decoration: none; color: inherit;">
            <p class="catalog__title" style="font-weight: bold; margin: 0 0 5px 0; font-size: 16px; padding: 0; cursor: pointer;">${product.name}</p>
        </a>
        <p style="font-size: 13px; color: #606060; margin: 0 0 10px 0;">Category: ${product.category}</p>
        <p style="font-size: 13px; color: #606060; margin: 0; line-height: 1.4;">${product.description}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 20px;">
            <span style="font-size: 18px; font-weight: bold; color: #000;">$${product.price}</span>
            <span style="font-size: 14px; color: #ffb3c7; font-weight: bold;">★ ${product.rating}</span>
        </div>
    </div>
`;
        container.appendChild(card);
    });
}

async function removeFromFavorites(productId) {
    try {
        const response = await fetch(`${FAV_URL}/${productId}`, {
            method: "DELETE"
        });
        if (response.ok) {
            fetchFavorites();
        }
    } catch (error) {
        console.error("Ошибка при удалении из избранного:", error);
    }
}

fetchFavorites();