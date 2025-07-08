import { apiGet } from "../../../api/api.service.js";
import apiEnpoint from "../../../api/endpoint.api.js";
import { toastNotifier } from "../../../app.admin.js";
import TableBuilder from "../../../components/tables/table-builder.component.js";
import tableRenderers from "../../../components/tables/table-renderers.component.js";
import NOTIFICATION_TYPES from "../../../constants/notification-types.constant.js";

(async function() {
      try {
            const fetchResult = await apiGet(apiEnpoint.tags.getAll);
            if(!fetchResult.success) {
                  throw new Error(fetchResult.error);
            }

            const allTags = fetchResult.data;
            
            const tagsTableConfig = {
                  columns: [
                        { 
                              header: 'Name', // Tiêu đề cột 1
                              render: (item) => tableRenderers.textRenderer(item, 'name')
                        }, 
                        {
                              header: 'Kind',
                              render: (item) => tableRenderers.textRenderer(item, 'kind')
                        }, {
                              header: 'Actions',
                              render: (item) => tableRenderers.actionsRenderer(item, [
                                    {
                                          label: 'Edit',
                                          iconClass: 'fa-solid fa-pencil',
                                          cssClass: 'light-btn',
                                          onClick: (tag) => alert(`Edit tag: ${tag.name}`)
                                    },
                                    {
                                          label: 'Delete',
                                          iconClass: 'fa-solid fa-trash',
                                          cssClass: 'danger-btn',
                                          onClick: (tag) => {
                                                if(confirm(`Are you sure to delete "${tag.name}"`)) {
                                                      alert(`Tag deleted: "${tag.name}"`);
                                                }
                                          }
                                    }
                              ])
                        }
                  ]
            }

            // Khai báo tagsTable ở đây để có thể truy cập ở cả hàm search
            let tagsTable;
            if(allTags && allTags.length > 0) {
                  tagsTable = new TableBuilder('.tag-table tbody', tagsTableConfig);
                  tagsTable.render(allTags);
            } else {
                  document.querySelector('.tag-table tbody').innerHTML = '<tr><td colspan="3">Không có dữ liệu để hiển thị.</td></tr>';
            }
            // Chức năng tìm kiếm
            const searchInput = document.querySelector('.search-input');
            searchInput.addEventListener('input', () => {
                  const searchTerm = searchInput.value.trim().toLowerCase();
                  const filteredTags = allTags.filter(tag => 
                        tag.name.toLowerCase().includes(searchTerm)
                  );
                  if(tagsTable) {
                        tagsTable.render(filteredTags);
                  }
            });
      } catch(error) {
            toastNotifier.show(error, NOTIFICATION_TYPES.ERROR);
            throw new Error(error);
      }
})();

