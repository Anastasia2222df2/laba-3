window.showToast = function(message, type = "success") {
    console.log("window.showToast успешно запущен! Сообщение:", message);

    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = "position: fixed; top: 20px; right: 20px; z-index: 999999; display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 350px; pointer-events: none;";
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.style.cssText = "pointer-events: auto; background: #ffffff; border-radius: 16px; padding: 16px 20px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04); display: flex; align-items: center; justify-content: space-between; gap: 15px; font-family: 'Roboto', sans-serif; font-size: 14px; font-weight: 500; color: #171717; transform: translateX(120%); transition: transform 0.4s cubic-bezier(0.86, 0, 0.07, 1), opacity 0.4s ease; opacity: 0; box-sizing: border-box; width: 100%; border: 1px solid #f0f0f0; border-left: 5px solid #ffb3c7;";
    
    let svgIcon = "";
    
    if (type === "error") {
        toast.style.borderLeftColor = "#d32f2f";
        svgIcon = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
        `;
    } else if (type === "info") {
        toast.style.borderLeftColor = "#ffb3c7";
        svgIcon = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffb3c7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
        `;
    } else if (type === "success") {
        toast.style.borderLeftColor = "#2e7d32";
        svgIcon = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        `;
    } else {
        toast.style.borderLeftColor = "#171717";
        svgIcon = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#171717" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
        `;
    }

    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; flex-grow: 1;">
            <span style="display: flex; align-items: center; justify-content: center;">${svgIcon}</span>
            <span style="line-height: 1.4;">${message}</span>
        </div>
        <button class="toast-close" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #aaa; transition: color 0.2s; padding: 0 5px;" onmouseover="this.style.color='#000'" onmouseout="this.style.color='#aaa'">&times;</button>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = "translateX(0)";
        toast.style.opacity = "1";
    }, 50);

    const closeToast = () => {
        toast.style.transform = "translateX(120%)";
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 400);
    };

    toast.querySelector('.toast-close').addEventListener('click', closeToast);
    setTimeout(closeToast, 6000);
};

// ====================================================================
// СТАНДАРТНАЯ ОТРИСОВКА ШАПКИ И ФУТЕРА (DOMContentLoaded)
// ====================================================================
document.addEventListener("DOMContentLoaded", () => {
    const isSubfolder = window.location.pathname.includes('/catalog/') || 
                        window.location.pathname.includes('/authorization/') ||
                        window.location.pathname.includes('/admin/');
                        
    const pathPrefix = isSubfolder ? '../' : '';

    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = `
            <header class="header">
              <div class="container">
                <div class="header__logo">
                  <a href="${pathPrefix}index.html" style="display: block;">
                    <img src="${pathPrefix}public/header/logo_header.svg" alt="Klarna Logo" />
                  </a>
                </div>

                <nav class="header__nav">
  <a href="${pathPrefix}catalog/catalog.html">Catalog</a>
  <!-- Добавили спаны-счетчики -->
  <a href="${pathPrefix}catalog/favorites.html" style="display: inline-flex; align-items: center;">Favorites <span id="fav-counter" class="nav-badge">0</span></a>
  <a href="${pathPrefix}catalog/cart.html" style="display: inline-flex; align-items: center;">Cart <span id="cart-counter" class="nav-badge">0</span></a>
  <a href="#">How Klarna works</a>
  <a href="#">Help</a>
</nav>

                <div class="header__auth">
                  <a href="${pathPrefix}authorization/login.html" class="login-link" style="text-decoration: none;">Log in</a>
                  <a href="${pathPrefix}authorization/register.html" style="text-decoration: none;">
                    <button class="btn-black" style="cursor: pointer;">Sign up</button>
                  </a>
                </div>
                
                <div class="header__burger">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </header>

            <div class="mobile-menu" id="mobile-menu">
                <nav class="mobile-menu__nav">
                  <a href="${pathPrefix}catalog/catalog.html">Catalog</a>
                  <a href="${pathPrefix}catalog/favorites.html">Favorites ❤️</a>
                  <a href="${pathPrefix}catalog/cart.html">Cart 🛒</a>
                  <a href="#">How Klarna works</a>
                  <a href="#">Help</a>
                </nav>
            </div>

            <div class="mobile-menu-overlay" id="mobile-menu-overlay"></div>
        `;
    }

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = `
            <footer class="footer_12">
              <div class="footer__content-wrapper">
                <div class="footer__container">
                  <div class="footer__brand">
                    <a href="${pathPrefix}index.html" style="display: block;">
                      <img src="${pathPrefix}public/footer/logo.svg" alt="Klarna Logo" class="footer__logo" />
                    </a>
                    <div class="footer__country">
                      <div class="icon_text_1">
                        <img src="${pathPrefix}public/footer/icon_flag_footer.svg" alt="US Flag" class="flag_icon" />
                        <span>United States</span>
                      </div>
                      <div class="line">
                        <img src="${pathPrefix}public/footer/vector_line_footer.svg" alt="arrow" class="line_icon" />
                      </div>
                    </div>
                    <div class="footer__socials">
                      <a href="#" class="social-wrap"><img src="${pathPrefix}public/footer/icon_1_footer.svg" alt="Facebook" /></a>
                      <a href="#" class="social-wrap"><img src="${pathPrefix}public/footer/icon_2_footer.svg" alt="LinkedIn" /></a>
                      <a href="#" class="social-wrap"><img src="${pathPrefix}public/footer/icon_3_footer.svg" alt="Twitter" /></a>
                      <a href="#" class="social-wrap"><img src="${pathPrefix}public/footer/icon_4_footer.svg" alt="Instagram" /></a>
                    </div>
                  </div>

                  <div class="footer__col">
                    <ul>
                      <li><a href="#">Klarna</a></li>
                      <li><a href="#">About us</a></li>
                      <li><a href="#">Careers</a></li>
                      <li><a href="#">Legal</a></li>
                      <li><a href="#">Press</a></li>
                      <li><a href="#">Extra O blog</a></li>
                      <li><a href="#">Privacy</a></li>
                      <li><a href="#">Auto-import / Magic import</a></li>
                      <li><a href="#">Sustainability</a></li>
                    </ul>
                  </div>

                  <div class="footer__col">
                    <ul>
                      <li><a href="#">Customer</a></li>
                      <li><a href="#">Your California Privacy Choices</a></li>
                      <li><a href="#">Feedback and complaints</a></li>
                      <li><a href="#">Buyer Protection Policy</a></li>
                      <li><a href="#">Rewards club</a></li>
                      <li><a href="#">Shopping app</a></li>
                      <li><a href="#">Partner stores</a></li>
                      <li><a href="#">Customer service</a></li>
                      <li><a href="#">Contact us via app</a></li>
                      <li><a href="#">Buy now pay later</a></li>
                    </ul>
                  </div>

                  <div class="footer__col dib">
                    <ul>
                      <li><a href="#">Business</a></li>
                      <li><a href="#">Sell with Klarna</a></li>
                      <li><a href="#">Payment methods</a></li>
                      <li><a href="#">Platforms and partners</a></li>
                      <li><a href="#">Partner program</a></li>
                      <li><a href="#">Affiliate program</a></li>
                      <li><a href="#">Business login</a></li>
                      <li><a href="#">Business support</a></li>
                      <li><a href="#">Operational status</a></li>
                    </ul>
                  </div>
                </div>

                <div class="footer__bottom">
                  <p class="footer__legal-text">
                    Monthly financing through Klarna is issued by WebBank, member FDIC. Copyright © 2005-2022 Klarna Inc.
                  </p>
                  <div class="footer__extra-links">
                    <a href="#">Legal</a>
                    <a href="#">Terms</a>
                    <a href="#">Privacy policy</a>
                  </div>
                </div>
              </div>
            </footer>
        `;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const authBlock = document.querySelector('.header__auth');
        if (authBlock) {
            authBlock.innerHTML = `
                <span style="font-weight: 500; font-size: 14px; margin-right: 15px;">Hi, ${currentUser.name}!</span>
                <button id="btn-logout" class="btn-black" style="cursor: pointer;">Log out</button>
            `;
            document.getElementById('btn-logout').addEventListener('click', () => {
                localStorage.removeItem('currentUser');
                window.location.reload();
            });
        }

        if (currentUser.role === 'administrator') {
            const navBlock = document.querySelector('.header__nav');
            if (navBlock) {
                navBlock.innerHTML += `<a href="${pathPrefix}admin/admin.html" style="color: #d32f2f; font-weight: bold;">Admin Panel</a>`;
            }
        }
    }

    const burger = document.querySelector('.header__burger');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-menu-overlay');

    if (burger && mobileMenu && overlay) {
        const toggleMenu = () => {
            burger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');

            if (burger.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        };

        burger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                mobileMenu.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    // ====================================================================
    // ЛОГИКА АНИМИРОВАННЫХ СЧЕТЧИКОВ (Шаг 1, Лаба 9) [3]
    // ====================================================================
    window.updateHeaderCounters = async function() {
        try {
            const favRes = await fetch("http://localhost:3000/favorites");
            const cartRes = await fetch("http://localhost:3000/cart");

            if (!favRes.ok || !cartRes.ok) return;

            const favs = await favRes.json();
            const cart = await cartRes.json();

            const favBadge = document.getElementById('fav-counter');
            const cartBadge = document.getElementById('cart-counter');

            if (favBadge) {
                const oldCount = parseInt(favBadge.innerText) || 0;
                const newCount = favs.length;
                favBadge.innerText = newCount;

                if (oldCount !== newCount) {
                    favBadge.classList.add('bump');
                    setTimeout(() => favBadge.classList.remove('bump'), 300);
                }
            }

            if (cartBadge) {
                const oldCount = parseInt(cartBadge.innerText) || 0;
                const newCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
                cartBadge.innerText = newCount;

                if (oldCount !== newCount) {
                    cartBadge.classList.add('bump');
                    setTimeout(() => cartBadge.classList.remove('bump'), 300);
                }
            }
        } catch (error) {
            console.error("Ошибка при обновлении счетчиков шапки:", error);
        }
    };

    window.updateHeaderCounters();
});