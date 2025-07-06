// Khởi tạo namespace chính
window.App = window.App || {};

App.services = App.services || {};

App.services.state = (function() {
      // Trạng thái là private, chỉ có thể truy cập qua các hàm public
      const _state = {
            clickCount: 0
      };

      const _listeners = [];

      // Hàm public để lấy trạng thái hiện tại (bản sao)
      function getState() {
            return { ..._state };
      }

      // Hàm public để cập nhật trạng thái
      function updateState(newState) {
            Object.assign(_state, newState);
            console.log('Trạng thái đã cập nhật:', _state);
            // Thông báo cho tất cả các listener
            _listeners.forEach(listener => listener());
      }

      // Hàm public để các thành phần khác "lắng nghe" sự thay đổi
      function subscribe(listener) {
            _listeners.push(listener);
      }

      return {
            getState,
            updateState,
            subscribe
      };
})();