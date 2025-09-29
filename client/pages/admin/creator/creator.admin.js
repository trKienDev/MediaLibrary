import apiService from "../../../api/api.instance.js";
import apiEndpoint from "../../../api/endpoint.api.js";
import { alertBox, toastNotifier } from "../../../app.admin.js";
import SelectSearchComponent from "../../../components/select-search.component.js";
import { createImageTd, createTextTd, createTrWithId } from "../../../components/tables/table.component.js";
import appConfigs from "../../../config/app.config.js";
import { ServerFolders } from "../../../constants/folder.constant.js";
import NOTIFICATION_TYPES from "../../../constants/notification-types.constant.js";
import { renameUploadedFile } from "../../../utils/files.utils.js";
import { handleUploadImage } from "../../../utils/images.utils.js";

export default async function() {
      const creatorTableTbody = document.querySelector('.creator-table tbody');
      await renderCreatorsTable(creatorTableTbody);

      const tags = await apiService.get(`${apiEndpoint.tags.getByScopes}?scopes=creator`);
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
            optionContainerSelector: '#selected-option-area',
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
                  const renamedFile = renameUploadedFile(imageFile, creatorName);
                  formData.append('file', renamedFile);
            }

            try {
                  submitBtn.disabled = true;
                  submitBtn.textContent = 'Submitting...';
                  console.log('form data: ', formData);
                  const response = await apiService.createForm(apiEndpoint.creators.create, formData);
                  alertBox.showSuccess('creator created');
                  renderCreatorsTable(creatorTableTbody);
            } catch(err) {
                  console.error('Submit failed: ', err);
                  toastNotifier.show('Submit creator failed: ', NOTIFICATION_TYPES.ERROR);
            } finally {
                  submitBtn.disabled = false;
                  submitBtn.textContent = 'Submit';
            }
      });
}

async function renderCreatorsTable(tbody) {
      const creators = await apiService.get(apiEndpoint.creators.getAll);
      tbody.innerHTML = '';
      creators.forEach(creator => {
            const tr = createTrWithId(creator._id);
            const nameTd = createTextTd({ iText: creator.name, iCss: 'creator-name'});
            tr.appendChild(nameTd);
            
            const imgSrc = `${appConfigs.SERVER}/${ServerFolders.CREATORS}/${creator.image}`;
            const imgTd = createImageTd(imgSrc, 'image-td');
            tr.appendChild(imgTd);

            tbody.appendChild(tr);
      });
}
