import emailjs from "emailjs-com";

const sendOTPEmail = (email, otp) => {
  return emailjs.send(
    "YOUR_SERVICE_ID",
    "YOUR_TEMPLATE_ID",
    { to_email: email, otp },
    "YOUR_USER_ID"
  );
};

export default sendOTPEmail;