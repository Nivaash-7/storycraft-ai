import { MongoClient } from "mongodb";

declare global {
  interface GlobalMongo {
    _mongoClientPromise?: Promise<MongoClient>;
  }
}

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Please define the MONGODB_URI environment variable.");

const options = { maxPoolSize: 10, minPoolSize: 2 };

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as unknown as GlobalMongo;
  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = new MongoClient(uri, options).connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri, options).connect();
}

export default clientPromise;