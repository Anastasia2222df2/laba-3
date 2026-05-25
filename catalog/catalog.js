const products = [
    {
        id: 1,
        name: "Nike Air Max 270",
        price: 150,
        category: "Fashion",
        rating: 4.8,
        image: "/catalog/image/a.jpeg",
        description: "Classic running sneakers with maximum comfort."
    },
    {
        id: 2,
        name: "Apple Watch Series 8",
        price: 399,
        category: "Electronics",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        description: "Advanced health tracking and elegant design."
    },
    {
        id: 3,
        name: "Minimalist Leather Tote",
        price: 85,
        category: "Accessories",
        rating: 4.5,
        image: "/catalog/image/orig.webp",
        description: "Handcrafted genuine leather bag for daily use."
    },
    {
        id: 4,
        name: "Sony WH-1000XM5",
        price: 348,
        category: "Electronics",
        rating: 4.7,
        image: "/catalog/image/457aervt0m5b7l5_bdb5d67e.jpg.webp",
        description: "Industry-leading noise canceling headphones."
    },
    {
        id: 5,
        name: "Ray-Ban Aviator Classic",
        price: 160,
        category: "Accessories",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80",
        description: "Timeless sunglasses with gold frames."
    },
    {
        id: 6,
        name: "Lululemon Yoga Mat",
        price: 58,
        category: "Sports",
        rating: 4.3,
        image: "/catalog/image/orig (1).webp",
        description: "Reversible non-slip mat for yoga and pilates."
    },
    {
        id: 7,
        name: "Organic Cotton T-Shirt",
        price: 25,
        category: "Fashion",
        rating: 4.2,
        image: "/catalog/image/6272903617.jpg",
        description: "Premium basic tee made from 100% organic cotton."
    },
    {
        id: 8,
        name: "Nintendo Switch OLED",
        price: 349,
        category: "Electronics",
        rating: 4.9,
        image: "/catalog/image/orig (2).webp",
        description: "Play at home or on the go with a vibrant OLED screen."
    },
    {
        id: 9,
        name: "Smart Ceramic Mug",
        price: 45,
        category: "Home",
        rating: 4.0,
        image: "/catalog/image/i.webp",
        description: "Keeps your coffee hot at the exact temperature."
    },
    {
        id: 10,
        name: "Asics Running Shoes",
        price: 130,
        category: "Sports",
        rating: 4.4,
        image: "/catalog/image/orig (3).webp",
        description: "Professional running shoes with gel cushioning."
    },
    {
        id: 11,
        name: "Plush Dog Bed",
        price: 40,
        category: "Pets",
        rating: 4.8,
        image: "/catalog/image/orig (4).webp",
        description: "Ultra-soft and calming bed for dogs and cats."
    },
    {
        id: 12,
        name: "Fossil Gold Watch",
        price: 145,
        category: "Accessories",
        rating: 4.5,
        image: "/catalog/image/FO619DWHUW05_1_v1.webp",
        description: "Elegant stainless steel watch for everyday wear."
    },
    {
        id: 13,
        name: "Adjustable Dumbbells",
        price: 199,
        category: "Sports",
        rating: 4.7,
        image: "/catalog/image/Strengthl.avif",
        description: "Space-saving dumbbells for home workouts."
    },
    {
        id: 14,
        name: "Gourmet Cat Food",
        price: 35,
        category: "Pets",
        rating: 4.1,
        image: "/catalog/image/orig (5).webp",
        description: "High-protein dry food for adult cats."
    },
    {
        id: 15,
        name: "Levis Denim Jacket",
        price: 90,
        category: "Fashion",
        rating: 4.6,
        image: "/catalog/image/s-l1600.jpg",
        description: "Classic blue denim jacket with a relaxed fit."
    }
];

function renderProducts(productsArray) {
    const container = document.getElementById('product-grid');
    if (!container) return;
    
    container.innerHTML = ''; 

    productsArray.forEach(product => {
        const card = document.createElement('div');
        card.className = `card_1_hero_7`; 
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 250px; object-fit: cover; border-top-left-radius: 16px; border-top-right-radius: 16px;" />
            <div style="padding: 20px; display: flex; flex-direction: column; flex-grow: 1;">
                <p class="catalog__title" style="font-weight: bold; margin: 0 0 5px 0; font-size: 16px; padding: 0;">${product.name}</p>
                <p style="font-size: 13px; color: #606060; margin: 0 0 10px 0;">Category: ${product.category}</p>
                <p style="font-size: 13px; color: #606060; margin: 0; line-height: 1.4;">${product.description}</p>
                
                <!-- Этот блок с ценой всегда будет прижат к самому низу -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 20px;">
                    <span style="font-size: 18px; font-weight: bold; color: #000;">$${product.price}</span>
                    <span style="font-size: 14px; color: #ffb3c7; font-weight: bold;">★ ${product.rating}</span>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

renderProducts(products);

// ==========================================
// ЭТАП 2: РАБОТА С МЕТОДАМИ МАССИВОВ (10 КНОПОК)
// ==========================================

document.getElementById('btn-reset').addEventListener('click', () => {
    renderProducts(products);
});

document.getElementById('btn-filter').addEventListener('click', () => {
    const fashionProducts = products.filter(product => product.category === "Fashion");
    renderProducts(fashionProducts);
});

document.getElementById('btn-sort').addEventListener('click', () => {
    const sortedProducts = [...products].sort((a, b) => a.price - b.price);
    renderProducts(sortedProducts);
});

document.getElementById('btn-map').addEventListener('click', () => {
    const discountedProducts = products.map(product => {
        return {
            ...product,
            price: Math.round(product.price * 0.9)
        };
    });
    renderProducts(discountedProducts);
});

document.getElementById('btn-reduce').addEventListener('click', () => {
    const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
    alert(`Total price of all products: $${totalPrice}`);
});

document.getElementById('btn-find').addEventListener('click', () => {
    const perfectProduct = products.find(product => product.rating === 5.0);
    if (perfectProduct) {
        renderProducts([perfectProduct]);
    } else {
        alert("Product with 5.0 rating not found.");
    }
});

document.getElementById('btn-some').addEventListener('click', () => {
    const hasCheapProducts = products.some(product => product.price < 50);
    alert(hasCheapProducts ? "Yes, we have products under $50!" : "No, all products are more expensive than $50.");
});

document.getElementById('btn-every').addEventListener('click', () => {
    const allUnder500 = products.every(product => product.price < 500);
    alert(allUnder500 ? "Yes, all our products are under $500." : "No, some products are more expensive than $500.");
});

document.getElementById('btn-slice').addEventListener('click', () => {
    const topFive = products.slice(0, 5);
    renderProducts(topFive);
});

document.getElementById('btn-reverse').addEventListener('click', () => {
    const reversedProducts = [...products].reverse();
    renderProducts(reversedProducts);
});

document.getElementById('btn-concat').addEventListener('click', () => {
    const giftCard = {
        id: 99,
        name: "Klarna Gift Card",
        price: 50,
        category: "Gift Cards",
        rating: 5.0,
        image: "../public/footer/logo.svg",
        description: "Perfect gift for your friends and family."
    };
    const expandedProducts = products.concat(giftCard);
    renderProducts(expandedProducts);
});

// ==========================================
// ЭТАП 3: ФИЛЬТРАЦИЯ, ПОИСК И СОРТИРОВКА
// ==========================================

let currentSearchQuery = "";
let currentSortCriterion = "default";
let currentCategory = "all";

function filterAndSortProducts() {
    let result = [...products];

    if (currentCategory !== "all") {
        result = result.filter(product => product.category === currentCategory);
    }

    if (currentSearchQuery.trim() !== "") {
        const query = currentSearchQuery.toLowerCase();
        result = result.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query)
        );
    }

    if (currentSortCriterion === "price-asc") {
        result.sort((a, b) => a.price - b.price);
    } else if (currentSortCriterion === "price-desc") {
        result.sort((a, b) => b.price - a.price);
    } else if (currentSortCriterion === "name-asc") {
        result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSortCriterion === "rating-desc") {
        result.sort((a, b) => b.rating - a.rating);
    }

    const noProductsMsg = document.getElementById('no-products-message');
    if (result.length === 0) {
        noProductsMsg.style.display = 'block';
    } else {
        noProductsMsg.style.display = 'none';
    }

    renderProducts(result);
}

// --- НАВЕШИВАЕМ СЛУШАТЕЛИ СОБЫТИЙ ---

document.getElementById('search-input').addEventListener('input', (event) => {
    currentSearchQuery = event.target.value;
    filterAndSortProducts();
});

document.getElementById('sort-select').addEventListener('change', (event) => {
    currentSortCriterion = event.target.value;
    filterAndSortProducts();
});

const categoryButtons = document.querySelectorAll('.category-btn');
categoryButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        categoryButtons.forEach(btn => {
            btn.style.background = '#fff';
            btn.style.color = '#000';
            btn.style.border = '1px solid #ccc';
        });

        event.target.style.background = '#000';
        event.target.style.color = '#fff';
        event.target.style.border = '1px solid #000';

        currentCategory = event.target.getAttribute('data-category');
        filterAndSortProducts();
    });
});
// ==========================================
// ЛОГИКА ОКРАШИВАНИЯ КНОПОК МЕТОДОВ (10 ШТУК)
// ==========================================
const arrayButtons = document.querySelectorAll('#btn-reset, #btn-filter, #btn-sort, #btn-map, #btn-reduce, #btn-find, #btn-some, #btn-every, #btn-slice, #btn-reverse, #btn-concat');

arrayButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        arrayButtons.forEach(btn => {
            btn.style.background = '#fff';
            btn.style.color = '#000';
            btn.style.border = '1px solid #ccc';
        });

        event.target.style.background = '#000';
        event.target.style.color = '#fff';
        event.target.style.border = '1px solid #000';
    });
});