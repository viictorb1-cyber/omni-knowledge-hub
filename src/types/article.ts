export interface Folder {
  id: string;
  name: string;
  category: 'pabx' | 'omni';
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: string;
  folderId: string;
  title: string;
  content: string;
  category: 'pabx' | 'omni';
  images: string[];
  videos: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
}
