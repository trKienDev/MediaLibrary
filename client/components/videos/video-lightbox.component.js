const VideoLightbox = (() => {
      let overlay, videoEl, videoSource, closeBtn, anchorEl;

      function ensureDOM() {
            if (overlay) return;
            overlay = document.createElement('div');
            overlay.className = 'kit-lightbox-overlay';

            const content = document.createElement('div');
            content.className = 'kit-lightbox-content';

            anchorEl = document.createElement('a');
            anchorEl.className = 'kit-lightbox-link';
            anchorEl.setAttribute('data-spa', true);
            anchorEl.target = '_blank';
            anchorEl.rel = 'noopener noreferrer';
            anchorEl.addEventListener('click', () => close(), { capture: true });

            videoEl = document.createElement('video');
            videoEl.className = 'kit-lightbox-video';
            videoEl.controls = false;
            videoSource = document.createElement('source');
            videoSource.type = 'video/mp4';
            videoEl.appendChild(videoSource);

            anchorEl.appendChild(videoEl);
            content.appendChild(anchorEl);

            closeBtn = document.createElement('div');
            closeBtn.className = 'kit-lightbox-close';
            closeBtn.textContent = '×';

            overlay.appendChild(content);
            overlay.appendChild(closeBtn);
            document.body.appendChild(overlay);

            overlay.addEventListener('click', (e) => {
                  if (e.target === overlay || e.target === closeBtn)
                        close();
            });

            window.addEventListener('keydown', (e) => {
                  if (e.key === 'Escape' && overlay.classList.contains('show'))
                        close();
            });
      }

      function open(src, link = null) {
            ensureDOM();
            videoSource.src = src;
            videoEl.load();

            if (link) {
                  anchorEl.href = link;
                  anchorEl.style.pointerEvents = 'auto';
            } else {
                  anchorEl.removeAttribute('href');
                  anchorEl.style.pointerEvents = 'none';
            }

            overlay.classList.add('show');
            videoEl.muted = true;
            videoEl.play().catch(err => console.warn('Autoplay blocked:', err));
            disableScroll();
      }

      function close() {
            overlay?.classList.remove('show');
            videoEl.pause();
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

      function delegateClicks() {
            document.addEventListener('click', (e) => {
                  const video = e.target.closest('video[data-lightbox-src]');
                  if (!video) return;

                  const src = video.dataset.lightboxSrc || video.src;
                  const link = video.getAttribute('link') || video.dataset.link || null;

                  open(src, link);
            });
      }

      return {
            init() {
                  ensureDOM();
                  delegateClicks();
            },
            open,
            close
      };
})();

(function bootVideoLightbox() {
      window.App = window.App || {};
      App.ui = App.ui || {};
      App.ui.VideoLightbox = VideoLightbox;

      function boot() {
            try {
                  console.debug('[VideoLightbox] init...');
                  VideoLightbox.init();
            } catch (e) {
                  console.error('[VideoLightbox] init error:', e);
            }
      }

      if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', boot, { once: true });
      }
      else
            boot();
})();
