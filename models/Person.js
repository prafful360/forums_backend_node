const mongoose = require("mongoose");
const schema = mongoose.Schema;

const PersonSchema = new schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String
  },
  // gender: {
  //   type: String,
  //   required: true
  // },

  profilepic: {
    type: String,
    default:
      "https://www.123rf.com/photo_29727803_stock-vector-businessman-silhouette-avatar-profile-picture.html"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Person = mongoose.model("myperson", PersonSchema);
