const nodemailer = require("nodemailer");

exports.sendForgottenPassword = async function (toaacount, name, newPass) {
  const html = `<div style="width: 700px"><div style="background-colo:rgb(34, 197, 94);width:100%;height:50px;"><h1 style="color:white">SkillMentor</h1></div><div style="width=100%;background-color:white;"><a style="color:black;">Estimado ${name}, recibimos una petición de restablecimiento de tu contraseña adjunta al mail ${toaacount}. Tu contraseña temporal es ${newPass}, por favor ingresa y restablecela. Si no pediste el recupero de mail por favor omite este mail.</a></div></div>`;
  console.log(html);
  sendMail(toaacount, "Recupero de contraseña SkillMentor", html);
};

const sendMail = (toaacount, subject, body) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: "igcesarani@gmail.com",
      pass: "haka cpwq gasc rnsy"
    }
  });

  // Function to send email
  // Email options
  const mailOptions = {
    from: "sender@server.com",
    to: toaacount, // List of recipients
    subject: subject, // Subject line
    html: body // Plain text body
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
