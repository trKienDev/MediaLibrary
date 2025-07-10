import apiCreator from "../../api/creator.api.js";
import apiFilm from "../../api/film.api.js";

export default async function getFilmAndCreatorNames(video) {
      return Promise.all([
            apiFilm.getName(video.film_id),
            apiCreator.getName(video.creator_id)
      ]);
}
