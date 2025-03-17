import prisma from "~/lib/prisma";

export default defineEventHandler(() => {
  const { sendMail } = useNodeMailer();
  

  return sendMail({
    subject: "Registration",
    text: "You are registered",
    to: "vlad.ovtcinnikov4@gmail.com",
  });
});
