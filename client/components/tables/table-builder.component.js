export default class TableBuilder {
      /**
       * @param {string} targetSelector - CSS selector cho tbody của bảng.
       * @param {object} config - Object cấu hình bảng.
       * - columns: Mảng định nghĩa các cột.
       * - rowDecorator: (Optional) Hàm để "trang trí" thêm hành vi cho mỗi hàng.
      */
      constructor(targetSelector, config) {
            this.tbody = document.querySelector(targetSelector);
            this.thead = this.tbody.previousElementSibling;
            this.config = config;

            if(!this.tbody) {
                  // ** Thêm alert box ** alert box
                  throw new Error(`Target element "${targetSelector}" not found`);
            }
      }

      /**
       * Render tiêu đề của bảng dựa trên cấu hình.
      */
      renderHeader() {
            const tr = document.createElement('tr');
            this.config.columns.forEach(col => {
                  const th = document.createElement('th');
                  th.textContent = col.header;
                  tr.appendChild(th);
            });
            this.thead.innerHTML = '';
            this.thead.appendChild(tr);
      }

      /**
       * Xóa toàn bộ nội dung trong tbody.
      */
      clear() {
            this.tbody.innerHTML = '';
      }

      /**
       * Render toàn bộ bảng với dữ liệu được cung cấp.
       * @param {Array<object>} data - Mảng các đối tượng dữ liệu.
      */
      render(data) {
            this.clear();
            this.renderHeader();
            
            const fragment = document.createDocumentFragment();
            data.forEach(item => {
                  const tr = this.createRow(item);
                  fragment.appendChild(tr);
            });
            this.tbody.appendChild(fragment);
      }

      /**
       * Tạo một phần tử <tr> từ một đối tượng dữ liệu.
       * @param {object} item - Đối tượng dữ liệu cho hàng.
       * @returns {HTMLTableRowElement}
      */
      createRow(item) {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', item._id || item.id);

            // Tạo các ô (td) dựa trên cấu hình cột
            this.config.columns.forEach(col => {
                  const td = document.createElement('td');
                  // Gọi hàm renderer tương ứng từ config
                  const cellContent = col.render(item);
                  td.appendChild(cellContent);
                  tr.appendChild(td);
            });

            // Áp dụng "decorator" nếu có
            if(typeof this.config.rowDecorator === 'function') {
                  this.config.rowDecorator(tr, item);
            }

            return tr;
      }
}

// ====== CÁCH SỬ DỤNG ===========
// Dữ liệu mẫu
// const filmsData = [
//     { _id: 'f001', name: 'Inception', year: 2010, director: 'C. Nolan', thumbnail: 'incep.jpg' },
//     { _id: 'f002', name: 'The Matrix', year: 1999, director: 'Wachowskis', thumbnail: 'matrix.jpg' },
// ];

// --- Định nghĩa hành vi và cấu trúc ---

// Hàm xử lý khi một hàng được chọn (Decorator)
// const selectionDecorator = (tr, item) => {
//     tr.addEventListener('click', () => {
//         // Bỏ chọn hàng đang được chọn (nếu có)
//         const currentSelected = tr.parentElement.querySelector('tr.selected');
//         if (currentSelected) {
//             currentSelected.classList.remove('selected');
//         }
//         // Chọn hàng mới
//         tr.classList.add('selected');
//         console.log('Selected:', item);
//     });
// };

// // Hàm callback cho các nút hành động
// const handleEdit = (item) => alert(`Editing ${item.name}`);
// const handleDelete = (item) => confirm(`Delete ${item.name}?`);

// // Cấu hình bảng
// const filmTableConfig = {
//     // Hàm trang trí hành vi cho mỗi hàng
//     rowDecorator: selectionDecorator,
    
//     // Định nghĩa các cột
//     columns: [
//         {
//             header: 'Tên Phim',
//             render: (item) => renderers.textRenderer(item, 'name'),
//         },
//         {
//             header: 'Ảnh Bìa',
//             render: (item) => renderers.imageRenderer(item, 'thumbnail', 'films'),
//         },
//         {
//             header: 'Năm',
//             render: (item) => renderers.textRenderer(item, 'year'),
//         },
//         {
//             header: 'Hành Động',
//             render: (item) => renderers.actionsRenderer(item, [
//                 { label: 'Sửa', iconClass: 'fa-regular fa-pen-to-square', onClick: handleEdit },
//                 { label: 'Xóa', iconClass: 'fa-solid fa-trash', onClick: handleDelete },
//             ]),
//         }
//     ]
// };

// // --- Khởi tạo và render ---
// document.addEventListener('DOMContentLoaded', () => {
//     // Giả sử bạn có <table id="filmTable"><thead></thead><tbody></tbody></table> trong HTML
//     const filmTable = new TableBuilder('#filmTable tbody', filmTableConfig);
//     filmTable.render(filmsData);
// });