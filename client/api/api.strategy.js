import apiEndpoint from "./endpoint.api.js";
import apiMethod from "./method.api.js";

/**
 * ApiStrategy
 * Implements all business logic for Creator API
*/
export default class ApiStrategy {
      async get(apiEndpoint) {
            const result = await apiMethod.get(apiEndpoint);
            return this.#handleResult(result);
      }
      async getJson(apiEndpoint, data) {
            const result = await apiMethod.getJson(apiEndpoint, data);
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
      async getThumbnail(apiEndpoint, id) {
            const result = await this.getById(apiEndpoint, id);
            return result.thumbnail;
      }
      async getAvatarUrl(apiEndpoint, id) {
            const result = await this.getById(apiEndpoint, id);
            return result.avatar_url;
      }
      async getPagination({ apiEndpoint, page, limit, filters = {}}) {
            const params = new URLSearchParams({
                  page: String(page),
                  limit: String(limit)
            });

            Object.entries(filters).forEach(([key, value]) => {
                  if(value != null) params.append(key, value); // value != null covers both null and undefined
            });

            const url = `${apiEndpoint}?${params.toString()}`;

            const result = await apiMethod.get(url);
            return this.#handleResult(result);
      }
      async getFilmId(apiEndpoint, id) {
            const result = await this.getById(apiEndpoint, id);
            return result.film_id;
      }
      async createJson(apiEndpoint, json) {
            const result = await apiMethod.createJson(apiEndpoint, json);
            return this.#handleResult(result);
      }
      async updateJson(apiEndpoint, json) {
            const result = await apiMethod.updateJson(apiEndpoint, json);
            return this.#handleResult(result);
      }
      async createForm(apiEndpoint, form) {
            const result = await apiMethod.createForm(apiEndpoint, form);
            return this.#handleResult(result);
      }

      #handleResult(result) {
            if(!result.success) {
                  throw new Error(result.error);
            }
            return result.data;
      }
}

