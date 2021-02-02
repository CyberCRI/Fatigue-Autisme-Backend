const mailer = require('nodemailer-promise');

const sendEmail = mailer.config({
    host: 'smtp.gmail.com',
    secure: true,
    auth:{
        user: 'eddy.gangloff@gmail.com',
        pass: '@#P1gou183#@'
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});

module.exports = {
    verifyEmail: function (recipient, firstName, token, password = null) {
        text = 'Hi ' + firstName + ',\n '
            + 'Thanks for getting started with SW Display! \n'
        if(password !== null){
            text += 'Your password is: ' + password + '\n'
        }
        text += 'Click below to confirm your email address: \n'
            + process.env.FRONTEND_URL + '/signup/verify-email/' + token + '\n'
            + 'If you have problems, please paste the above URL into your web browser. \n'
            + 'Thanks, \n'
            + 'SW Display Support'
        html = '<p>Hi ' + firstName + '</p>' +
            '<p>Thanks for getting started with SW Display!<br>'
        if(password !== null){
            html += '<p>Your password is: ' + password + '</p>'
        }
        html += '<p>Click below to confirm your email address: ' +
            process.env.FRONTEND_URL + '/signup/verify-email/' + token + '</p>' +
            '<p>If you have problems, please paste the above URL into your web browser. </p>' +
            'Thanks,<br>' +
            'SW Display Support'
        var message = {
            from: 'contact@saiyanweb.com',
            to: recipient,
            cc: 'eddy.gangloff@gmail.com',
            subject: 'SW Display - Verify your account',
            text: text,
            html: html
        };

        sendEmail(message)
            .then(function(info){console.log(info)})
            .catch(function(err){console.log('got error'); console.log(err)});
    },
    passwordForgot: function (recipient, firstName, token) {
        text = 'Hi ' + firstName + ',\n '
        text += 'Click below to change your password: \n'
            + process.env.FRONTEND_URL + '/password/reset/' + token + '\n'
            + 'If you have didn\'t ask for this, just ignore this message. \n'
            + 'Thanks, \n'
            + 'SW Display Support'
        html = '<p>Hi ' + firstName + '</p>'
        html += '<p>Click below to change your password: ' +
            process.env.FRONTEND_URL + '/password/reset/' + token + '</p>' +
            "<p>If you have didn't ask for this, just ignore this message.</p>" +
            'Thanks,<br>' +
            'SW Display Support'
        var message = {
            from: 'contact@saiyanweb.com',
            to: recipient,
            cc: 'eddy.gangloff@gmail.com',
            subject: 'SW Display - Reset your password',
            text: text,
            html: html
        };

        sendEmail(message)
            .then(function(info){console.log(info)})
            .catch(function(err){console.log('got error'); console.log(err)});
    },
}
