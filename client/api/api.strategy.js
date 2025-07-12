import apiEndpoint from "./endpoint.api.js";
import apiMethod from "./method.api.js";

/**
 * ApiStrategy
 * Implements all business logic for Creator API
*/
export default class ApiStrategy {
      async getAll(apiEndpoint) {
            const result = await apiMethod.get(apiEndpoint);
            return this.#handleResult(result);
      }
      async getById(apiEndpoint, id) {
            const url = `${apiEndpoint}/${id}`;
            const result = await apiMethod.get(url);
            return this.#handleResult(result);
      }
      async getName(apiEndpoint, id) {
            const result = await this.getById(apiEndpoint, id);
            return result.name;
      }
      async getImage(apiEndpoint, id) {
            const result = await this.getById(apiEndpoint, id);
            return result.image;
      }
      async getAvatarUrl(apiEndpoint, id) {
            const result = await this.getById(apiEndpoint, id);
            return result.avatar_url;
      }

      #handleResult(result) {
            if(!result.success) {
                  console.log('result: ', result);
                  throw new Error(result.error);
            }
            return result.data;
      }
}

