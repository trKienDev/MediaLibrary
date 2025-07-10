import apiEndpoint from "../../../api/endpoint.api.js";
import { toastNotifier } from "../../../app.main";
import appConfigs from "../../../config/app.config.js";
import NOTIFICATION_TYPES from "../../../constants/notification-types.constant.js";

(async function() {
      alert('hello');
})();
 

async function fetchSectionData(type, page, seed) {
      const apiUrl = `${appConfigs.SERVER}${apiEndpoint.homepageFeeds}?type=${type}&page=${page}&seed=${seed}`;
      const response = await fetch(apiUrl);

      if(!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
      }

      const json = await response.json();
      return json.data;
}


