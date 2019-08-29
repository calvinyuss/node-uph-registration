const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const Event = require('../models/event');
const Form = require('../models/form');

router.get('/:id',async(req,res)=>{
    let event = await Event.findById(req.params.id);
    res.render('form',{
        event:event
    });
})

router.post('/:id/register',async(req,res)=>{
    let event = await Event.findById(req.params.id);
    let newForm = {};
    let fieldName = event.formSchema.map(field => field.label)
    for(let field of fieldName){
        if(!req.body[field]){
            res.redirect('back')
        }
        newForm[field] = req.body[field]
    }
    let form
    try {
        form = await Form.create({
            ownedBy: event._id,
            data: newForm,
        })
        req.flash("success_msg","Register Success wait for email")
        res.redirect('back');
    } catch (error) {
        console.log(error)
        res.redirect("back")
    }

})

module.exports = router;