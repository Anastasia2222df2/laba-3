// catalog/api.js
const API_URL = "http://localhost:3000/products";

async function fetchProductsFromServer(queryParams = "") {
    const url = `${API_URL}${queryParams}`;
    console.log("Отправляем запрос на сервер через API:", url);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
    }
    return await response.json();
}