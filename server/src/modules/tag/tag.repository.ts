import { iTagRepository } from "./itag.repository.js";
import { TagDTO } from "./tag.dto.js";
import { TagModel } from "./tag.model.js";

export class TagRepository implements iTagRepository {
      async getAll(): Promise<TagDTO[]> {
            const tags = await TagModel.find();
            return tags.map(doc => ({
                  _id: doc.id,
                  name: doc.name,
                  kind: doc.kind
            }));
      }

      async create(data: TagDTO): Promise<TagDTO> {
            const tag = new TagModel(data);
            const saved = await tag.save();
            return {
                  _id: saved.id,
                  name: saved.name, 
                  kind: saved.kind
            }
      }
}