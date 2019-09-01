const express = require('express');
const router = express.Router();
const passport = require('passport');
const mail = require('../config/mail');
const moment = require('moment')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const Event = require('../models/event');
const Form = require('../models/form');

router.get('/', (req, res) => res.redirect("/admin/login"));

// home page
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  let events = await Event.find({});
  res.render('dashboard', {
    user: req.user,
    events: events
  })
});

//create event
router.post('/event/create', ensureAuthenticated, async (req, res) => {
  user = req.user;
  const newEvent = new Event({
    createBy: user.id,
    name: req.body.createEventName,
    description: req.body.createDescription,
    openRegis:req.body.openRegis,
    closeRegis:req.body.closeRegis,
    price: req.body.createPrice,
    seat: req.body.createSeat,
    formSchema: [
      { inputType: 'text', label: "Name" },
      { inputType: 'email', label: "Email" },
      { inputType: 'number', label: "Student ID" },
      { inputType: 'text', label: 'Class' }
    ]
  })
  console.log(newEvent)
  await newEvent.save().then(() => {
    req.flash('success_msg', 'Event Created');
    res.redirect('/admin/dashboard');
  }).catch(err => {
    console.log(err);
    res.redirect('/admin/event/create')
  })
})

//delete event
router.delete('/event/:id', ensureAuthenticated, async (req, res) => {
  let eventID = req.params.id
  try{
    await Form.remove({ownedBy:eventID})
    await Event.remove({_id:eventID});
    res.json({msg:"delete succeed"})
  }catch(err){
    console.log(err)
    res.status(404).json({msg:"error"})
  }
})

//edit event page
router.get('/event/edit/:id', ensureAuthenticated, async (req, res) => {
  let event = await Event.findById(req.params.id);
  res.render('edit_event', {
    event: event
  })
})

//edit event field
router.put('/event/edit/:id', ensureAuthenticated, async (req, res) => {
  let event = await Event.findById(req.params.id);
  console.log(req.body)
  if (req.body["type"] === "formSchema") {
    for (let schema of event.formSchema) {
      if (schema._id == req.body._id) {
        schema.inputType = req.body.inputType
        schema.label = req.body.label
        console.log(event.formSchema)
        await event.save().then(result => {
          res.json(result)
          console.log(result)
          return
        }).catch(err => {
          console.log(err)
          res.status(404).json({ msg: 'Failed to update Event' })
        })
      }
    }
  } else if (req.body["type"] === "event") {
    keys = Object.keys(req.body).filter(name => !['type'].includes(name))
    console.log(keys)
    for (let key of keys) {
      event[key] = req.body[key];
    }
    console.log(event)
    await event.save().then(result => {
      console.log(result)
      res.json(result)
    }).catch(err => {
      console.log(err)
      res.status(404).json({ msg: 'Failed to update Event' })
    })
  }
})

//delete event field
router.delete('/event/edit/:id', ensureAuthenticated, async (req, res) => {
  let event = await Event.findById(req.params.id);
  let list = event.formSchema.filter(function (field) {
    return field._id != req.body._id
  })
  event.formSchema = list
  await event.save().then(result => {
    res.json(result)
    console.log(result)
    return
  }).catch(err => {
    console.log(err)
    res.status(404).json({ msg: 'Failed to update Event' })
  })

})

//add new field
router.post('/event/edit/:id', ensureAuthenticated, async (req, res) => {
  let event = await Event.findById(req.params.id);
  if (!req.body.new_inputType || !req.body.new_label) {
    return
  }
  let form = {
    inputType: req.body.new_inputType,
    label: req.body.new_label
  }
  event.formSchema.push(form)
  await event.save().then(() => {
    res.redirect('back')
  }).catch(err => res.redirect('back'));

})

//preview event
router.get('/event/:id', ensureAuthenticated, async (req, res) => {
  let event = await Event.findById(req.params.id);
  res.render('form', {
    event: event
  });
})

//show participant
router.get('/event/:id/participant', ensureAuthenticated, async (req, res) => {
  let event = await Event.findById(req.params.id);
  let forms = await Form.find({
    ownedBy: event._id
  })
  res.render('participant', {
    forms: forms,
    event: event
  });
})

//participant status
router.put('/event/:id/participant', ensureAuthenticated, async (req, res) => {
  let form = await Form.findById(req.body['_id']);
  let forms = await Form.find({ownedBy: req.params.id})
  let event = await Event.findById(req.params.id);
  if (form.ownedBy != req.params.id) {
    console.log("Unauthorize user")
    res.status('401').redirect('back')
  }
  form.status = req.body['value']
  await form.save()
    .then(result => {
      console.log(result.data.Name)
      console.log(result.data.Email)
      console.log(event.price)
      if(result.status==='waiting'){
        mail.paymentMail({
          name:result.data.name,
          price: result.data.price,
          email: result.data.Email
        })
      }
      res.json(result)
    })
    .catch(err => {
      console.log(err)
      res.status(404).json({ msg: "Failed to Update Status" })
    })
})


router.get('/event/:eventid/participant/:formid', ensureAuthenticated, async (req, res) => {
  let event = await Event.findById(req.params.eventid);
  let form = await Form.find({
    ownedBy: event._id,
    _id: req.params.formid
  })
  console.log(form)
  res.send(form)
})

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/admin/login');
});

module.exports = router;
