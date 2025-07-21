import mongoose, { FilterQuery } from "mongoose";
import { CreateCreatorDTO, CreatorDTO, CreatorsPaginationDTO, FilterCreatorsPagination } from "./creator.dto.js";
import { CreatorModel, iCreator } from "./creator.model.js";
import seedrandom from "seedrandom";

export interface iCreatorRepository {
      getAll(): Promise<CreatorDTO[]>;
      findRandomPagination(page: number, limit: number, filters: FilterCreatorsPagination, seed: string): Promise<CreatorsPaginationDTO>;
      findById(id: string): Promise<CreatorDTO | null>;
      findByNameAndBirth(name: string, birth: Date): Promise<CreatorDTO | null>;
      findByTagId(tag_id: string): Promise<CreatorDTO[]>;
      create(data: CreateCreatorDTO): Promise<CreatorDTO>;
      update(id: string, data: Partial<CreatorDTO>): Promise<CreatorDTO>;
      delete(id: string): Promise<CreatorDTO>;
}

export class CreatorRepository implements iCreatorRepository {
      async getAll(): Promise<CreatorDTO[]> {
            const creators = await CreatorModel.find();
            return creators.map(doc => this.mapDocToDTO(doc));
      }

      async findRandomPagination(page: number, limit: number, filters: FilterCreatorsPagination, seed: string): Promise<CreatorsPaginationDTO> {
            const filterQueries = this.buildFilterQueries(filters);
            const allMatching = await CreatorModel.find(filterQueries).exec();
            const rng = seedrandom(seed);
            const shuffled = allMatching.map(doc => ({ doc, key: rng() }))
                                                      .sort((a, b) => a.key - b.key)
                                                      .map(item => item.doc);

            const total = shuffled.length;
            const skip = (page - 1) * limit;
            const pageData = shuffled.slice(skip, skip + limit).map(doc => this.mapDocToDTO(doc));

            return { creators: pageData, total };
      }

      async findById(id: string): Promise<CreatorDTO | null> {
            if (!mongoose.Types.ObjectId.isValid(id)) return null;
            const doc = await CreatorModel.findById(id).exec();
            return doc ? this.mapDocToDTO(doc) : null;
      }

      async findByNameAndBirth(name: string, birth: Date): Promise<CreatorDTO | null> {
            const doc = await CreatorModel.findOne({ name, birth });
            return doc ? this.mapDocToDTO(doc) : null;
      }

      async findByTagId(tag_id: string): Promise<CreatorDTO[]> {
            if (!mongoose.Types.ObjectId.isValid(tag_id)) throw new Error("Invalid tag id");
            const creators = await CreatorModel.find({ tag_ids: new mongoose.Types.ObjectId(tag_id) });
            return creators.map(doc => this.mapDocToDTO(doc));
      }

      async create(data: CreateCreatorDTO): Promise<CreatorDTO> {
            const newCreator = new CreatorModel({
                  name: data.name,
                  slug: data.slug,
                  birth: data.birth,
                  image: data.image,
                  active: data.active,
                  views: data.views,
                  tag_ids: data.tag_ids?.map(id => new mongoose.Types.ObjectId(id)),
            });
            const saved = await newCreator.save();
            return this.mapDocToDTO(saved);
      }

      async update(id: string, data: Partial<CreatorDTO>): Promise<CreatorDTO> {
            if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ObjectId");
            const updated = await CreatorModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
            if (!updated) throw new Error("Error updating creator");
            return this.mapDocToDTO(updated);
      }

      async delete(id: string): Promise<CreatorDTO> {
            if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ObjectId");
            const deleted = await CreatorModel.findByIdAndDelete(id).exec();
            if (!deleted) throw new Error("Delete creator failed");
            return this.mapDocToDTO(deleted);
      }

      private buildFilterQueries(filters: FilterCreatorsPagination): FilterQuery<iCreator> {
            const query: FilterQuery<iCreator> = {};
            if (filters.tag_ids?.length) {
                  const validIds = filters.tag_ids.filter(mongoose.Types.ObjectId.isValid).map(id => new mongoose.Types.ObjectId(id));
                  if (validIds.length) query.tag_ids = { $in: validIds };
            }
            if (filters.studio_id && mongoose.Types.ObjectId.isValid(filters.studio_id)) {
                  query.studio_ids = new mongoose.Types.ObjectId(filters.studio_id);
            }
            if (filters.film_id && mongoose.Types.ObjectId.isValid(filters.film_id)) {
                  query.film_ids = new mongoose.Types.ObjectId(filters.film_id);
            }
            return query;
      }

      private mapDocToDTO(doc: iCreator): CreatorDTO {
            return {
                  _id: doc._id.toString(),
                  name: doc.name,
                  slug: doc.slug,
                  birth: doc.birth,
                  image: doc.image,
                  active: doc.active,
                  views: doc.views,
                  studio_ids: doc.studio_ids?.map(id => id.toString()),
                  film_ids: doc.film_ids?.map(id => id.toString()),
                  video_ids: doc.video_ids?.map(id => id.toString()),
                  tag_ids: doc.tag_ids?.map(id => id.toString()),
            }
      }
}