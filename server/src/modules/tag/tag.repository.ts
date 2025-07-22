import { CreateTagDTO, TagDTO } from "./tag.dto.js";
import { iTag, TagModel } from "./tag.model.js";

export interface iTagRepository {
      getAll(): Promise<TagDTO[]>;
      getByScopes(scopes: string[]): Promise<TagDTO[]>;
      create(data: CreateTagDTO): Promise<TagDTO>;
}

export class TagRepository implements iTagRepository {
      async getAll(): Promise<TagDTO[]> {
            const tags = await TagModel.find();
            return tags.map(tag => this.mappingDocToDTO(tag));
      }

      async getByScopes(scopes: string[]): Promise<TagDTO[]> {
            const tags = await TagModel.find({
                  scopes: { $in: scopes }
            });
            return tags.map(tag => this.mappingDocToDTO(tag));
      }

      async create(data: CreateTagDTO): Promise<TagDTO> {
            const tag = new TagModel(data);
            const saved = await tag.save();
            return this.mappingDocToDTO(saved);
      }

      private mappingDocToDTO(doc: iTag): TagDTO {
            return {
                  _id: doc._id.toString(),
                  name: doc.name,
                  slug: doc.slug,
                  scopes: doc.scopes,
            }
      }
}