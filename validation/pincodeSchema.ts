import { z } from "zod";

const pincodeSchema = z.object({
    pincode: z.array(z.string().trim().nonempty('')).length(6, 'Пинкод должен состоять из 6 цифр').default([]),
});

type pincodeSchemaType = z.output<typeof pincodeSchema>;

export { pincodeSchema, type pincodeSchemaType };