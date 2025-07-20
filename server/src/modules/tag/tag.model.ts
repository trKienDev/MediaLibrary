import mongoose, { Document, Schema } from "mongoose";
import { MediaType } from "../../interfaces/media-type.interface.js";

export interface iTag extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      class: string;
      slug: string;
      scopes: MediaType[];
}

const allowedScope: MediaType[] = ['video', 'film', 'anime', 'manga', 'clip', 'image', 'creator', 'idol', 'short'];

const TagSchema: Schema = new Schema({
      name: { type: String, required: true, unique: true },
      class: { type: String, required: true },
      slug: { type: String, required: true },
      scopes: [{ type: String, required: true, enum: allowedScope }],
}, {
      collection: 'Tags', 
      timestamps: true
});

TagSchema.virtual('film_ids', {
      ref: 'Film',
      localField: '_id',
      foreignField: 'tag_ids',
      justOne: false
});
TagSchema.virtual('video_ids', {
      ref: 'Video',
      localField: '_id',
      foreignField: 'tag_ids',
      justOne: false
});

TagSchema.set('toObject', { virtuals: true });
TagSchema.set('toJSON', { virtuals: true });

export const TagModel = mongoose.model<iTag>('Tag', TagSchema);