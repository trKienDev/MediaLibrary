import appConfigs from "../config/app.config.js";

/**
 * Một hàm client API trung tâm, linh hoạt để xử lý các request.
 * Tự động xử lý FormData và JSON.
 * * @param {object} options - Các tùy chọn cho request.
 * @param {string} options.endpoint - Endpoint của API (ví dụ: '/users').
 * @param {string} [options.method='GET'] - Phương thức HTTP (GET, POST, PUT, DELETE).
 * @param {object|FormData|null} [options.data=null] - Dữ liệu cần gửi đi.
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
*/
async function apiClient({ endpoint, method = 'GET', data = null }) {
      const url = `${appConfigs.SERVER}${endpoint}`;
      
      const fetchOptions = {
            method: method.toUpperCase(),
            headers: {}
      };

      // Tự động xử lý body và header dựa trên loại dữ liệu
      if(data) {
            if(data instanceof FormData) {
                  // Khi dùng FormData, trình duyệt sẽ tự động đặt Content-Type
                  // với 'boundary' chính xác. Đừng đặt thủ công!
                  fetchOptions.body = data;
            } else {
                  // Mặc định là JSOn
                  fetchOptions.headers['Content-Type'] = 'application/json';
                  fetchOptions.body = JSON.stringify(data);
            }
      }

      try {
            const response = await fetch(url, fetchOptions);

            // Errors
            if(response.ok) {
                  const errorData = await response.json();
                  const errorMessage = errorData.error || 'An unknown error occurred';
                  showToast(errorMessage, 'error');
                  return { success: false, error: errorMessage };
            }

            // Success
            const responseText = await response.text();
            const result = responseText ? JSON.parse(responseText) : {};

            return { success: true, data: result };
      } catch(error) {
            console.error(`API Client Error [${method} - ${endpoint}]: `, error);
            const errorMessage = `Network error or invalid response`;
            showToast(errorMessage, 'error');
            return { success: false, error: errorMessage};
      }
}

// GET 
export const apiGet = (endpoint) => apiClient({ endpoint });

// DELETE
export const apiDelete = (endpoint) => apiClient({ endpoint, method: 'DELETE' });

// CREATE
export const createJson = (endpoint, data) => apiClient({ endpoint, method: 'POST', data });
export const createForm = (endpoint, formData) => apiClient({ endpoint, method: 'POST', data: formData });

// UPDATE
export const updateJson = (endpoint, data) => apiClient({ endpoint, method: 'PUT', data});
export const updateForm = (endpoint, formData) => apiClient({ endpoint, method: 'PUT', data: formData });