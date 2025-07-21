import mongoose, { Schema, Document } from "mongoose";

export interface iStudio extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      slug: string;
      code_ids: mongoose.Types.ObjectId[];
      creator_ids: mongoose.Types.ObjectId[];
      film_ids: mongoose.Types.ObjectId[];
}

// Define schema for Studio
const StudioSchema: Schema = new Schema ({
      name: { type: String, required: true },
      slug: { type: String, required: true },
      code_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Code' }], 
      creator_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Creator' }],
      film_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Film' }],
}, {
      collection: 'Studios', 
      timestamps: true
});

StudioSchema.virtual('video_ids', {
      ref: 'Video',
      localField: '_id',
      foreignField: 'studio_id',
      justOne: false
});

StudioSchema.set('toObject', { virtuals: true });
StudioSchema.set('toJSON', { virtuals: true });

export const StudioModel = mongoose.model<iStudio>('Studio', StudioSchema);
