const { Schema, model } = require('mongoose');

const AlertSchema = new Schema(
  {
    type: String,
    message: String,
    severity: String,
    active: Boolean
  },
  { timestamps: true }
);

module.exports = model('Alert', AlertSchema);