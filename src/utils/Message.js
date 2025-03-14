function EmailMessage(name, email, message) {
  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">

    <h2 style="color: #333; text-align: center;">New Contact Message</h2>
    <p style="font-size: 16px; color: #555; text-align: center;">
      You have received a new message from <strong>${name}</strong> (<a href="mailto:${email}">${email}</a>).
    </p>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <p style="font-size: 16px; color: #333; text-align: center;">
        "${message}"
      </p>
    </div>
    <p style="font-size: 16px; color: #555; text-align: center;">
      Please respond to this message as soon as possible.
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;">
  </div>
  `;

  return html;
}

function OTPMessage(otp) {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center;">
        <img src="https://r2.erweima.ai/imgcompressed/compressed_b10c65c02342a7b502db4a7c4a6e9c40.webp" alt="Company Logo" style="width: 100px; margin-bottom: 20px;">
      </div>
      <h2 style="color: #333; text-align: center;">Password Recovery</h2>
      <p style="font-size: 16px; color: #555; text-align: center;">
        Hi there! You requested to reset your password. Your 4-digit OTP is below:
      </p>
      <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
        <p style="font-size: 30px; color: #e67e22; font-weight: bold;">${otp}</p>
      </div>
      <p style="font-size: 16px; color: #555; text-align: center;">
        This OTP is valid for <strong>5 minutes</strong> only. If you did not request this, please ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;">
    </div>
  `;
  return html;
}

function verifyAccount(otp) {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center;">
        <img src="https://r2.erweima.ai/imgcompressed/compressed_b10c65c02342a7b502db4a7c4a6e9c40.webp" alt="Company Logo" style="width: 100px; margin-bottom: 20px;">
      </div>
      <h2 style="color: #333; text-align: center;">Verify Your Account</h2>
      <p style="font-size: 16px; color: #555; text-align: center;">
        Welcome! Thank you for signing up. To complete your registration, please use the OTP below to verify your account:
      </p>
      <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
        <p style="font-size: 30px; color: #e67e22; font-weight: bold;">${otp}</p>
      </div>
      <p style="font-size: 16px; color: #555; text-align: center;">
        This OTP is valid for <strong>5 minutes</strong> only. If you did not sign up, please ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;">
    </div>
  `;
  return html;
}

function EmailMessage(name, email, message) {
  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">

    <h2 style="color: #333; text-align: center;">New Contact Message</h2>
    <p style="font-size: 16px; color: #555; text-align: center;">
      You have received a new message from <strong>${name}</strong> (<a href="mailto:${email}">${email}</a>).
    </p>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <p style="font-size: 16px; color: #333; text-align: center;">
        "${message}"
      </p>
    </div>
    <p style="font-size: 16px; color: #555; text-align: center;">
      Please respond to this message as soon as possible.
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;">
  </div>
  `;

  return html;
}

function OrderSend(name, checkproduct) {
  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">

    <h2 style="color: #333; text-align: center;"> Mr/Mrs ${name} Your order is pending.</h2>
    <p style="font-size: 16px; color: #555; text-align: center;">
      You have ordered ${checkproduct}.
    </p>
    <p style="font-size: 16px; color: #555; text-align: center;">
    We'll reach as soon as possible.
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;">
  </div>
  `;

  return html;
}

function OrderStatusChange(name, checkproduct, status) {
  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">

    <h2 style="color: #333; text-align: center;"> Mr/Mrs ${name} Your order is ${status}.</h2>
    <p style="font-size: 16px; color: #555; text-align: center;">
      You have ordered ${checkproduct}.
    </p>
    <p style="font-size: 16px; color: #555; text-align: center;">
    We'll reach as soon as possible.
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;">
  </div>
  `;

  return html;
}

module.exports = {
  EmailMessage,
  OTPMessage,
  verifyAccount,
  OrderSend,
  OrderStatusChange,
};
