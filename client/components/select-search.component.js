/**
 * Lớp tạo ra một component Select Search tùy chỉnh, có khả năng tìm kiếm.
 * Tối ưu hóa hiệu suất bằng cách không render lại DOM liên tục.
 */

class SelectSearchComponent {
      /**
       * @param {string} elementId - ID của thẻ div chứa component.
       * @param {string} endpoint - URL API để lấy danh sách dữ liệu.
       * @param {string} displayField - Tên trường trong đối tượng dữ liệu để hiển thị (ví dụ: 'name', 'title').
       * @param {string} placeholder - Văn bản hiển thị mặc định.
       * @param {function(string)} onSelectionChange - Hàm callback được gọi khi một mục được chọn, trả về ID của mục đó.
      */
      constructor(elementId, endpoint, displayField, placeholder = "Select an option", onSelectionChange = null) {
            this.container = document.getElementById(elementId);
            if(!this.container) {
                  console.error(`Element with ID "${elementId}" not found`);
                  // showToast
                  return;
            }

            this.endpoint = endpoint;
            this.displayField = displayField;
            this.placeholder = placeholder;
            this.onSelectionChange = onSelectionChange;

            // Lưu trữ các phần tử DOM quan trọng
            this.wrapper = this.container.querySelector(".wrapper");
            this.selectBtn = this.wrapper.querySelector(".select-btn");
            this.selectBtnText = this.selectBtn.querySelector("span");
            this.searchInput = this.wrapper.querySelector("input");
            this.optionsContainer = this.wrapper.querySelector(".options");

            this.fullList = []; // Danh sách đầy đủ từ API
            this.init();
      }

      /**
       * Khởi tạo component: lấy dữ liệu, render và gắn các sự kiện.
      */
      async init() {
            try {
                  // thay bằng fetch_api
                  const result = await fetch(this.endpoint);
                  if(!result.ok) throw new Error('Failed to fetch data');
                  
                  const response = await result.json();
                  this.fullList = response.data || [];

                  // 
                  
            } catch(error) {
                  console.error("Initialization failed: ", error);
                  // showToast
                  this.selectBtnText.innerText = "Error loading data";
            }
      }

      /**
       * Render toàn bộ danh sách các mục <li> một lần duy nhất.
      */
      renderList() {
            this.optionsContainer.innerHTML = ""; 
            if(this.fullList.length === 0) {
                  this.optionsContainer.innerHTML =  `<p style="padding-left: 20px;">No options available.</p>`;
                  return;
            }

            this.fullList.forEach(item => {
                  const li = document.createElement("li");
                  li.dataset.id = item._id; // Sử dụng dataset để lưu trữ ID
                  li.textContent = item[this.displayField];
                  this.optionsContainer.appendChild(li);
            });
      }

      /**
       * Gắn các trình lắng nghe sự kiện cần thiết.
      */
      attachEventListeners() {
            // Mở & Đóng dropdown
            this.selectBtn.addEventListener("click", () => {
                  this.wrapper.classList.toggle("active");
            });

            // Lọc danh sách khi gõ
            this.searchInput.addEventListener("keyup", () => {
                  this.filterOptions();
            });

            // Xử lý khi chọn 1 mục
            this.optionsContainer.addEventListener("click", (e) => {
                  if(e.target && e.target.nodeName === "LI") {
                        this.selectOptions(e.target);
                  }
            });

            // Đóng dropdown khi click ra ngoài
            document.addEventListener("click", (e) => {
                  if(!this.wrapper.contains(e.target)) {
                        this.wrapper.classList.remove("active");
                  }
            });
      }

      /**
       * Lọc và hiển thị các mục dựa trên giá trị nhập vào.
       * Tối ưu bằng cách ẩn/hiện thay vì render lại.
      */
      filterOptions() {
            const searchTerm = this.searchInput.value.toLowerCase();
            const allItems = this.optionsContainer.querySelectorAll("li");
            let found = false;

            allItems.forEach(li => {
                  const itemText = li.textContent.toLowerCase();
                  const isVisible = itemText.includes(searchTerm);
                  li.style.display = isVisible ? "" : "none";
                  if(isVisible) found = true;
            });

            // Hiển thị thông báo nếu ko tìm thấy
            const notFoundMsg = this.optionsContainer.querySelector(".not-found");
            if(!found && !notFoundMsg) {
                  const p = document.createElement("p");
                  p.className = "not-found";
                  p.textContent = "Oops! Not found anything";
                  p.style.color = "red";
                  p.style.paddingLeft = "20px";
                  this.optionsContainer.appendChild(p);
            } else if(found && notFoundMsg) {
                  notFoundMsg.remove();
            }
      }

      /**
     * Xử lý logic khi một mục được chọn.
     * @param {HTMLElement} selectedLi - Phần tử <li> được chọn.
     */
      selectOptions(selectedLi) {
            // Cập nhật text & ID
            this.selectBtnText.innerText = selectedLi.textContent;
            this.selectBtnText.dataset.id = selectedLi.dataset.id;
            this.wrapper.classList.remove("active");

            // Bỏ class 'selected' của mục cũ (nếu có)
            const previouslySelected = this.optionsContainer.querySelector("li.selected");
            if(previouslySelected) {
                  previouslySelected.classList.remove("selected");
            }

            // Thêm class 'selected' cho mục mới
            selectedLi.classList.add("selected");
            this.searchInput.value = ""; // Xóa ô tìm kiếm
            this.filterOptions(); // Reset lại bộ lọc để hiển thị tất cả

            // Gọi callback nếu có
            if(this.onSelectionChange) {
                  this.onSelectionChange(selectedLi.dataset.id);
            }
      }

      /**
       * Lấy giá trị hiện tại của select.
       * @param {'id'|'text'} type - Loại giá trị muốn lấy.
       * @returns {string|null}
      */
      getValue(type = 'id') {
            const id = this.selectBtnText.dataset.id;
            if(!id) return null;  // Chưa có gì được chọn
            
            if(type === 'id') {
                  return id;
            }
            if(type === 'text') {
                  return this.selectBtnText.textContent;
            }
            return null;
      }

      /**
       * Reset component về trạng thái ban đầu.
      */
      reset() {
            this.selectBtnText.innerText = this.placeholder;
            this.selectBtnText.removeAttribute("data-id");

            const previouslySelected = this.optionsContainer.querySelector("li.selected");
            if(previouslySelected) {
                  previouslySelected.classList.remove("selected");
            }
      }
}

// ** HTML **
// ** Cách sử dụng class mới
// ** Bây giờ, thay vì gọi nhiều hàm, bạn chỉ cần tạo một đối tượng mới.
// <div id="my-custom-select">
//     <div class="wrapper">
//         <div class="select-btn">
//             <span>Select an option</span>
//             </div>
//         <div class="content">
//             <div class="search">
//                 <input type="text" placeholder="Search">
//             </div>
//             <ul class="options"></ul>
//         </div>
//     </div>
// </div>

// ** Javascript **
// JavaScript để khởi tạo
// document.addEventListener("DOMContentLoaded", () => {
//     // Hàm callback sẽ được thực thi mỗi khi một lựa chọn thay đổi
//     const handleCategoryChange = (selectedId) => {
//         console.log("Category đã chọn có ID:", selectedId);
//         // Bạn có thể làm gì đó ở đây, ví dụ: tải danh sách sản phẩm theo category
//     };

//     // Tạo một select search cho danh mục
//     const categorySelect = new CustomSelectSearch(
//         'my-custom-select',          // ID của element
//         '/api/v1/categories',        // Endpoint API
//         'name',                      // Trường để hiển thị
//         'Chọn danh mục',             // Placeholder
//         handleCategoryChange         // Hàm callback
//     );

//     // Lấy giá trị khi cần
//     const someButton = document.getElementById("some-button");
//     someButton.addEventListener("click", () => {
//         const selectedCategoryId = categorySelect.getValue('id');
//         const selectedCategoryName = categorySelect.getValue('text');
//         if (selectedCategoryId) {
//             alert(`ID: ${selectedCategoryId}, Tên: ${selectedCategoryName}`);
//         } else {
//             alert("Bạn chưa chọn danh mục nào.");
//         }
//     });

//     // Reset khi cần
//     const resetButton = document.getElementById("reset-button");
//     resetButton.addEventListener("click", () => {
//         categorySelect.reset();
//     });
// });