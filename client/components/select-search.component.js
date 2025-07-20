export default class SelectSearchComponent {
      constructor(containerSelector, config = {}) {
            this.container = document.querySelector(containerSelector);
            if (!this.container) throw new Error(`Container "${containerSelector}" not found`);

            this.selectors = {
                  wrapper: '.wrapper',
                  button: '.select-btn',
                  span: 'span',
                  input: 'input',
                  options: '.options',
                  ...config.selectors
            };

            this.data = config.data || [];
            this.displayKey = config.displayKey || 'key';
            this.valueKey = config.valueKey || 'value';
            this.placeholder = config.placeholder || 'Select item';
            this.mode = config.mode || 'single';

            this.tagContainer = config.tagContainerSelector ? document.querySelector(config.tagContainerSelector) : null;
            this.tagClass = config.tagClass || 'selected-option';

            this.onSelect = config.onSelect || null;
            this.onRemove = config.onRemove || null;

            this.selectedItem = null;
            this.selectedItems = new Map();

            this.wrapper = null;
            this.button = null;
            this.span = null;
            this.input = null;
            this.options = null;
      }

      async init() {
            this.resolveElements();
            this.renderOptions(this.data);
            this.bindEvents();
      }

      resolveElements() {
            this.wrapper = this.container.querySelector(this.selectors.wrapper);
            this.button = this.wrapper.querySelector(this.selectors.button);
            this.span = this.button.querySelector(this.selectors.span);
            this.input = this.wrapper.querySelector(this.selectors.input);
            this.options = this.wrapper.querySelector(this.selectors.options);
      }

      renderOptions(list) {
            this.options.innerHTML = list.map(item => `
                  <li value="${item[this.valueKey]}">${item[this.displayKey]}</li>
            `).join('');
      }

      bindEvents() {
            this.button.addEventListener('click', () => {
                  this.wrapper.classList.toggle('active');
            });

            this.input.addEventListener('keyup', () => {
                  const searchValue = this.input.value.toLowerCase();
                  const filtered = this.data.filter(item =>
                        item[this.displayKey].toLowerCase().includes(searchValue)
                  );
                  this.renderOptions(filtered);
            });

            this.options.addEventListener('click', (e) => {
                  if (e.target && e.target.nodeName === 'LI') {
                        const id = e.target.getAttribute('value');
                        const text = e.target.innerText;

                        if (this.mode === 'single') {
                              this.setSingleSelected(id, text);
                        } else {
                              this.addMultiSelected(id, text);
                        }

                        this.wrapper.classList.remove('active');

                        if (typeof this.onSelect === 'function') {
                              this.onSelect({ id, text });
                        }
                  }
            });

            if (this.mode === 'multi' && this.tagContainer) {
                  this.tagContainer.addEventListener('click', (e) => {
                        if (e.target && e.target.classList.contains(this.tagClass)) {
                              const id = e.target.getAttribute('data-id');
                              e.target.remove();
                              this.selectedItems.delete(id);

                              if (typeof this.onRemove === 'function') {
                                    this.onRemove(id);
                              }
                        }
                  });
            }
      }

      setSingleSelected(id, text) {
            this.selectedItem = { id, text };
            this.span.innerText = text;
            this.span.setAttribute('item-id', id);
      }

      addMultiSelected(id, text) {
            if (!this.selectedItems.has(id)) {
                  this.selectedItems.set(id, text);
                  this.renderTag(id, text);
            }
      }

      renderTag(id, text) {
            if (!this.tagContainer) return;
            const div = document.createElement('div');
            div.className = this.tagClass;
            div.setAttribute('data-id', id);
            div.textContent = text;
            this.tagContainer.appendChild(div);
      }

      getSelected(option = 'id') {
            if (this.mode === 'single') {
                  if (!this.selectedItem) return null;
                  return option === 'id' ? this.selectedItem.id : this.selectedItem.text;
            } else {
                  const result = [];
                  this.selectedItems.forEach((text, id) => {
                        result.push(option === 'id' ? id : text);
                  });
                  return result;
            }
      }

      reset() {
            if (this.mode === 'single') {
                  this.selectedItem = null;
                  this.span.innerText = this.placeholder;
                  this.span.removeAttribute('item-id');
            } else {
                  this.selectedItems.clear();
                  if (this.tagContainer) this.tagContainer.innerHTML = '';
            }

            this.input.value = '';
            this.renderOptions(this.data);
      }

      updateData(newData) {
            this.data = newData;
            this.renderOptions(this.data);
      }
}
