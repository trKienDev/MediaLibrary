import apiEndpoint from "./endpoint.api.js";
import apiMethod from "./method.api.js";

async function getById(filmId) {
      const result = await apiMethod.get(`${apiEndpoint.films}/${filmId}`);
      if(result.success === false) throw new Error(result.error);
      return result.data;
}
async function getName(filmId) {
      const film = await getById(filmId);
      return film.name;
}

const apiFilm = {
      getById,
      getName,
}
export default apiFilm;
