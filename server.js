var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var helper = require('sendgrid').mail;
var pdf = require('html-pdf');
var fs = require('fs');


var app = express();

app.use(bodyParser.json());

app.post('/email/simple',function(req,res){

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.gmail_id,
            pass: process.env.gmail_password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: process.env.gmail_id, // sender address
        to: process.env.to_email, // list of receivers
        subject: 'Simple Mail', // Subject line
        html: req.body.page // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
            res.end();
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        res.end();
    });

});

app.post('/email/sendgrid',function(req,res){

    var data = {
        fromEmail:process.env.gmail_id,
        toEmail:process.env.to_email,
        subject : "Sending with SendGrid is Fun",
        content : req.body.page
    }

    sendGridMailer(data,res);
});


app.post('/email/attachment',function(req,res){

    var data = {
        fromEmail:process.env.gmail_id,
        toEmail:process.env.to_email,
        subject : "Sending with SendGrid is Fun",
        content : "Please see the attached page"
    }


    pdf.create(req.body.page,{ format: 'Letter' }).toBuffer(function(err,buffer){
        if (err) {res.end(); return console.log(err);};
        data.attachment = {
            content : buffer.toString('base64'),
            type : 'application/pdf',
            name : 'HackerNews.pdf'
        }
        sendGridMailer(data,res);
    });

});


var sendGridMailer = function(data,res){

    from_email = new helper.Email(data.fromEmail);
    to_email = new helper.Email(data.toEmail);
    subject = data.subject;
    content = new helper.Content("text/html", data.content);
    mail = new helper.Mail(from_email, subject, to_email, content);

    if(data.attachment){
      attachment = new helper.Attachment();
      attachment.setContent(data.attachment.content);
      attachment.setType(data.attachment.type);
      attachment.setFilename(data.attachment.name);
      attachment.setDisposition("attachment");
      mail.addAttachment(attachment)
    }

    var sendGridId = process.env.send_grid_key;

    var sg = require('sendgrid')(sendGridId);
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });

    sg.API(request, function(error, response) {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
      res.end();
    });
};


app.use('/static', express.static(path.join(__dirname, 'dist')));

var server = app.listen(8880,function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log("Server listening at http://%s:%s", host, port);
});
