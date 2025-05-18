import { ObjectId } from "mongodb";

   export interface User {
     _id: ObjectId;
     userId: string; 
     email: string;
     username?: string;
     createdAt: Date;
     updatedAt?: Date;
     publishedStories: ObjectId[];
     likedStories: ObjectId[];
     commentsMade: ObjectId[];
   }