document.addEventListener("DOMContentLoaded", () => {
    const isSubfolder = window.location.pathname.includes('/catalog/');
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
                  <a href="#">Deals and rewards</a>
                  <a href="#">How Klarna works</a>
                  <a href="#">Help</a>
                </nav>

                <div class="header__auth">
                  <a href="#" class="login-link">Log in</a>
                  <button class="btn-black">Sign up</button>
                </div>
                <div class="header__burger">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </header>
        `;
    }

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = `
            <footer class="footer_12">
              <div class="footer__content-wrapper">
                <div class="footer__container">
                  <div class="footer__brand">
                    <!-- ТАКЖЕ ОБЕРНУЛИ ЛОГОТИП В ФУТЕРЕ -->
                    <a href="${pathPrefix}index.html" style="display: block;">
                      <img
                        src="${pathPrefix}public/footer/logo.svg"
                        alt="Klarna Logo"
                        class="footer__logo"
                      />
                    </a>
                    <div class="footer__country">
                      <div class="icon_text_1">
                        <img
                          src="${pathPrefix}public/footer/icon_flag_footer.svg"
                          alt="US Flag"
                          class="flag_icon"
                        />
                        <span>United States</span>
                      </div>
                      <div class="line">
                        <img
                          src="${pathPrefix}public/footer/vector_line_footer.svg"
                          alt="arrow"
                          class="line_icon"
                        />
                      </div>
                    </div>
                    <div class="footer__socials">
                      <a href="#" class="social-wrap">
                        <img src="${pathPrefix}public/footer/icon_1_footer.svg" alt="Facebook" />
                      </a>
                      <a href="#" class="social-wrap">
                        <img src="${pathPrefix}public/footer/icon_2_footer.svg" alt="LinkedIn" />
                      </a>
                      <a href="#" class="social-wrap">
                        <img src="${pathPrefix}public/footer/icon_3_footer.svg" alt="Twitter" />
                      </a>
                      <a href="#" class="social-wrap">
                        <img src="${pathPrefix}public/footer/icon_4_footer.svg" alt="Instagram" />
                      </a>
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
                    Monthly financing through Klarna is issued by WebBank, member FDIC.
                    Copyright © 2005-2022 Klarna Inc. NMLS #1353190, 629 N. High Street,
                    Third Floor, Columbus, OH 43215. Other CA resident loans made or
                    arranged pursuant to a California Financing Law license.
                  </p>
                  <div class="footer__extra-links">
                    <a href="#">Legal</a>
                    <a href="#">Terms</a>
                    <a href="#">Privacy policy</a>
                    <a href="#">Cookies</a>
                    <a href="#">Sitemap</a>
                    <a href="#">Klarna.com</a>
                  </div>
                </div>
              </div>
            </footer>
        `;
    }
});