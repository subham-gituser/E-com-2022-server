import { config } from "dotenv";
config();
import "colors";
import { createServer } from 'http'
import { Server } from 'socket.io'
import app from "./app/app.js";
import SocketServer from "./app/config/socket.config.js";
//database connection
import database from "./app/config/database.config.js";
const PORT = process.env.PORT || 6060;
database();

//checking node versions
const [major, minor] = process.versions.node.split(".").map(parseFloat);
if (major < 7 || (major === 7 && minor <= 5)) {
  console.log(
    "Please go to nodejs.org and download version 8 or greater. 👌\n "
  );
  process.exit();
}
const http = createServer(app)
export const io = new Server(http)


io.on("connection", (socket) => {
  SocketServer(socket)
})

http.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT} in ${app.get('env')} mode`.green.bold)
  console.log("  Press CTRL-C to stop\n".red.bold);
});
