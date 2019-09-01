const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name : String,
    description: String,
    price : Number,
    seat: Number,
    openRegis: Date,
    closeRegis: Date,
    formSchema:[{
        inputType:{
            type:String,
            enum:['number','text','email']
        },
        label:String 
    }]

})

module.exports = mongoose.model('Event',EventSchema);