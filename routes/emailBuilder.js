var SibApiV3Sdk = require('@getbrevo/brevo');
const OTP = require('../database/models/otp');
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.KEY;


// var otp=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
function storeOTP(email, otp) {
  const newOTP = new OTP({
    email,
    otp,
  });

  newOTP
    .save()
    .then(() => {
      console.log('OTP stored successfully');
    })
    .catch((error) => {
      console.error('Error storing OTP:', error);
    });
}

const MailSender=async (req,res)=>{
  var otp=Math.floor(100000 + Math.random() * 900000).toString();


    var useremail=req.body.email;
    storeOTP(useremail, otp);
    new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(
{
    'subject':'OTP Verification - TheVolint',
    'sender' : {'email':'tempvolint@gmail.com', 'name':'TheVolint'},
    'replyTo' : {'email':useremail},
    'to' : [{ 'email':useremail}],
    'htmlContent' : '<html><body><h1>Please enter your verification code in your Volint website when prompted. This code will expire after 10 minutes . {{params.bodyMessage}}</h1></body></html>',
    'params' : {'bodyMessage':otp}
}

    ).then(function(data) {
        console.log(data);
        res.status(200).json({
          success: true,
          message:" email sent on otp "})
     
      }, function(error) {
      console.error('Error:', error);
      res.json({ success: false, message: 'Failed to send OTP.' });  });

    }

    module.exports=MailSender;