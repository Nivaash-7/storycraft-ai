import { ObjectId } from "mongodb";

export interface Activity {
  _id: ObjectId;
  userId: string;
  storyId?: ObjectId; 
  type: "Published" | "Liked" | "Commented" | "Drafted" ;
  details: string;
  createdAt: Date;
  comment?: string;
}