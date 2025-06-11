const mongoose = require("mongoose");
const { MONGODB_URL } = require("./server-config");
async function DBconnect() {
  try {
    const connection = await mongoose.connect(MONGODB_URL);
    if (connection) {
      console.log(`connection is successfull`);
    }
  } catch (error) {
    console.log(`connection is unsuccessful`, error.message);
  }
}

module.exports = { DBconnect };
