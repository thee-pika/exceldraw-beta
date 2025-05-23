import z from "zod";

export const SignUpSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const CreateRoomSchema = z.object({
  slug: z.string(),
});
