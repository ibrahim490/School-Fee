import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "school_fee_tracker";

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set.");
}

let cachedClient = null;

export async function getDb() {
  if (cachedClient) {
    return cachedClient.db(dbName);
  }
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client.db(dbName);
}
