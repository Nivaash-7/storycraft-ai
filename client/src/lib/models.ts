import { ObjectId } from "mongodb";

export interface Comment {
  _id: ObjectId | string;
  userId: string;
  username: string;
  content: string;
  avatar?: string;
  createdAt: Date | string;
}

export interface Story {
  _id: ObjectId | string;
  userId: string;
  title: string;
  genre: string;
  content: string;
  description: string;
  status: "Draft" | "Published";
  wordCount: number;
  lastEdited: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  publishedAt?: Date | string;
  likes: (ObjectId | string)[];
  comments: Comment[];
  author?: {
    username: string;
    avatar?: string;
  };
}

export interface Activity {
  _id: ObjectId;
  userId: string;
  storyId?: ObjectId;
  type: "Published" | "Liked" | "Commented" | "Drafted";
  details: string;
  createdAt: Date;
  comment?: string;
}

export interface User {
  userId: string;
  username: string;
  avatar?: string;
  publishedStories: ObjectId[];
}