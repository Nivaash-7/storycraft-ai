import { ObjectId } from "mongodb";

   export interface Comment {
     _id: ObjectId;
     userId: string; 
     storyId: ObjectId; 
     content: string;
     createdAt: Date;
}