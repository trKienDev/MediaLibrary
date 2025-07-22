import apiService from "../../../api/api.instance.js";
import apiEndpoint from "../../../api/endpoint.api.js";
import { alertBox, toastNotifier } from "../../../app.admin.js";
import { SelectableTable } from "../../../components/tables/selectabe-table.component.js";
import { createSelectCheckboxTd, createTextTd, createTrWithId } from "../../../components/tables/table.component.js";
import NOTIFICATION_TYPES from "../../../constants/notification-types.constant.js";

export default async function() {
      const studioTableTbody = document.querySelector('.studio-table tbody');
      await renderStudiosTable(studioTableTbody);

      const studioForm = document.getElementById('studio-form');
      const submitBtn = studioForm.querySelector('button[type="submit"]');
      studioForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            const studioName = document.getElementById('studio-name').value.trim();
            if(studioName === '') {
                  alert('Please enter a studio name');
                  return;
            }

            const payload = { studio_name: studioName };

            try {
                  const response = await apiService.createJson(apiEndpoint.studios.create, payload);
                  alertBox.showSuccess('studio created');
                  studioForm.reset();
            } catch(error) {
                  console.error('Error creating studio: ', error);
                  alertBox.showError('studio created failed');
            } finally {
                  submitBtn.disabled = false;
                  submitBtn.textContent = 'Submit';
                  await renderStudiosTable(studioTableTbody);
            }
      });
}

async function renderStudiosTable(tbody) {
      const studios = await apiService.get(apiEndpoint.studios.getAll);

      tbody.innerHTML = '';
      const table = tbody.closest('table');
      const selectableTable = new SelectableTable(table, async (selectedStudio) => {
            const codeTableTbody = document.querySelector('.code-table tbody');
            await renderCodesTable(codeTableTbody, selectedStudio._id);
            await createCode(selectedStudio, codeTableTbody);
      });

      for(const studio of studios) {
            const { tr, checkbox } = createStudioTr(studio);
            selectableTable.addRow(tr, checkbox, studio);
            tbody.appendChild(tr);
      }
}

function createStudioTr(studio) {
      const tr = document.createElement('tr');
      tr.setAttribute('studio-id', studio._id);

      const nameTd = document.createElement('td');
      nameTd.textContent = studio.name;

      const { td: selectTd, checkbox } = createSelectCheckboxTd('studio-checkbox');
      tr.appendChild(selectTd);
      tr.appendChild(nameTd);

      return { tr, checkbox };
}

async function createCode(selectedStudio, tbody) {
      const studioLabel = document.getElementById('studio-label');
      studioLabel.textContent = selectedStudio.name;
      studioLabel.style.display = 'block';

      const codeForm = document.getElementById('code-form');
      const codeSubmitBtn = codeForm.querySelector('button[type="submit"]');
      codeForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            codeSubmitBtn.disabled = true;
            codeSubmitBtn.textContent = 'submitting';

            const codeName = document.getElementById('code-name').value.trim();
            if(codeName === '') {
                  toastNotifier.show('Please enter code name', NOTIFICATION_TYPES.WARNING);
            }

            const payload = { code_name: codeName, studio_id: selectedStudio._id };
            try {
                  const response = await apiService.createJson(apiEndpoint.codes.create, payload);
                  alertBox.showSuccess('code created');
                  codeForm.reset();
                  await renderCodesTable(tbody, selectedStudio._id);
            } catch(error) {
                  console.error('Error creating code: ', error);
                  alertBox.showError('code created failed');
            } finally {
                  codeSubmitBtn.disabled = false;
                  codeSubmitBtn.textContent = 'Submit';
            }
      });
}

async function renderCodesTable(tbody, studio_id) {
      const codes = await apiService.getById(apiEndpoint.codes.getByStudio, studio_id);

      tbody.innerHTML = '';
      codes.forEach(code => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                  <td>${code.name}</td>
            `;
            tbody.appendChild(tr);
      });
      
} 