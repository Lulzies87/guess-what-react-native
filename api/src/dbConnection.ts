import "dotenv/config";
import mongoose from "mongoose";

export async function initConnection() {
  if (!process.env.CONN_STRING) {
    throw new Error("Must provide a connection string");
  }

  const mongooseInstance = await mongoose.connect(process.env.CONN_STRING, {
    dbName: "guess-what",
  });
}
