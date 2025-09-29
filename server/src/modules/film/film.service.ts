import { ServerResponse } from "http";
import { UploadFiles } from "../../enums.js";
import { ApiRequest } from "../../interfaces/api-request.interface.js";
import { sendError } from "../../middlewares/response.js";
import { uploadFile } from "../../utils/file.utils.js";
import { extractParamFromRequest } from "../../utils/request.utils";
import { iSlugRepository } from "../slug/slug.repository.js";
import { iFilmRepository } from "./film.repository.js";
import { slugify } from "../../utils/string.utils.js";
import { CreateFilmDTO } from "./film.dto.js";

export class FilmService {
      constructor(
            private readonly _filmRepository: iFilmRepository,
            private readonly _slugRepository: iSlugRepository,
      ) {}

      async createFilm(req: ApiRequest, res: ServerResponse) {
            const { file_name } = await uploadFile(req, UploadFiles.FILMS);

            const film_name = extractParamFromRequest(req, "film_name");
            const existingFilm = await this._filmRepository.findByName(film_name);
            if(existingFilm) return sendError(res, 409, "film name has already existed");

            const film_slug = slugify(film_name);
            const studio_id = extractParamFromRequest(req, "studio_id");
            const code_id = extractParamFromRequest(req, "code_id");
            const film_description = extractParamFromRequest(req, "film_description");
            const release_date = extractParamFromRequest(req, "release_date");
            const film_rating = extractParamFromRequest(req, "film_rating");
            const film_tags = extractParamFromRequest(req, "tag_ids").split(',')
                                          .map(s => s.trim())
                                          .filter(s => s.length > 0);
            const film_collections = extractParamFromRequest(req, "collection_ids")
                                                      .split('.')
                                                      .map(s => s.trim())
                                                      .filter(s => s.length > 0);

            const dto: CreateFilmDTO = {
                  name: film_name,
                  slug: film_slug,
                  thumbnail: file_name,
                  rating: Number(film_rating),
                  code_id: code_id,
            }
            if(film_description) dto.description = film_description;
            if(studio_id) dto.studio_id = studio_id;
            if(film_tags) dto.tag_ids = film_tags;
            if(film_collections) dto.collection_ids = film_collections;

            const createdFilm = await this._filmRepository.create(dto);
            await this._slugRepository.create(film_slug, "film", createdFilm._id);
            return createdFilm;
      }
}