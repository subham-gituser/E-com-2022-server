import mongoose from "mongoose";
import { config } from "dotenv";
mongoose.Promise = global.Promise;
config();

const DATABASE = process.env.MONGODB_URL.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD
);

const connectDB = async () => {
  try {
    await mongoose
      .connect(DATABASE, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      })
      .then((url) => {
        console.log(
          `database connected successfully with ${url.connection.port} - ${url.connection.name}`.cyan.bold
        );
      });
  } catch (error) {
    console.log(`${error}`.red.bold);
    process.exit(1);
  }
};

export default connectDB;
