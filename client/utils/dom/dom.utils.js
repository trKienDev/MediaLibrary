/**
 * Hàm chung để tạo một phần tử HTML với các thuộc tính, lớp CSS và phần tử con.
 * @param {string} tag - Tên thẻ HTML (ví dụ: 'div', 'a', 'span').
 * @param {object} [props={}] - Một đối tượng chứa các thuộc ⚫️nh.
 * @returns {HTMLElement} - Phần tử HTML đã được tạo.
*/
function createElement(tag, props = {}) {
      // Tách các thuộc tính đặc biệt ra khỏi các thuộc tính HTML thông thường
      const { id, cssClass, text, children, ...restProps } = props;

      // Tạo phần tử
      const element = document.createElement(tag);
      
      // gán ID nếu có
      if(id) {
            element.id = id;
      }

      // gán nội dung văn bản (nếu có)
      if(text) {
            element.textContent = text;
      }

      // Thêm các lớp CSS
      // Hỗ trợ cả chuỗi (vd: 'class1 class2') và mảng (vd: ['class1', 'class2'])
      if(cssClass) {
            const classes = Array.isArray(cssClass) ? cssClass : cssClass.split(' ');
            element.classList.add(...classes.filter(c => c)); // Lọc ra các chuỗi rỗng
      }

      // Gán các thuộc tính còn lại (href, src, alt)
      for(const key in restProps) {
            element.setAttribute(key, restProps[key]);
      }

      // Chèn các phần tử con vào
      if(children && Array.isArray(children)) {
            children.forEach(child => {
                  if(child) { // Đảm bảo child ko phải là null hoặc undefined
                        element.appendChild(child);
                  }
            });
      }

      return element;
}

const domUtils = {
      createArticle: (props) => createElement('article', props),
      createDiv: (props) => createElement('div', props),
      createAhref: (props) => createElement('a', props),
      createH3: (props) => createElement('h3', props),
      createSpan: (props) => createElement('span', props),
      createLi: (props) => createElement('li', props),
      createSection: (props) => createElement('section', props),
      createImg: (props) => createElement('img', props),
      createParagraph: (props) => createElement('p', props),
};
export default domUtils;

