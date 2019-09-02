const express = require('express')
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const path = require('path')
const url = require('url')

const Event = require('../models/event');
const Form = require('../models/form');
//config
cloudinary.config({
cloud_name: "dehaxoyib",
api_key: "233736366418122",
api_secret: "ANxDob0czASidExcr-TEkllizY4"
});

const storage = cloudinaryStorage({
    cloudinary,
    folder: "APTINAS",
    allowedFormats: ["jpg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }]
});
const parser = multer({ storage: storage });

function put(t){
  console.log(t)
}

//render upload page
router.get('/:eventid',async function(req,res){
	var q = url.parse(req.url,true);

  //find user 
  let event = await Event.findById(req.params.eventid);
  let userData = await Form.find({
    ownedBy: event._id,
    _id: q.query.user
  })
  put(userData[0])
  put(userData[0]._id)
  put(userData[0].ownedBy)
  res.render('upload',{  userURL : `/userupload/upload/${userData[0].ownedBy}/?user=${userData[0]._id}` })
})

//upload a image
router.post('/upload/:eventid', parser.single("bukti"), async (req, res) => {

  var q = url.parse(req.url,true);
  let event = await Event.findById(req.params.eventid);
  let userData = await Form.find({
    ownedBy: event._id,
    _id: q.query.user
  })
  console.log(q.query.user)
  put(userData)
  const image = {};
  image.url = req.file.url;
  image.id = req.file.public_id;
  let form = await Form.findById(q.query.user)
  form.data.PembayaranURL = image.url
  form.save().then((result)=>{
    console.log(result)
    res.render('sucessupload')
  }).catch(err=>{
    console.log(err)
    res.status(400).json({msg:"Something Error while upload image"})
  })

 //  //connect database
 //  MongoClient.connect(uri,{ useNewUrlParser: true }, async function(err,client){
	// 	const  database =  client.db('HMPSM');
	// 	const  collection = await  database.collection('Data1');
	// 	const obj = new ObjectID(q.query.user)
	// 	const searchID = {'_id' : obj};
	// 	const imgURL = {$set : {'bukti' : image.url , 'countDate' : '0' }}
	// 	var temp = await collection.findOne(searchID);
	// 	console.log(temp)
	// 	collection.findOneAndUpdate(searchID,imgURL);
	// 	temp = await collection.findOne(searchID);
	// 	console.log(temp)

	// });
});

//done
// router.get('/done',function(req,res){
//   res.render('upload');

// })

module.exports = router;