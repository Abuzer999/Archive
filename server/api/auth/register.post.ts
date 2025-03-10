import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const { sendMail } = useNodeMailer();

  return sendMail({
    subject: "Registration",
    text: "You are registered",
    to: "vlad.ovtcinnikov1@gmail.com",
  });
});
