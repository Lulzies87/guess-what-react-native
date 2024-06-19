import "dotenv/config";
import mongoose from "mongoose";

let connection: mongoose.ConnectOptions | undefined;

// export function getConnection() {
//   if (!connection) {
//     throw new Error("Must init connection first!");
//   }

//   return connection;
// }

export async function initConnection() {
  if (!process.env.CONN_STRING) {
    throw new Error("Must provide a connection string");
  }

  const mongooseInstance = await mongoose.connect(process.env.CONN_STRING, {
    dbName: "guess-what",
  });

  connection = mongooseInstance.connection;
}
