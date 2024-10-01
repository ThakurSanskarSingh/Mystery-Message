import mongoose, { Connection, mongo } from "mongoose";

type ConnectionObject = {
    isConnected ?: number
}
const connection : ConnectionObject = {}

async function dbConnect(): Promise<void>{
if(connection.isConnected){
    console.log("Already connected tp databse");
}
try {
  const db  =   await mongoose.connect(process.env.MONGODB_URI || '',
  {})
  connection.isConnected = db.connections[0].readyState
  console.log('Database connected succesfully')
} catch (error) {
    console.log("databaase connnection failed")

    process.exit(1)
}
}
export default dbConnect