import apiService from "../../../api/api.instance.js";
import apiEndpoint from "../../../api/endpoint.api.js";
import apiMethod from "../../../api/method.api.js";
import { alertBox, toastNotifier } from "../../../app.admin.js";
import NOTIFICATION_TYPES from "../../../constants/notification-types.constant.js";

export default async function() {
      const tbody = document.querySelector('.tag-table tbody');
      
      renderTagsTable(tbody);

      const form = document.querySelector('.add-tag-form');
      const tagNameInput = document.getElementById('tag-name');
      const tagClassSelect = document.getElementById('tag-class');
      const mediaScopeSelect = document.querySelector('[dom-selector="media-scope"]');
      const selectedMediaWrapper = document.querySelector('[dom-selector="selected-media"]');
      const submitButton = form.querySelector('button[type="submit"]');

      const fields = {
            tag_name: tagNameInput,
            tag_class: tagClassSelect,
            media_scope: mediaScopeSelect
      };

      const errorContainers = {};

      for(const key in fields) {
            const el = document.createElement('div');
            el.className = 'error-message';
            fields[key].parentNode.appendChild(el);
            errorContainers[key] = el;
      }

      const clearErrors = () => {
            Object.values(errorContainers).forEach(e => e.textContent = '');
            Object.values(fields).forEach(f => f.classList.remove('input-error'));
      };

      const setError = (key, message) => {
            errorContainers[key].innerHTML = `${message}`;
            fields[key].classList.add('input-error');
      };

      mediaScopeSelect.addEventListener('change', (event) => {
            const val = event.target.value;
            if([...selectedMediaWrapper.children].some(el => el.textContent === val)) return;

            const div = document.createElement('div');
            div.className = 'selected-media';
            div.textContent = val;
            div.title = 'Click to remove';
            div.addEventListener('click', () => div.remove());
            selectedMediaWrapper.appendChild(div);

            mediaScopeSelect.selectedIndex = 0;
      });


      // lắng nghe submit
      form.addEventListener('submit', (e) => processSubmit(e, {
            form, submitButton, tagNameInput, tagClassSelect, selectedMediaWrapper, clearErrors, setError, tbody
      }));
}

async function renderTagsTable(tbody) {
      const tags = await apiService.getAll(apiEndpoint.tags.getAll);
      tbody.innerHTML = '';
      tags.forEach(tag => {
            const tr = document.createElement('tr');
            tr.innerHTML =  `
                  <td>${tag.name}</td>
                  <td>${tag.class}</td>
            `;
            tbody.appendChild(tr);
      });
}

async function processSubmit(e, context) {
      e.preventDefault();

      const {
            form, submitButton, tagNameInput, tagClassSelect, selectedMediaWrapper,
            clearErrors, setError, tbody
      } = context;

      clearErrors();

      const tagName = tagNameInput.value.trim();
      const tagClass = tagClassSelect.value;
      const mediaScopes = [...selectedMediaWrapper.children].map(el => el.textContent);

      // validate
      let hasError = false;
      if(!tagName) { setError('tag_name', 'Tag name is required.'); hasError = true; }
      if(tagClass === 'tag class') { setError('tag_class', 'Select tag kind.'); hasError = true; }
      if(mediaScopes.length === 0) { setError('media_scope', 'Select at least a media scope.'); hasError = true; }

      if(hasError) return;

      const payload = { tag_name: tagName, tag_class: tagClass, tag_scopes: mediaScopes };
      
      try {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            const response = await apiMethod.createJson(apiEndpoint.tags.create, payload);
            if(!response.success) {
                  console.error('Error creating tag: ', response.error);
                  alertBox.showError('tag created failed');
                  return;
            }

            const result = response.data;
            alertBox.showSuccess('tag created');
            
            form.reset();
            selectedMediaWrapper.innerHTML = '';
      } catch(err) {
            console.error(err);
            toastNotifier.show('Submit tag failed', NOTIFICATION_TYPES.ERROR);
      } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
            await renderTagsTable(tbody);
      }
}