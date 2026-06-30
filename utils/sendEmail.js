const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // If SMTP credentials are provided, use them. Otherwise, log to console.
    if (process.env.SMTP_HOST && process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        console.log('Attempting to send email via SMTP...');
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Force Gmail service for better compatibility
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });

        const message = {
            from: `${process.env.FROM_NAME || 'ProNet'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html
        };

        const info = await transporter.sendMail(message);
        console.log('Message sent: %s', info.messageId);
    } else {
        // Development Mode: Log to console
        console.log('\n=============================================================');
        console.log('EMAIL NOT SENT (Missing SMTP Credentials in .env)');
        console.log('To: ', options.email);
        console.log('Subject: ', options.subject);
        console.log('Message: \n', options.message);
        console.log('=============================================================\n');
    }
};

module.exports = sendEmail;
