import { z } from "zod";

const resetPasswordSchema = z.object({
    email: z.string().nonempty("Необходимо заполнить email").email("email введен некорректно").default(""),
});

type resetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

export { resetPasswordSchema, type resetPasswordSchemaType };