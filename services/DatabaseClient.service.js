import { MongoClient } from "mongodb";

let client;
const connection = () => client ??= new MongoClient(process.env.MONGO_HOST);
const closeConnection = () => {
    client?.close();
    process.exit(0);
}

process.on('SIGINT', closeConnection); // При натисканні CTRL+C
process.on('SIGTERM', closeConnection); // При завершенні процесу

export default connection;
