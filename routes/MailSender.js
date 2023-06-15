var nodemailer = require('nodemailer');

const MailSender=async (req,res)=>{
// APi secret key = a8ad2af89db2aef2d9eb494d1ddb9cd1
  const email=req.body;
var transporter = nodemailer.createTransport({
  service: 'gmail',
  port:'587',
  auth: {
    user: 'tempvolint@gmail.com',
    pass: 'Varanasi@123'
  }
});

var mailOptions = {
  from: ' prateek   <thevolint@gmail.com>',
  to: 'sainiprateek565@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

}

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