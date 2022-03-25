const { getMaxListeners } = require("../app");
const nodemailer = require("nodemailer");
const formidable = require("formidable");
const cron = require("node-cron");
const moment = require("moment");
const MailTemplate = require("../models/mailTemplate");
const Mail = require("nodemailer/lib/mailer");
require("dotenv").config({ path: "./../" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USERMAIL,
    pass: process.env.USERPASSWORD,
  },
});

exports.sendMail = (req, res) => {
  let mailList = [];
  try {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err)
        res.status(400).json({
          error: error,
        });
      if (
        !fields.name ||
        !fields.email ||
        !fields.clientName ||
        !fields.clientEmail
      ) {
        res.status(400).json({
          error: "Please fill the missing Fields",
        });
      }

      let date = new Date(fields.date);
      let mins = parseInt(fields.time.split(":")[1]);
      let hrs = parseInt(fields.time.split(":")[0]);
      let month = date.getMonth() + 1;
      let day = date.getDate();

      fields.subject = fields.subject.replaceAll(
        "<ClientName>",
        String(fields.clientName)
      );
      fields.message = fields.message.replaceAll(
        "<ClientName>",
        String(fields.clientName)
      );
      fields.toEmails = fields.toEmails.replaceAll(
        "<ClientEmail>",
        fields.clientEmail
      );

      fields.subject = fields.subject.replaceAll("<Name>", String(fields.name));
      fields.message = fields.message.replaceAll("<Name>", String(fields.name));
      fields.toEmails = fields.toEmails.replaceAll(
        "<Email>",
        fields.clientEmail
      );

      mailList = fields.toEmails.split(" ");
      let mailOptions = {
        from: process.env.USERMAIL,
        to: mailList,
        subject: fields.subject,
        text: fields.message,
      };

      cron.schedule(`${mins} ${hrs} ${day} ${month} *`, () => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.status(400).json({
              error,
            });
          } else {
            console.log(info.response);
          }
        });
      });
      res.status(200).json({
        message: `Email scheduled to be sent`,
      });
    });
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
};

exports.setTemplate = async (req, res) => {
  try {
    await MailTemplate.deleteMany({});
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if (!fields.subject || !fields.message) {
        res.status(400).json({
          error: "Fill both subject and message body",
        });
      } else {
        let mailTemplate = new MailTemplate({
          date: fields.date,
          time: fields.time,
          toEmails: fields.toEmails,
          subject: fields.subject,
          message: fields.message,
        });
        mailTemplate.save((error) => {
          if (error) {
            res.status(400).json({
              error,
            });
          } else {
            res.status(201).json({
              message: "Template created successfully",
            });
          }
        });
      }
    });
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
};

exports.getTemplate = async (req, res) => {
  try {
    let mailTemplate = await MailTemplate.find({});
    res.status(200).json({
      mailTemplate,
    });
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
};
