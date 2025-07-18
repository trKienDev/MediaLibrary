import { TagDTO } from "./tag.dto.js";

export interface iTagRepository {
      getAll(): Promise<TagDTO[]>;
      create(data: TagDTO): Promise<TagDTO>;
}