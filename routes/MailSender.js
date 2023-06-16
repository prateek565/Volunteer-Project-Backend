var nodemailer = require('nodemailer');

const MailSender=async (req,res)=>{
{
const  transport = nodemailer.createTransport({
  host: "smtp.elasticemail.com",
  port: 2525,
  auth: {
    user: "tempvolint@gmail.com",
    pass: "E64C5E8549E36B82CF77A1AB9192380A9317"
  }
});
 
// E64C5E8549E36B82CF77A1AB9192380A9317
   let  message = `<p>Please use the below token to reset your password with the <code>/apiRouter/reset-password</code> api route:</p>
                       <p><code>1</code></p>`; // Here you can replace the message with your HTML code.
 
  const  mailOptions = {
    from: "tempvolint@gmail.com",
    to: 'sainiprateek565@gmail.com', // the user email
    subject: ' Reset your Password',
    html: `<h4>Reset Password</h4>
                   ${message}`
   };
 
 
 
   const  info = transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        res.status(200).json({message:info.messageId});
});}
}

// const MailSender=async (req,res)=>{
// // APi secret key = a8ad2af89db2aef2d9eb494d1ddb9cd1
//   const email=req.body;
// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   port:'587',
//   auth: {
//     user: 'tempvolint@gmail.com',
//     pass: 'Varanasi@123'
//   }
// });

// var mailOptions = {
//   from: ' prateek   <thevolint@gmail.com>',
//   to: 'sainiprateek565@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });

// }

module.exports=MailSender;

/**
 *
 * This call sends a message to one recipient.
 *
 */
//  const mailjet = require ('node-mailjet')
//  .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
// const request = mailjet
//  .post("send", {'version': 'v3.1'})
//  .request({
//    "Messages":[
//        {
//            "From": {
//                "Email": "tempvolint@gmail.com",
//                "Name": "Mailjet Pilot"
//            },
//            "To": [
//                {
//                    "Email": "sainiprateek565@gmail.com",
//                    "Name": "passenger 1"
//                }
//            ],
//            "Subject": "Your email flight plan!",
//            "TextPart": "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
//            "HTMLPart": "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
//        }
//    ]
//  })
// request
//  .then((result) => {
//    console.log(result.body)
//  })
//  .catch((err) => {
//    console.log(err.statusCode)
//  })