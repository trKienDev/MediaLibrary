import apiService from "../../../api/api.instance.js";
import apiEndpoint from "../../../api/endpoint.api.js";
import apiMethod from "../../../api/method.api.js";
import { toastNotifier } from "../../../app.admin.js";
import SelectSearchComponent from "../../../components/select-search.component.js";
import NOTIFICATION_TYPES from "../../../constants/notification-types.constant.js";
import { handleUploadImage } from "../../../utils/images.utils.js";

export default async function() {
      const tags = await apiService.getAll(apiEndpoint.tags.getAll);
      const tagDictionary = tags.map(tag => ({
            key: tag.name,
            value: tag._id,
      }));

      const selectSearch = new SelectSearchComponent('#creator-tags', {
            data: tagDictionary,
            displayKey: 'key',
            valueKey: 'value',
            placeholder: 'Select tag',
            mode: 'multi',
            tagContainerSelector: '#selected-tag-area',
            onSelect: ({ id, text }) => {
                  console.log('Selected option: ', id, text);
            },
            onRemove: (id) => {
                  console.log('removed option: ', id);
            }
      });

      await selectSearch.init();

      handleUploadImage("upload-image", "image-input");

      const form = document.querySelector('.add-creator-form');
      const submitBtn = form.querySelector('button[type="submit"]');
      form.addEventListener('submit', async(e) => {
            e.preventDefault();

            const creatorName = document.getElementById('creator-name').value.trim();
            const creatorBirth = document.getElementById('creator-birth').value;
            const creatorViews = parseInt(document.getElementById('creator-views').value, 10);
            const creatorActive = document.getElementById('creator-active').value;
            const selectedTags = selectSearch.getSelected();

            const imageInput = document.getElementById('image-input');
            const imageFile = imageInput.files[0] || null;

            const formData = new FormData();
            formData.append("name", creatorName);
            formData.append("birth", creatorBirth);
            formData.append("view", creatorViews);
            formData.append("status", creatorActive);
            formData.append("tag_ids", selectedTags);
            if(imageFile) {
                  formData.append('file', imageFile);
            }

            try {
                  submitBtn.disabled = true;
                  submitBtn.textContent = 'Submitting...';
                  console.log('form data: ', formData);
                  const response = await apiMethod.createForm(apiEndpoint.creators.create, formData);
                  console.log('response: ', response);
            } catch(err) {
                  console.error('Submit failed: ', err);
                  toastNotifier.show('Submit creator failed: ', NOTIFICATION_TYPES.ERROR);
            } finally {
                  submitBtn.disabled = false;
                  submitBtn.textContent = 'Submit';
            }
      });
}