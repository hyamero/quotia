export type PostItem = {
  id: string;
  authorId: string;
  content: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  likes: number;
  likedByUser: boolean;
};

export type TempPostItem = Omit<
  PostItem,
  "likes" | "likedByUser" | "updatedAt"
>;

export type User = {
  id: string;
  slug: string | null;
  name: string | null;
  email: string;
  image: string | null;
};

export type Post = PostItem & {
  author: User;
};
