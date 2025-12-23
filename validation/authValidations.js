const { z } = require("zod");

exports.signupSchema = z.object({
  email: z.string().trim().email("invalid email address"),
  password: z.string().min(6, "password must be at least 6 charcaters"),
  name: z.string().min(1),
});

exports.loginSchema = z.object({
  email: z.string().email("Invalid email entered"),
  password: z.string().min(6, "passowrd must be at least 6 charcaters"),
});
