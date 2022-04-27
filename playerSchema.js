const mongoose = require("mongoose");

const catchSchema = new mongoose.Schema({
    weight: {
        type: Number,
        required: [true, "A catch must have a weight"]
    },
    latitude: {
        type: String,
        required: [true, "A catch must have a latitude"]
    },
    longitude: {
        type: String,
        required: [true, "A catch must have a longitude"]
    },
    catchDate: {
        type: String,
        required: [true, "A catch must have a date"]
    }
})




