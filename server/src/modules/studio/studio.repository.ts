import { CreateStudioDTO, StudioDTO } from "./studio.dto.js";
import { iStudio, StudioModel } from "./studio.model.js";

export interface iStudioRepository {
      create(input: CreateStudioDTO): Promise<StudioDTO>;
}

export default class StudioRepository implements iStudioRepository {
      async getAll(): Promise<StudioDTO[]> {
            const studios = await StudioModel.find();
            return studios.map(studio => this.mapDocToDTO(studio));
      }

      async create(input: CreateStudioDTO): Promise<StudioDTO> {
            const newStudio = new StudioModel({
                  name: input.name,
                  slug: input.slug,
            });

            const saved = await newStudio.save();
            return this.mapDocToDTO(saved);
      }

      private mapDocToDTO(doc: iStudio): StudioDTO {
            return {
                  _id: doc._id.toString(),
                  name: doc.name,
                  slug: doc.slug,
            }
      }
}