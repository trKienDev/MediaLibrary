import { CreateTagDTO, TagDTO } from "./tag.dto.js";
import { TagModel } from "./tag.model.js";

export interface iTagRepository {
      getAll(): Promise<TagDTO[]>;
      create(data: CreateTagDTO): Promise<TagDTO>;
}

export class TagRepository implements iTagRepository {
      async getAll(): Promise<TagDTO[]> {
            const tags = await TagModel.find();
            return tags.map(doc => ({
                  _id: doc.id,
                  name: doc.name,
                  class: doc.class,
                  scopes: doc.scopes,
            }));
      }

      async create(data: CreateTagDTO): Promise<TagDTO> {
            console.log('data: ', data);
            const tag = new TagModel(data);
            const saved = await tag.save();
            return {
                  _id: saved.id,
                  name: saved.name, 
                  class: saved.class,
                  scopes: saved.scopes
            }
      }
}