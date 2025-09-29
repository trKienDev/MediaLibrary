import mongoose, { Document, Schema } from "mongoose";

export interface iFilm extends Document {
      _id: mongoose.Types.ObjectId;
      name: string;
      slug: string;
      description?: string;
      release_date?: Date,
      thumbnail: string;
      rating: number;
      code_id: mongoose.Types.ObjectId;
      studio_id?: mongoose.Types.ObjectId;
      creator_ids?: mongoose.Types.ObjectId[];
      tag_ids?: mongoose.Types.ObjectId[];
      collection_ids?: mongoose.Types.ObjectId[];
      video_ids: mongoose.Types.ObjectId[];
}

const FilmSchema: Schema = new Schema({
      name: { type: String, required: true, unique: true },
      slug: { type: String, required: true, unique: true },
      description: { type: String },
      release_date: {
            type: Date, 
            validate: {
                  validator: function(value: Date) {
                        return value >= new Date('1900-01-01') && value <= new Date();
                  },
                  message: 'Release date must be between January 1, 1900, and today.'
            }
      },
      thumbnail: { type: String, required: false, match: /\.(jpeg|jpg|gif|png)$/i },
      rating: { type: Number, min: 1, max: 5 },
      code_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Code' },
      studio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio'},
      creator_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Creator'}],
      tag_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
      collection_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection'}],
      video_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video'}],
}, {
      collection: 'Films',
      timestamp: true
});

export const FilmModel = mongoose.model<iFilm>('Film', FilmSchema);

