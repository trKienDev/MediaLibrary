import apiService from "../../api/api.instance.js";

async function getFilmAndCreatorNames(video) {
      return Promise.all([
            apiService.getName(video.film_id),
            apiService.getName(video.creator_id),
      ]);
}

const videoService = {
      getFilmAndCreatorNames,
}
export default videoService;

