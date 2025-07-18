import domsComponent from "../../../components/dom.components.js";

export default async function() {
      const form = document.querySelector('.add-tag-form');
      const tagNameInput = document.getElementById('tag-name');
      const tagKindSelect = document.getElementById('tag-kind');
      const mediaScopeSelect = document.querySelector('[dom-selector="media-scope"]');
      const selectedMediaWrapper = document.querySelector('[dom-selector="selected-media"]');
      const submitBtn = form.querySelector('button[type="submit"]');

      const errorMessages = {
            tag_name: form.querySelector('.error-tag-name') || createErrorMessageElement(tagNameInput),
            tag_kind: form.querySelector('.error-tag-kind') || createErrorMessageElement(tagKindSelect),
            media_scope: form.querySelector('.error-media-scope') || createErrorMessageElement(mediaScopeSelect)
      }
      
      // Helper để tạo phần tử hiển thị lỗi dưới input/select
      function createErrorMessageElement(target) {
            const el = document.createElement('div');
            el.className = 'error-message';
            el.style.color = '#e53935';
            el.style.fontSize = '12px';
            el.style.marginTop = '4px';
            target.parentNode.appendChild(el);
            return el;
      }

      // Clear all error message
      function clearErrors() {
            Object.values(errorMessages).forEach((el) => el.textContent = '');
      }


      // lắng nghe khi chọn media-scope
      mediaScopeSelect.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
            
            // check nếu đã tồn tại khi ko thêm nữa
            const existed = Array.from(selectedMediaWrapper.children).some(
                  (el) => el.textContent === selectedValue
            );
            if(existed) return;

            const selectedMediaDiv = domsComponent.createDiv({ text: selectedValue, cssClass: 'selected-media' });
            // gắn sự kiện click để remove chính nó khi click
            selectedMediaDiv.addEventListener('click', () => {
                  selectedMediaDiv.classList.add('fade-out');
                  setTimeout(() => {
                        selectedMediaDiv.remove();
                  }, 300);
            });
            selectedMediaWrapper.appendChild(selectedMediaDiv);
      });

      // lắng nghe submit
      form.addEventListener('submit', async(e) => {
            e.preventDefault();

            clearErrors();

            const tagName = document.getElementById('tag-name').value.trim();
            const tagKind = document.getElementById('tag-kind').value;
            const mediaScopes = Array.from(selectedMediaWrapper.children).map(
                  (el) => el.textContent
            );

            // validate
            let hasError = false;

            if(!tagName) {
                  errorMessages.tag_name.textContent = 'Tag name is required.';
                  hasError = true;
            }
            if(tagKind === 'tag kind') {
                  errorMessages.tag_kind.textContent = 'Please select tag kind.';
                  hasError = true;
            }

            if(mediaScopeSelect.length === 0) {
                  errorMessages.media_scope.textContent = 'Please select at least one media scope.';
                  hasError = true;
            }

            if(hasError) {
                  return;
            }

            const payload = {
                  tag_name: tagName,
                  tag_kind: tagKind,
                  media_scope: mediaScopes
            };
            console.log('Submit payload: ', payload);
      });
}