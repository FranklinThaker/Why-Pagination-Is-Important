const mongoose = require('mongoose');

const connectionObj = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

exports.connect = async () => {
  mongoose.Promise = global.Promise;
  mongoose.set('debug', true);
  await mongoose.connect('mongodb://localhost:27017/training',
    connectionObj).then(() => {
    console.log('Successfully connected to the database');
  }).catch((err) => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
  });
};
