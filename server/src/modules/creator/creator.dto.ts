export interface CreatorDTO {
      _id: string;
      name: string;
      slug: string;
      birth: Date;
      image: string;
      studio_ids?: string[];
      film_ids?: string[];
      video_ids?: string[];
      tag_ids?: string[];
      active: boolean;
      views: number;
}

export interface CreateCreatorDTO {
      name: string;
      slug: string;
      birth: Date;
      image: string;
      tag_ids?: string[];
      active: boolean;
      views: number;
}

export interface CreatorsPaginationDTO {
      creators: CreatorDTO[];
      total: number;
}

export interface FilterCreatorsPagination {
      studio_id?: string;
      film_id?: string;
      tag_ids?: string[];
}

