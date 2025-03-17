export const sendVerificationEmail = async (email: string, token: string) => {
  const { sendMail } = useNodeMailer();
  const baseUrl = useRuntimeConfig().BASE_URL || "http://localhost:3000";
  const verificationLink = `${baseUrl}/api/auth/verify?token=${token}`;

  await sendMail({
    to: email,
    subject: "Confirm your registration",
    html: `
      <h1>Confirm your email</h1>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">Verify Email</a>
    `,
  });
};
