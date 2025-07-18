import mongoose, { Document, Schema } from "mongoose";
import { TagKind } from "./tag.dto.js";

export interface iTag extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      kind: TagKind;
}

const allowedKinds: TagKind[] = ['video', 'film', 'anime', 'manga', 'clip', 'image', 'creator'];

const TagSchema: Schema = new Schema({
      name: { type: String, required: true, unique: true },
      kind: { type: String, required: true, enum: allowedKinds },
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