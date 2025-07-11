import apiService from "../../api/api.instance.js";
import apiEndpoint from "../../api/endpoint.api.js";

async function getFilmAndCreatorNames(video) {
      return Promise.all([
            apiService.getName(apiEndpoint.films.getById ,video.film_id),
            apiService.getName(apiEndpoint.creators.getById, video.creator_id),
      ]);
}

const videoService = {
      getFilmAndCreatorNames,
}
export default videoService;

