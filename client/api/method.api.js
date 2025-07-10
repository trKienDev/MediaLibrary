import { toastNotifier } from "../app.admin.js";
import appConfigs from "../config/app.config.js";
import NOTIFICATION_TYPES from "../constants/notification-types.constant.js";

/* --- Abstract handle response --- */
async function processReponse(response) {
      if(!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }));
            toastNotifier.show(error.error || 'Unknown error', NOTIFICATION_TYPES.ERROR);
            return { success: false, error: error.error || 'Unknown error' };
      }
      const result = await response.json().catch(() => ({}));
      return { success: true, data: result };
}

/* --- STRATEGY INTERFACE: buildOptions(data) --- */
class GetStrategy {
      buildOptions() {
            return { method: 'GET' } 
      }
}
class JsonPostStrategy {
      buildOptions(data) {
            return {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data)
            };
      }
}
class JsonPutStrategy {
      buildOptions(data) {
            return {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data)
            };
      }
}
class FormPostStrategy {
      buildOptions(data) {
            return {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json'},
                  body: JSON.stringify(data)
            };
      }
}
class FormPutStrategy {
      buildOptions(data) {
            return {
                  method: 'PUT',
                  body: data
            };
      }
}
class DeleteStrategy {
      buildOptions() {
            return { method: 'DELETE'};
      }
}

/* --- API REQUEST ENGINE --- */
async function apiRequest(endpoint, strategy, data) {
      try {
            const options = strategy.buildOptions(data);
            const response = await fetch(`${appConfigs.SERVER}${endpoint}`, options);
            return await processReponse(response);
      } catch(error) {
            throw new Error(`API request error: ${error.message}`);
      }
}

/* --- FACADE fetch_api --- */
const apiMethod = {
      get: (endpoint) => apiRequest(endpoint, new GetStrategy()),
      createJson: (endpoint, data) => apiRequest(endpoint, new JsonPostStrategy(), data),
      updateJson: (endpoint, data) => apiRequest(endpoint, new JsonPutStrategy(), data),
      createForm: (endpoint, data) => apiRequest(endpoint, new FormPostStrategy(), data),
      updateForm: (endpoint, data) => apiRequest(endpoint, new FormPutStrategy(), data),
      delete: (endpoint) => apiRequest(endpoint, new DeleteStrategy())
};
export default apiMethod;


