const mongoose = require("mongoose")

const formSchema = new mongoose.Schema({
    ownedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Event"
    },
    data: mongoose.Schema.Types.Mixed,
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Form",formSchema)