/**
 * Render nội dung dạng văn bản.
 * @param {object} item - Toàn bộ đối tượng dữ liệu của hàng.
 * @param {string} field - Tên thuộc tính cần hiển thị.
 * @returns {Text} Một đối tượng Text Node.
*/
function textRenderer(item, field) {
      return document.createTextNode(item[field] || '');
}

/**
 * Render nội dung dạng ảnh.
 * @param {object} item - Toàn bộ đối tượng dữ liệu của hàng.
 * @param {string} field - Tên thuộc tính chứa tên file ảnh.
 * @param {string} uploadPath - Đường dẫn thư mục uploads.
 * @returns {HTMLImageElement} Một phần tử <img>.
*/
function imageRenderer(item, field, uploadPath) {
      const img = document.createElement('img');
      img.src = `/uploads/${uploadPath}/${item[field]}`;
      img.alt = item.name || 'Image';
      img.classList.add('table-img');
      return img;
}

/**
 * Render một ô chứa các nút hành động (ví dụ: Sửa, Xóa).
 * @param {object} item - Toàn bộ đối tượng dữ liệu của hàng.
 * @param {Array<object>} actions - Mảng cấu hình các hành động.
 * Mỗi action có: { label, iconClass, onClick: (item) => {} }
 * @returns {DocumentFragment} Một fragment chứa các nút.
*/
function actionsRenderer(item, actions) {
      const fragment = document.createDocumentFragment();
      actions.forEach(action => {
            const button = document.createElement('button');
            button.type = 'button';
            button.title = action.label;
            button.classList.add('btn');
            if(action.cssClass) {
                  button.classList.add(...action.cssClass.split(' '));
            }
            button.innerHTML = `<i class="${action.iconClass}"></i>`;
            button.onclick = (e) => {
                  e.stopPropagation(); // Ngăn sự kiện click của hàng
                  action.onClick(item);
            };
            fragment.appendChild(button);
      });
      return fragment;
}

const tableRenderers = {
      textRenderer, 
      imageRenderer, 
      actionsRenderer,
}
export default tableRenderers;