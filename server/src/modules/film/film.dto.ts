export interface FilmDTO {
      _id: string;
      name: string;
      slug: string;
      description?: string
      release_date?: Date,
      thumbnail: string;
      rating: number;
      code_id: string;
      studio_id?: string;
      creator_ids?: string[];
      tag_ids?: string[];
      collection_ids?: string[];
      video_ids: string[];
}

export interface CreateFilmDTO {
      name: string;
      slug: string;
      description?: string
      release_date?: Date,
      thumbnail: string;
      rating: number;
      code_id: string;
      studio_id?: string;
      tag_ids?: string[];
      collection_ids?: string[];
}