const nodeMailer = require('nodemailer')
const sendEmail = async(options) => {
  const transporter = nodeMailer.createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    service: 'gmail',
    auth: {
        user: 'adityaloveother007@gmail.com',
        pass:'rwoqzkpiqfvfxlgh'   
    }
  })

  const mailOption = {
    from: 'adityaloveother007@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message
  }

  await transporter.sendMail(mailOption)
}

module.exports = sendEmail;