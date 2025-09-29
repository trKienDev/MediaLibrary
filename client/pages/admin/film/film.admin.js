import apiService from "../../../api/api.instance.js";
import apiEndpoint from "../../../api/endpoint.api.js";
import SelectSearchComponent from "../../../components/select-search.component.js";
import { renameUploadedFile } from "../../../utils/files.utils.js";
import { handleUploadImage } from "../../../utils/images.utils.js";

let studio_id = null;

export default async function() {
      const filmForm = document.getElementById('film-form');

      const codeSelectSearch = new SelectSearchComponent('#film-code', {
            // data: codesDictionary,
            displayKey: 'key',
            valueKey: 'value',
            placeholder: 'Select code',
            mode: 'single',
      });
      await codeSelectSearch.init();

      const studios = await apiService.get(apiEndpoint.studios.getAll);
      const studiosDictionary = studios.map(studio => ({
            key: studio.name,
            value: studio._id,
      }));
      const studioSelectSearch = new SelectSearchComponent('#film-studios', {
            data: studiosDictionary,
            displayKey: 'key',
            valueKey: 'value',
            placeholder: 'Select studio',
            mode: 'single',
            onSelect: async ({ id, text }) => {
                  const codes = await apiService.getById(apiEndpoint.codes.getByStudio, id);
                  const codesDictionary = codes.map(code => ({
                        key: code.name, 
                        value: code._id,
                  }));
                  codeSelectSearch.reset();
                  codeSelectSearch.updateData(codesDictionary);
            },
      });
      await studioSelectSearch.init();    

      const tags = await apiService.get(`${apiEndpoint.tags.getByScopes}?scopes=film`);
      const tagsDictionary = tags.map(tag => ({
            key: tag.name,
            value: tag._id,
      }));
      const tagSelectSearch = new SelectSearchComponent('#film-tags', {
            data: tagsDictionary,
            displayKey: 'key',
            valueKey: 'value',
            placeholder: 'Select tag',
            mode: 'multi',
            optionContainerSelector: '#selected-option-area',
      });
      await tagSelectSearch.init();

      handleUploadImage("upload-image", "image-input");
      
      filmForm.addEventListener('submit', async(e) => {
            e.preventDefault();
            
            const studioId = studioSelectSearch.getSelected();
            const codeId = codeSelectSearch.getSelected();
            const codeText = codeSelectSearch.getSelected('text');
            const codeNumber = document.getElementById('code-number').value;
            const filmName = codeText + '-' + codeNumber;
            const filmDescription = document.getElementById('film-description').value;
            const filmDate = document.getElementById('release-date').value;
            const filmRating = document.getElementById('film-rating').value;
            const filmTags = tagSelectSearch.getSelected();
            const thumbnailInput = document.getElementById('image-input');
            const thumbnailFile = thumbnailInput.files[0] || null;

            const formData = new FormData();
            formData.append("film_name", filmName);
            formData.append("studio_id", studioId);
            formData.append("code_id", codeId);
            formData.append("film_description", filmDescription);
            formData.append("release_date", filmDate);
            formData.append("film_rating", filmRating);
            formData.append("tag_ids", filmTags);

            if(thumbnailFile) {
                  const renamedThumbnail = renameUploadedFile(thumbnailFile, filmName);
                  formData.append("file", renamedThumbnail);
            }
            
            console.log('form data: ', formData);

      });
}

async function renderCodeByStudio(studio_id) {
      

      const codeSelectSearch = new SelectSearchComponent('#film-code', {
            data: codesDictionary,
            displayKey: 'key',
            valueKey: 'value',
            placeholder: 'Select code',
            mode: 'single',
      });
      await codeSelectSearch.init();
}