import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Почта пуста или введена некорректно").default(""),

  password: z
    .string()
    .trim()
    .min(8, "Пароль должен быть минимум 8 символов")
    .default(""),
});

type loginShemaType = z.output<typeof loginSchema>;

export { loginSchema, type loginShemaType };
