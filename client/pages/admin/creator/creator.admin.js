// Đảm bảo các namespace tồn tại để tránh lỗi
window.App = window.App || {};
App.pages = App.pages || { admin: {} };
App.pages.admin = App.pages.admin || {};
/**
 * Đây là hàm sẽ được `render.spa.js` tự động gọi.
 * Tên của thuộc tính ('creator/creator.admin') phải khớp chính xác 
 * với tên trang được định nghĩa trong routes của app.admin.js.
*/
App.pages.admin['creator/creator.admin'] = function() {
      alert('hello admin creator');
};

