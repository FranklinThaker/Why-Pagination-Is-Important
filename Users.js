const mongoose = require('mongoose');

const Users = mongoose.Schema({
  name: { type: String, default: '' },
  age: { type: Number, default: 0 },
}, {
  timestamps: true,
});

module.exports = mongoose.model('users', Users);
