
import { iSlug, SlugModel } from "./slug.model.js";

export interface iSlugRepository {
      create(slug: string, refType: string, refId: string): Promise<iSlug>;
      findBySlug(slug: string): Promise<iSlug | null>;
}

export class SlugRepository implements iSlugRepository {
      async create(slug: string, refType: string, refId: string): Promise<iSlug> {
            const doc = new SlugModel({ slug, refType, refId });
            return await doc.save();
      }
      async findBySlug(slug: string): Promise<iSlug | null> {
            return await SlugModel.findOne({ slug });
      }
}