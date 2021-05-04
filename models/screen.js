const mongoose = require('mongoose')

const screenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Screenname required!!!']
    },
    available_seats: {
        type: Number,
        default: 100
    }
})
module.exports = mongoose.model('Screen',screenSchema)