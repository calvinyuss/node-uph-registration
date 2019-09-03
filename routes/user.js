const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const moment = require('moment-timezone');

const Event = require('../models/event');
const Form = require('../models/form');
const mail = require('../config/mail');

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
            req.flash("error_msg","Something went wrong, try again")
            return res.redirect('back')
        }
        newForm[field] = req.body[field]
    }
    newForm['PembayaranURL'] = null;
    newForm['Date'] = moment().tz('Asia/Jakarta').format('lll');
    let form
    try {
        form = await Form.create({
            ownedBy: event._id,
            data: newForm,
        })
        mail.Send_FSAp(form.data)
        req.flash("success_msg","Register Success")
        res.redirect('back');
    } catch (error) {
        console.log(error)
        res.redirect("back")
    }

})

//upload file
router.get('/upload/:id',async (req,res)=>{
    let form = await Form.findById(req.params.id);
    console.log(form)
    res.render('upload',{
        form:form
    })
})

module.exports = router;