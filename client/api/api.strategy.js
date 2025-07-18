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
      async updateJson(apiEndpoint, data) {
            const result = await apiMethod.updateJson(apiEndpoint, data);
            return this.#handleResult(result);
      }

      #handleResult(result) {
            if(!result.success) {
                  console.log('result: ', result);
                  throw new Error(result.error);
            }
            return result.data;
      }
}

