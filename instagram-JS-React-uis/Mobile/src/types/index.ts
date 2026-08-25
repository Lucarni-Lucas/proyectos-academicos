export interface User {
  id?: string;
  name: string;
  email: string;
  image?: string;
}

export interface SimpleUser {
  id: string;
  name?: string;
  image?: string;
}

export interface Like {
  id: string;
  name?: string;
  image?: string;
}

export interface Comment {
  id: string;
  body: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  createdAt?: string;
}

export interface Post {
  id: string;
  image: string;
  description: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  likes: Like[];
  comments: Comment[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

export interface ProfileData {
  id?: string;
  name?: string;
  image?: string;
  posts?: Post[];
  following?: SimpleUser[];
  followers?: SimpleUser[];
}

export type RawApiPost = Record<string, unknown>;
