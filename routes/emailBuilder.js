var SibApiV3Sdk = require('@getbrevo/brevo');
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.KEY;


// var otp=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

var otp=Math.round(Math.random()*100000);

const MailSender=async (req,res)=>{

    var useremail=req.body.email;
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
          data :{code:otp},
          message:" email sent on otp "})
     
      }, function(error) {
        console.error(error);
        res.status(400).json({message:"email otp verification service not working"})
      });

    }

    module.exports=MailSender;