import { z } from "zod";

const resetSchema = z
  .object({
    password: z
      .string()
      .trim()
      .nonempty("Пароль не может быть пустым")
      .min(8, "Пароль должен быть минимум 8 символов")
      .regex(/[A-Z]/, "Пароль должен содержать заглавную букву")
      .regex(/[a-z]/, "Пароль должен содержать строчную букву")
      .regex(/[0-9]/, "Пароль должен содержать цифру")
      .regex(/[\W_]/, "Пароль должен содержать особый символ")
      .default(""),
    confirmPassword: z
      .string()
      .trim()
      .nonempty("Пароль не может быть пустым")
      .default("Пароль не совпадает"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароль не совпадает",
    path: ["confirmPassword"],
  });

type resetSchemaType = z.infer<typeof resetSchema>;

export { resetSchema, type resetSchemaType };
