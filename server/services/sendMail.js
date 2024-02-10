const Mailjet = require("node-mailjet");
const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

/**
 * sends message to user email
 * @param {the email of the user} userEmail
 * @param {the user's name} userName
 * @param {string the message to send to user} message
 */

const sendMail = (userEmail, userName, message) => {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "bowaleadetunji@gmail.com",
          Name: "lifePlusAOB team",
        },
        To: [
          {
            Email: userEmail,
            Name: userName,
          },
        ],
        Subject: "Password reset Request",
        HTMLPart: `<h3>Dear ${userName}</h3> <br>
             <p>you just requested for your password to be changed. kindly click the following link</p> <br>  
            <strong><a href="${message}">reset password</a></strong>
              to reset password. link is active for 30mins and can only be used once.
               <br><br> Best Regards <br> <br> ignore if you didnt request this email <br><br> lifePlusAOB team`,
      },
    ],
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
};

module.exports = {
  sendMail,
};
