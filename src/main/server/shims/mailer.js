const nodemailer = require("nodemailer");

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT || 587;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const recipients = process.env.SMTP_RECIPIENTS;

let transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user: user,
      pass: pass,
    },
});

let sendMail = async function(from, subject, text, html) {
    if (host && user && pass && recipients) {
        try {
            await transporter.sendMail({
                from: from, // sender address
                to: recipients, // list of receivers
                subject: subject, // Subject line
                text: text, // plain text body
                html: html, // html body
            });
        } catch (e) {
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, "CassMailerError", e);
        }
    } else {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.WARNING, "CassMailerConfig", "Mailer is not configured.");
    }
}

module.exports = {
    sendMail
}