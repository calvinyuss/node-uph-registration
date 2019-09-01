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

function paymentMail(data){
    const email = data.email;
	//isi dari email
	const messageOption = {
		from : myEmail,
		to : email,
		subject : "noreply.hmfik@gmail.com",
		html : emailBody(data)
	}

	//send email
	transporter.sendMail(messageOption)
}



//WEBMAIL HTML
function emailBody(data){
    var name = data.nama;
	var price = data.price;
	var uploadLink = "https://testkaye.herokuapp.com/userupload/?user="+userID;
	var uploadLinkBackup = "https://testkaye.herokuapp.com/userupload/upload/?user="+userID;
	
	return `
			<div>
	<center>
	<h1>HELLO ${name} </h1>
	<h2>Waiting for payment</h2>
	<h3>Please finish your payment under 24 hour </h3>
	<br>
	<h3>Your fee Rp ${price}</h3>
	<h3>Upload bukti pembayaran</h3>
	<form action="${uploadLink}" method="POST">
		<input type="file" name="buktiBayar">
		<input type="submit">
	</form>
	<h2>Jika tidak bisa klik link berikut</h2>
	<h2><a href="${uploadLinkBackup}">LINK</a></h2>
	</center>
</div>
	`
}



module.exports = {
    paymentMail
}

