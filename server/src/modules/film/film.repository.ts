import { CreateFilmDTO, FilmDTO } from "./film.dto.js";
import { FilmModel, iFilm } from "./film.model.js";

export interface iFilmRepository {
      create(data: CreateFilmDTO): Promise<FilmDTO>;
      findByName(filmname: string): Promise<FilmDTO | null>;
}

export class FilmRepository implements iFilmRepository {
      async findByName(filmname: string): Promise<FilmDTO | null> {
            const doc = await FilmModel.findOne({ name: filmname });
            return doc ? this.mapDocToDTO(doc) : null;
      }

      async create(data: CreateFilmDTO): Promise<FilmDTO> {
            const model = new FilmModel({
                  name: data.name,
                  slug: data.slug,
                  description: data.description ? data.description : undefined,
                  release_date: data.release_date ? data.release_date : undefined,
                  thumbnail: data.thumbnail,
                  rating: data.rating? Number(data.rating) : 0,
                  code_id: data.code_id,
                  tag_ids: data.tag_ids ? data.tag_ids : [],
                  studio_id: data.studio_id,
                  collection_ids: data.collection_ids ? data.collection_ids : [],
            });

            const saved = await model.save();
            return this.mapDocToDTO(saved);
      }

      private mapDocToDTO(doc: iFilm): FilmDTO {
            return {
                  _id: doc._id.toString(),
                  name: doc.name,
                  slug: doc.slug,
                  description: doc.description ? doc.description : undefined,
                  release_date: doc.release_date ? doc.release_date : undefined,
                  thumbnail: doc.thumbnail,
                  rating: doc.rating,
                  code_id: doc.code_id.toString(),
                  studio_id: doc.studio_id ? doc.studio_id.toString() : undefined,
                  creator_ids: doc.creator_ids ? doc.creator_ids.map(id => id.toString()) : undefined,
                  tag_ids: doc.tag_ids ? doc.tag_ids.map(id => id.toString()) : undefined,
                  collection_ids: doc.collection_ids ? doc.collection_ids.map(id => id.toString()) : undefined,
                  video_ids: doc.video_ids.map(id => id.toString()),
            }
      }
}