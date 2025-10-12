// image-lightbox.component.js
const ImageLightbox = (() => {
      let overlay, imgEl, closeBtn, anchorEl;

      function ensureDOM() {
            if (overlay) return;
            overlay = document.createElement('div');
            overlay.className = 'kit-lightbox-overlay';

            const content = document.createElement('div');
            content.className = 'kit-lightbox-content';

            anchorEl = document.createElement('a');
            anchorEl.className = 'kit-lightbox-link';
            anchorEl.setAttribute('data-spa', true);
            anchorEl.target = '_blank'; // mở tab mới (nếu muốn)
            anchorEl.rel = 'noopener noreferrer'; // bảo mật
            anchorEl.addEventListener('click', (e) => {
                  close();
            }, { capture: true });

            // tạo thẻ img
            imgEl = document.createElement('img');
            imgEl.className = 'kit-lightbox-img';
            imgEl.alt = '';

            // chèn img vào a
            anchorEl.appendChild(imgEl);

            // sau đó chèn vào content
            content.appendChild(anchorEl);

            closeBtn = document.createElement('div');
            closeBtn.className = 'kit-lightbox-close';
            closeBtn.textContent = '×';

            // content.appendChild(imgEl);
            overlay.appendChild(content);
            overlay.appendChild(closeBtn);
            document.body.appendChild(overlay);

            // Đóng khi click nền hoặc nút ×
            overlay.addEventListener('click', (e) => {
                  if (e.target === overlay || e.target === closeBtn) close();
            });

            // ESC để đóng
            window.addEventListener('keydown', (e) => {
                  if (e.key === 'Escape' && overlay.classList.contains('show')) 
                        close();
            });
      }

      function open(src, alt = '', link = null) {
            ensureDOM();
            imgEl.src = src;
            imgEl.alt = alt || '';

            if (link) {
                  anchorEl.href = link;
                  anchorEl.style.pointerEvents = 'auto';
            } else {
                  anchorEl.removeAttribute('href');
                  anchorEl.style.pointerEvents = 'none';
            }

            overlay.classList.add('show');
            disableScroll();
      }

      function close() {
            overlay?.classList.remove('show');
            enableScroll();
      }

      function disableScroll() {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
      }
      function enableScroll() {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
      }

      // Event delegation: click vào bất kỳ <img data-lightbox-src>
      function delegateClicks() {
            document.addEventListener('click', (e) => {
                  const img = e.target.closest('img[data-lightbox-src]');
                  if (!img) return;

                  const src = img.dataset.lightboxSrc || img.src;
                  const alt = img.alt || '';
                  const link = img.getAttribute('link') || img.dataset.link || null;

                  open(src, alt, link);
            });
      }

      // Public API
      return {
            init() {
                  ensureDOM(); delegateClicks(); 
            },
            open,
            close
      };
})();

(function bootLightbox() {
      // đưa ra global namespace trước
      window.App = window.App || {};
      App.ui = App.ui || {};
      App.ui.ImageLightbox = ImageLightbox;

      function boot() {
            try {
                  ImageLightbox.init();
            // console.debug('[Lightbox] init done');
            } catch (e) {
                  console.error('[Lightbox] init error:', e);
            }
      }

      if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', boot, { once: true });
      } else {
            // DOM đã sẵn sàng → chạy ngay
            boot();
      }
})();
