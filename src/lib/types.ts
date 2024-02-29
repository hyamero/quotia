export type PostItem = {
  id: string;
  authorId: string;
  content: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  likes: number;
  likedByUser: boolean;
  parentId: string | null;
  replies: number;
};

export type TempPostItem = Omit<
  PostItem,
  "likes" | "likedByUser" | "updatedAt" | "replies"
>;

export type User = {
  id: string;
  slug: string | null;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
};

export type Post = PostItem & {
  author: User;
};

export type Like = {
  postId: string;
  userId: string;
  user: User;
};
