//sebuah module
const nodemailer = require('nodemailer');
//username and password
const myEmail = process.env.EMAIL;
const password = process.env.EMAIL_PASS;
const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
	type: "OAuth2",
	user: "noreply.hmfikuphmc@gmail.com",
	clientId: "78105210370-3o7vafne9hhgamvms041hljrhptsivb1.apps.googleusercontent.com",
	clientSecret: "xAKgYvzvUvAahc_zq4srVXjx",
	refreshToken: "1/HYhg-0GaekP71slYEA_7MCvzIzfKP9A9hb7etSybs5o",
	accessToken: "ya29.GltYB0PUjLEj6074xn5BCy6rYniqQqpCp6jy52FsXWk1ri3acFintrHgJYSV2rxxRZVBPTdzR0H_sT8ZoReUYd2HAG4UYIMRmTOXsBCB6c_QSX7sI9NkhetqEV8N"
	}
});

const Form_SP = require('./FormStatus_Payment')
const Form_SAc = require('./FormStatus_Accepted')
const Form_SR = require('./FormStatus_Rejected')
const Form_SAp = require('./FormStatus_Approval')

function Send_FSP(data){
    const email = data.data.Email;
	//isi dari email
	const messageOption = {
		from : myEmail,
		to : email,
		subject : "noreply.hmfikuphmc@gmail.com",
		html : Form_SP.FSP(data)
	}

	//send email
	transporter.sendMail(messageOption)
}

function Send_FSAc(data){
    const email = data.Email;
	//isi dari email
	const messageOption = {
		from : myEmail,
		to : email,
		subject : "noreply.hmfik@gmail.com",
		html : Form_SAc.FSAc(data)
	}

	//send email
	transporter.sendMail(messageOption)
}

function Send_FSAp(data){
    const email = data.Email;
	//isi dari email
	const messageOption = {
		from : myEmail,
		to : email,
		subject : "noreply.hmfik@gmail.com",
		html : Form_SAp.FSAp(data)
	}

	//send email
	transporter.sendMail(messageOption)
}

function Send_FSR(data){
    const email = data.Email;
	//isi dari email
	const messageOption = {
		from : myEmail,
		to : email,
		subject : "noreply.hmfik@gmail.com",
		html : Form_SR.FSR(data)
	}

	//send email
	transporter.sendMail(messageOption)
}


module.exports = {
    Send_FSP,
    Send_FSR,
    Send_FSAp,
    Send_FSAc
}

