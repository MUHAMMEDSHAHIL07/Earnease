import otpGenerator from 'otp-generator';
import { otpModel } from '../../models/otpModel.js';
import { sendEmail } from '../../utils/sendEmail.js';

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  
  await otpModel.deleteMany({ email });

  const otp = otpGenerator.generate(6, {
    digits: true, upperCaseAlphabets: false,
    lowerCaseAlphabets: false, specialChars: false,
  });

  await otpModel.create({ email, otp });
  await sendEmail(email, otp);

  return res.status(200).json({ message: 'OTP sent' });
};
