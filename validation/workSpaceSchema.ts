import { z } from "zod";

const workSpaceSchema = z
  .object({
    workspace: z
      .string()
      .nonempty("Поле должно быть заполнено")
      .min(1, "Поле должно быть заполнено")
      .default(""),
    });

type workSpaceSchemaType = z.infer<typeof workSpaceSchema>;

export { workSpaceSchema, type workSpaceSchemaType };