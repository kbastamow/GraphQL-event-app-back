const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    date: {
        type: String,
    },
    price: {
        type: Number,
    },
    image: {
        type: String
    },
    artistIds: [{
        type: ObjectId,
        ref: 'Artist'
    }]
})

module.exports = mongoose.model('Event', EventSchema)