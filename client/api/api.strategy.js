import apiEndpoint from "./endpoint.api.js";
import apiMethod from "./method.api.js";

/**
 * ApiStrategy
 * Implements all business logic for Creator API
*/
export default class ApiStrategy {
      async getAll() {
            const creators = await apiMethod.get(apiEndpoint.creators.getAll);
            return this.#handleResult(creators);
      }
      async getById(creatorId) {
            const url = `${apiEndpoint.creators.getById}/${creatorId}`;
            const creator = await apiMethod.get(url);
            return this.#handleResult(creator);
      }
      async getByTagId(tagId) {
            const url = `${apiEndpoint.creators.getById}/${tagId}`;
            const result = await apiMethod.get(url);
            return this.#handleResult(result);
      }
      async getName(creatorId) {
            const creator = await this.getById(creatorId);
            return creator.name;
      }
      async getImage(creatorId) {
            const creator = await this.getById(creatorId);
            return creator.image;
      }

      #handleResult(result) {
            if(!result.success) {
                  throw new Error(result.error);
            }
            return result.data;
      }
}

