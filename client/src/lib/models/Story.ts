import { ObjectId } from "mongodb";

   export interface Story {
     _id: ObjectId;
     userId: string; 
     title: string;
     genre: string;
     content: string;
     description: string;
     status: "Draft" | "Published";
     wordCount: number;
     lastEdited: Date;
     createdAt: Date;
     updatedAt: Date;
     publishedAt?: Date;
     likes: ObjectId[];
     comments: ObjectId[];
   }