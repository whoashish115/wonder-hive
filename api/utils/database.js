const mongoose = require("mongoose");
const URI = process.env.MONGODB_URL;

const connectDB = () => {
  mongoose.connect(
    URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (error) => {
      if (error) throw error;
      console.log("Connected to Mongodb Database");
    }
  );
  mongoose.set('strictQuery', true);
};

module.exports = connectDB;
