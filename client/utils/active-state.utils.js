/**
 * Khởi tạo và quản lý trạng thái active cho một nhóm các phần tử.
 * Sử dụng event delegation để tối ưu hiệu năng.
 *
 * @param {string} containerSelector - Bộ chọn CSS cho phần tử cha chứa các mục.
 * @param {string} itemSelector - Bộ chọn CSS cho các mục có thể được kích hoạt.
 * @param {function(HTMLElement): void} onStateChange - Callback được gọi khi một mục thay đổi trạng thái active.
 */
function initActiveState(containerSelector, itemSelector, onStateChange) {
      const container = document.querySelector(containerSelector);
      if (!container) {
            console.error(`Container element not found with selector: ${containerSelector}`);
            return;
      }

      // 1. Gắn một event listener duy nhất cho phần tử cha
      container.addEventListener('click', (event) => {
            // 2. Xác định phần tử con được click khớp với itemSelector
            const clickedItem = event.target.closest(itemSelector);

            // Nếu không click vào một mục hợp lệ, hoặc mục đó đã active, thì bỏ qua
            if (!clickedItem || clickedItem.classList.contains('active')) {
                  return;
            }

            // 3. Tìm và vô hiệu hóa mục đang active
            const currentActiveItem = container.querySelector(`${itemSelector}.active`);
            if (currentActiveItem) {
                  currentActiveItem.classList.remove('active');
            }

            // 4. Kích hoạt mục mới và gọi callback
            clickedItem.classList.add('active');
            if (onStateChange && typeof onStateChange === 'function') {
                  onStateChange(clickedItem);
            }
      });

      // Xử lý trạng thái active ban đầu khi tải trang
      const initialActiveItem = container.querySelector(`${itemSelector}.active`);
      if (initialActiveItem && onStateChange && typeof onStateChange === 'function') {
            onStateChange(initialActiveItem);
      }
}

// Cách export vẫn có thể giữ nguyên hoặc chỉ export một hàm duy nhất
const activeStateUtils = {
      init: initActiveState,
};
export default activeStateUtils;