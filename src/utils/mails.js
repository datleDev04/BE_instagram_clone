import nodemailer from 'nodemailer'


let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'datltph41025@fpt.edu.vn', // Thay đổi email và mật khẩu của bạn
      pass: 'aaak ursv cuil gwym' // Thay đổi email và mật khẩu của bạn
  }
});

const sendEmail = async (to, subject, message) => {
    const info = await transporter.sendMail({
        from: '"INSTAGRAM👻" <datltph41025@fpt.edu.vn>',
        to, // list of receivers
        subject, // Subject line
        html: message, // html body
    })
    return info
}

export default sendEmail