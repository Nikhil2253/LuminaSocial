import mongoose from "mongoose";

const dbConnect = async () => {
  const CONNECTION_URI = process.env.CONNECTION_URI;

  if (!CONNECTION_URI) {
    console.error("CONNECTION_URI is not defined in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(CONNECTION_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1);
  }
};

export default dbConnect;
