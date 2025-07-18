export type TagKind = 'video' | 'film' | 'anime' | 'manga' | 'clip' | 'image' | 'creator';

export interface TagDTO {
      _id?: string;
      name: string;
      kind: TagKind;
}