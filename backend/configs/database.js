const mongoose = require("mongoose");

const connectDb = async() => {
    await mongoose.connect("mongodb+srv://unisync:UniSync1616@unisyncdb.lid7huk.mongodb.net/main");
};

module.exports = {
    connectDb,
};