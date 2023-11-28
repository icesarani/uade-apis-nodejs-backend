const nodemailer = require("nodemailer");

exports.sendNewComment = async function (
  toaccount,
  namementor,
  namecommenter,
  servicename,
  comment
) {
  const html = `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
    <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #22c55e;">¡Hola ${namementor}!</h2>
      <p style="color: #333;">Te queríamos informar que ${namecommenter} ha realizado un comentario en tu publicación ${servicename}. Aquí está el comentario:</p>
      <div style="font-style: italic; border-left: 4px solid #22c55e; padding-left: 15px;">
        <p style="margin: 0;">"${comment}"</p>
      </div>
      <p style="color: #333;">¡Gracias!</p>
    </div>
  </body>`;

  console.log(html);

  sendMail(toaccount, "Nuevo commentario en " + servicename, html);
};

exports.sendForgottenPassword = async function (toaacount, name, newPass) {
  const html = `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
  <div style="width: 700px; font-family: Arial, sans-serif;">
  <div style="background-color: #22c55e; width: 100%; height: 50px; display: flex; justify-content: center; align-items: center;">
    <h1 style="color: white;">SkillMentor</h1>
  </div>
  <div style="width: 100%; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <p style="color: #333; font-size: 16px; line-height: 1.6;">
      Estimado <span style="color: #22c55e;">${name}</span>, recibimos una petición de restablecimiento de tu contraseña adjunta al mail <span style="color: #22c55e;">${toaacount}</span>. Tu contraseña temporal es <span style="color: #22c55e;">${newPass}</span>, por favor ingresa y restablecela. Si no pediste el recupero de mail por favor omite este mail.
    </p>
  </div>
</div>
</body>
`;
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
