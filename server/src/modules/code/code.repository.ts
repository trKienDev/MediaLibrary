import mongoose from "mongoose";
import { CodeDTO, CreateCodeDTO } from "./code.dto.js";
import { CodeModel, iCode } from "./code.model.js";
import { StudioModel } from "../studio/studio.model.js";

export interface iCodeRepository {
      getAll(): Promise<CodeDTO[]>;
      create(data: CreateCodeDTO): Promise<CodeDTO>;
}

export class CodeRepository implements iCodeRepository {
      async getAll(): Promise<CodeDTO[]> {
            const codes = await CodeModel.find();
            return codes.map(code => this.mappingDocToDTO(code));
      }

      async getByStudio(studio_id: mongoose.Types.ObjectId): Promise<CodeDTO[]> {
            const codes = await CodeModel.find({ studio_id: studio_id});
            return codes.map(code => this.mappingDocToDTO(code));
      }

      async create(data: CreateCodeDTO): Promise<CodeDTO> {
            const code = new CodeModel(data);
            const saved = await code.save();

            await StudioModel.findByIdAndUpdate(
                  data.studio_id, 
                  {
                        $push: { code_ids: saved.studio_id },
                  }
            );

            return this.mappingDocToDTO(saved);
      }  
      
      private mappingDocToDTO(doc: iCode): CodeDTO {
            return { 
                  _id: doc._id.toString(),
                  name: doc.name,
                  slug: doc.slug,
                  studio_id: doc.studio_id.toString(),
            }
      }
}