import { z } from "zod";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .trim()
      .nonempty("Имя не может быть пустым")
      .min(3, "Имя может быть минимум из 3 букв")
      .default(""),
    email: z
      .string()
      .trim()
      .email("Почта пуста или введена некорректно")
      .refine(
        (value) => {
          return /@(gmail\.com|yahoo\.com|outlook\.com|icloud\.com|hotmail\.com)$/.test(
            value
          );
        },
        {
          message: "Почта на указанном домене запрещена",
        }
      )
      .default(""),
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
    confirmPassword: z.string().trim().nonempty("Пароль не может быть пустым").default("Passwords do not match"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароль не совпадает",
    path: ["confirmPassword"],
  });

type registerShemaType = z.output<typeof registerSchema>;


export { registerSchema, type registerShemaType };