const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const ArtistSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    bio: {
        type: String,
    },
    type: {
        type: String,
        enum: ['solo artist', 'band', 'DJ']
    },
    genreIds: [
        {
          type: ObjectId,
          ref: "Genre",
        },
      ],
})

module.exports = mongoose.model('Artist', ArtistSchema)