const express = require('express');
const router = express.Router();
const passport = require('passport');
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
    price: req.body.createPrice,
    seat: req.body.createSeat,
    formSchema: [
      { inputType: 'text', label: "Name" },
      { inputType: 'email', label: "Email" },
      { inputType: 'number', label: "Student ID" }
    ]
  })
  await newEvent.save().then(() => {
    req.flash('success_msg', 'Event Created');
    res.redirect('/admin/dashboard');
  }).catch(err => {
    console.log(err);
    res.redirect('/admin/event/create')
  })
})


//edit event
router.get('/event/edit/:id', async (req, res) => {
  let event = await Event.findById(req.params.id);
  res.render('edit_event', {
    event: event
  })
})

router.put('/event/edit/:id', async (req, res) => {
  let event = await Event.findById(req.params.id);
  if (req.body["type"] === "formSchema") {
    for (let schema of event.formSchema) {
      if (schema._id == req.body._id) {
        schema.inputType = req.body.inputType
        schema.label = req.body.label

        console.log(event.formSchema)
        event.save().then(res => {
          console.log(res)
          return
        }).catch(err => console.log(err))
      }
    }
  }
})


router.post('/event/edit/:id', ensureAuthenticated, async (req, res) => {
  let event = await Event.findById(req.params.id);
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
router.get('/event/preview/:id', ensureAuthenticated, async (req, res) => {
  res.render('form')
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
