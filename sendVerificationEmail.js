
const mailgun = require('mailgun-js');
const generateVerificationCode = require('./generateVerificationCode');
const EmailVerification = require('./emailModel');

const domain = process.env.DOMAIN;
const mg = mailgun({apiKey: process.env.APIKEY, domain: domain});
const port = 443;


exports.sendVerificationEmail = async (message, context) => {
    const pubsubMessage = message.data ? Buffer.from(message.data, 'base64').toString() : null;
    if(!pubsubMessage) 
    {
        console.log(message);
        console.log(pubsubMessage);
    }


    const userData = JSON.parse(pubsubMessage);
    const expirationTime = new Date(Date.now() + 2 * 60000);
    const userEmail = userData.email;
    const verification_code = generateVerificationCode();
    const verificationLink = `https://${domain}:${port}/verify?code=${verification_code}`; 

    const emailData = {

        from: 'Your App <mailgun@deepaksundar.me>',
        to: userEmail,
        subject: 'Verify Your Email',
        html: `<p>Please verify your email by copying and pasting the following URL into your browser:</p><p>${verificationLink}</p>`,
    }

    mg.messages().send(emailData, async function (error, body) {
        if(error)
        {
            console.error(`Failed to send verification email to ${userEmail}:`, error);
        }
        else
        {
            console.log(`Verification email sent to ${userEmail}`, body);
            console.log(verification_code);
            console.log(expirationTime);
            try
            {
                await EmailVerification.create({
                    user_email: userEmail,
                    verification_code: verification_code,
                    sent_at: new Date(),
                    expiration_time: new Date(Date.now() + 2 * 60000),
                    status: 'sent'
                });
                console.log('Email verification record created successfully');
            }
            catch(dbError)
            {
                console.error('Failed to create email verification record:', dbError);
            }
            }
        }
    );
};