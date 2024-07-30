import mongoose from "mongoose";

import colors from "colors";

const ConnectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`connected ${conn.connection.host}`.bgMagenta.white);
  } catch (error) {
    console.log(`Error In mongoos e ${error}`.bgRed.white);
  }
};

export default ConnectDB;
