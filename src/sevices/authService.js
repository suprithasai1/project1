// filepath: c:\Users\mps\Downloads\ReactNativeNOVO-master\src\services\authService.js
export const sendOTP = (email) => {
  // ...your implementation...
};

const email = 'konduru075@gmail.com'; // Replace with the email address
sendOTP(email)
  .then(response => console.log('OTP sent:', response))
  .catch(error => console.error('Error:', error));