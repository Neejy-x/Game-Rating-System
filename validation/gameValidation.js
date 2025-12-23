const { z } = require("zod");

const createGameSchema = z.object({
  title: z
    .string()
    .min(2, "The game title must be at least two characters")
    .max(100),
  platforms: z.array(z.enum(["PS5", "MOBILE", "XBOX", "SWITCH", "PC"])),
});

//optionalise the createGameSchema
const updateGameSchema = createGameSchema.partial();

module.exports = { createGameSchema, updateGameSchema };
