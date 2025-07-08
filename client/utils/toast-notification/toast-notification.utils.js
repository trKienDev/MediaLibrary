

/**
 * Lớp quản lý việc hiển thị các thông báo toast.
 * Đóng gói toàn bộ logic vào một đối tượng duy nhất.
*/
class ToastNotifier {
      /**
       * @param {object} options - Các tùy chọn cấu hình.
       * @param {string} [options.containerId='toast-container'] - ID của thẻ div chứa các toast.
       * @param {number} [options.defaultDuration=3000] - Thời gian hiển thị mặc định (ms).
      */
      constructor({ containerId = 'toast-container', defaultDuration = 3000} = {}) {
            this.containerId = containerId;
            this.container = document.getElementById(containerId);
            this.defaultDuration = defaultDuration;
            this._ensureContainerExists();
      }

      /**
       * Kiểm tra xem container đã tồn tại chưa. Nếu chưa, tự động tạo và thêm vào body.
       * @private
      */
      _ensureContainerExists() {
            // Thử tìm container đã có sẵn
            let container = document.getElementById(this.containerId);
            // nếu ko tìm thấy --> tạo mới
            if(!container) {
                  container = document.createElement('div');
                  container.id = this.containerId;
                  container.setAttribute('role', 'region');
                  container.setAttribute('aria-live', 'polite');

                  // Thêm container vào cuối thẻ body
                  document.body.appendChild(container);
            }
            this.container = container;
      }


      /**
       * Hiển thị một thông báo toast mới.
       * @param {string} message - Nội dung thông báo.
       * @param {string} [type='info'] - Loại toast ('info', 'success', 'warning', 'error').
       * @param {number} [duration] - Thời gian hiển thị. Ghi đè giá trị mặc định.
      */
      show(message, type=NOTIFICATION_TYPES, duration) {
            if(!this.container) return;

            const finalDuration = duration || this.defaultDuration;

            // Tạo các phần tử của toast
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;

            const icon = this._getIcon(type); // gọi phương thức nội bộ
            const text = document.createElement('span');
            text.textContent= message;

            toast.appendChild(icon);
            toast.appendChild(text);
            this.container.appendChild(toast);

            // Animation logic
            setTimeout(() => {
                  toast.classList.add('show');
            }, 10);
            setTimeout(() => {
                  toast.classList.remove('show');
                  toast.classList.add('hide');
                  toast.addEventListener('transitionend', () => toast.remove());
            }, finalDuration);
      }

      /**
       * Phương thức nội bộ để tạo icon.
       * Tên có dấu gạch dưới (_) là quy ước cho phương thức private.
       * @param {string} type - Loại toast.
       * @private
      */
      _getIcon(type) {
            const icon = document.createElement('i');
            icon.classList.add('toast-icon');
            switch(type) {
                  case 'success':
                        icon.classList.add('fa-solid', 'fa-circle-check');
                        break;
                  case 'warning':
                        icon.classList.add('fa-solid', 'fa-triangle-exclamation');
                        break;
                  case 'error':
                        icon.classList.add('fa-solid', 'fa-circle-xmark');
                        break;
                  case 'info':
                  default:
                        icon.classList.add('fa-solid', 'fa-circle-info');
                        break;
            }
            return icon;
      }
}

export default ToastNotifier;

// ## Cách sử dụng
// Cách sử dụng sẽ hơi khác một chút. Thay vì gọi hàm trực tiếp, bạn sẽ tạo một thể hiện (instance) của class và gọi phương thức từ nó.

// ** 1. Khởi tạo một lần duy nhất **
// Trong file khởi tạo chính của ứng dụng (ví dụ app.js hoặc index.js), bạn tạo một instance của ToastNotifier và export nó ra. Điều này đảm bảo toàn bộ ứng dụng của bạn chỉ dùng chung một đối tượng notifier.

// import ToastNotifier from './utils/toast.js';

// // Khởi tạo một notifier duy nhất cho toàn bộ ứng dụng
// export const notifier = new ToastNotifier();

// // Bạn cũng có thể truyền cấu hình nếu muốn
// // export const notifier = new ToastNotifier({ defaultDuration: 5000 });

// ** 2. Sử dụng trong các component **

// Import instance, không phải class
// import { notifier } from '../../app.js'; 
// import { NOTIFICATION_TYPES } from '../../constants/notification-types.constant.js';
// import { loginUser } from '../../services/apiClient.js';

// async function handleLogin(event) {
//     event.preventDefault();
//     const result = await loginUser(/* ... */);
    
//     if (result.success) {
//         // Gọi phương thức .show() từ instance
//         notifier.show('Đăng nhập thành công!', TOAST_TYPES.SUCCESS);
//     } else {
//         notifier.show(`Lỗi: ${result.error}`, 'error');
//     }
// }