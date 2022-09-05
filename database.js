const mongoose = require('mongoose');

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(data => {
      console.log(`Mongo db connected with server ${data.connection.host}`);
    })
    .catch(err => {
      console.log('err', err);
    });
};
//mongoose.connect return promise so then catch
module.exports = connectDatabase;
