class AlertBox {
      fire(options) {
            return new Promise((resolve) => {
                  const alertHTML = this._createModalHTML(options);
                  const alertContainer = document.createElement('div');
                  alertContainer.innerHTML = alertHTML;
                  document.body.appendChild(alertContainer);

                  const overlay = alertContainer.querySelector('.custom-alert__overlay');
                  const modal = alertContainer.querySelector('.custom-alert__modal');
                  const confirmBtn = alertContainer.querySelector('.confirm-btn');
                  const cancelBtn = alertContainer.querySelector('.cancel-btn');

                  let isClosing = false;
                  const closeModal = (result) => {
                        if (isClosing) return;
                        isClosing = true;

                        confirmBtn.disabled = true;
                        if (cancelBtn) cancelBtn.disabled = true;

                        overlay.classList.remove('show');
                        overlay.addEventListener('transitionend', () => {
                              alertContainer.remove();
                              resolve(result);
                        }, { once: true });
                  };

                  confirmBtn.addEventListener('click', () => closeModal({ isConfirmed: true, action: 'confirm' }));
                  if (cancelBtn) {
                        cancelBtn.addEventListener('click', () => closeModal({ isDismissed: true, action: 'cancel' }));
                  }
                  overlay.addEventListener('click', (e) => {
                        if (e.target === overlay) {
                              closeModal({ isDismissed: true, action: 'backdrop' });
                        }
                  });

                  setTimeout(() => {
                        overlay.classList.add('show');
                        modal.classList.add('show'); // Nếu bạn thêm class animation cho modal
                  }, 10);
            });
      }

      showError(text, title='Error') {
            return this.fire({
                  title, 
                  text, 
                  icon: 'error',
                  showCancelButton: false
            });
      }
      showSuccess(text, title='Success') {
            return this.fire({
                  title,
                  text,
                  icon: 'success',
                  showCancelButton: false
            });
      }
      showWarning(text, title='Warning') {
            return this.fire({
                  title,
                  text,
                  icon: 'warning',
                  showCancelButton: false
            })
      }

      _createModalHTML({ title = '', text = '', icon = '', showCancelButton = false }) {
            const iconHTML = icon ? `<div class="custom-alert__icon ${icon}"><i class="fa-solid fa-${this._getIconClass(icon)}"></i></div>` : '';
            const titleHTML = title ? `<div class="custom-alert__title">${title}</div>` : '';
            const textHTML = text ? `<div class="custom-alert__text">${text}</div>` : '';
            const cancelBtnHTML = showCancelButton ? `<button class="cancel-btn">Hủy</button>` : '';

            return `
                  <div class="custom-alert__overlay">
                        <div class="custom-alert__modal">
                              ${iconHTML}
                              ${titleHTML}
                              ${textHTML}
                              <div class="custom-alert__actions">
                              <button class="confirm-btn">OK</button>
                              ${cancelBtnHTML}
                              </div>
                        </div>
                  </div>
                  `;
      }

      _getIconClass(icon) {
            switch(icon) {
                  case 'success': return 'circle-check';
                  case 'error': return 'circle-xmark';
                  case 'warning': return 'triangle-exclamation';
                  default: return '';
            }
      }
}

export default AlertBox;
