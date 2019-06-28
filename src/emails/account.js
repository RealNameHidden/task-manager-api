
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendWelcome=(email,name)=>{
const msg = {
  to: email,
  from: 'dheeraj.as008@task.com',
  subject: 'Welcome to TaskManager',
  text: `Welcome! ${name}, Have fun with the app!`

}
sgMail.send(msg)
}
 
module.exports=sendWelcome