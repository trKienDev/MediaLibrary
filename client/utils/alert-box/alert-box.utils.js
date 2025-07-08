
class AlertBox {
      /**
       * Phương thức chính để hiển thị một alert.
       * @param {object} options - Các tùy chọn cho alert.
       * @param {string} [options.title=''] - Tiêu đề của alert.
       * @param {string} [options.text=''] - Nội dung của alert.
       * @param {string} [options.icon=''] - Icon ('success', 'error', 'warning').
       * @param {boolean} [options.showCancelButton=false] - Có hiển thị nút Hủy hay không.
       * @returns {Promise<object>} - Một promise sẽ resolve với kết quả người dùng chọn.
      */
      fire(options) {
            // Trả về 1 promise để xử lý bất đồng bộ
            return new Promise((resolve) => {
                  const alertHTML = this._createModalHTML(options);

                  // Tạo 1 container tặm thời cho alert
                  const alertContainer = document.createElement('div');
                  alertContainer.innerHTML = alertHTML;

                  // Thêm alert vào trong body
                  document.body.appendChild(alertContainer);

                  // Lấy các phần tử DOM
                  const overlay = alertContainer.querySelector('.custom-alert__overlay');
                  const confirmBtn = alertContainer.querySelector('.confirm-btn');
                  const cancelBtn = alertContainer.querySelector('.cancel-btn');

                  // Hàm đóng modal & resolve promise
                  const closeModal = (result) => {
                        overlay.classList.remove('show');
                        // Chờ hiệu ứng kết thúc rồi mới xóa khỏi DOM
                        overlay.addEventListener('transitioned', () => {
                              alertContainer.remove();
                              resolve(result);
                        });
                  };

                  // Gán sự kiện
                  confirmBtn.addEventListener('click', () => closeModal({ isConfirmed: true }));

                  if(cancelBtn) {
                        cancelBtn.addEventListener('click', () => closeModal({ isDismissed: true, reason: 'cancel' }));       
                  }

                  // Đóng khi click ra ngoài
                  overlay.addEventListener('click', (e) => {
                        if(e.target === overlay) {
                              closeModal({ isDismissed: true, reason: 'backdrop' });
                        }
                  });

                  // Hiển thị modal với hiệu ứng
                  // Dùng setTimeout để đảm bảo trình duyệt render xong rồi mới thêm class 'show'
                  setTimeout(() => {
                        overlay.classList.add('show');
                  }, 10);
            });
      }

      /**
       * Tạo chuỗi HTML cho modal dựa trên các tùy chọn.
       * @private
      */
      _createModalHTML({ title = '', text = '', icon = '', showCancelButton = false}) {
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

      /**
       * Lấy class Font Awesome tương ứng với icon type.
       * @private
      */
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

// ======== CÁCH SỬ DỤNG ==============
// ** 1. Khởi tạo một lần **
// export const Alert = new CustomAlert();
// ** 2. Gọi alert trong các component **
// Sử dụng async/await là cách tốt nhất để làm việc với Promise trả về.

// Import cả Alert instance và hằng số
// import { Alert } from '../../app.js';
// import { NOTIFICATION_TYPES } from '../../constants'; // Giả sử bạn đặt hằng số ở file này

// // Ví dụ khi gọi alert
// document.getElementById('deleteBtn').addEventListener('click', async () => {
//     const result = await Alert.fire({
//         title: 'Bạn có chắc không?',
//         text: "Bạn sẽ không thể hoàn tác hành động này!",
        
//         // Sử dụng hằng số, an toàn và có gợi ý code
//         icon: NOTIFICATION_TYPES.WARNING, 
        
//         showCancelButton: true
//     });

//     if (result.isConfirmed) {
//         Alert.fire({
//             title: 'Đã xóa!',
//             text: 'File đã được xóa thành công.',
            
//             // Sử dụng hằng số
//             icon: NOTIFICATION_TYPES.SUCCESS
//         });
//     }
// });