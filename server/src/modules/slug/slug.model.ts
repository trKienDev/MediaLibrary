import mongoose, { Schema } from "mongoose";

export interface iSlug extends Document {
      slug: string;
      refType: string;
      refId: mongoose.Types.ObjectId;
}

const allowedRefTypes = ['video', 'film', 'anime', 'manga', 'clip', 'image', 'creator', 'idol', 'short', "tag", "studio"];

const SlugSchema = new Schema({
      slug: { type: String, unique: true, required: true },
      refType: { type: String, required: true, enum: allowedRefTypes},
      refId: { type: Schema.Types.ObjectId, required: true} 
}, {
      collection: 'Slugs', 
      timestamps: true
});

export const SlugModel = mongoose.model<iSlug>('Slug', SlugSchema); 