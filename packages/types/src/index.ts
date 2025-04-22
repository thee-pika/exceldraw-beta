import z from "zod";

export const SignUpSchema = z.object({
    username: z.string(), 
    email: z.string().email(),
    password: z.string().min(6).max(12)
})

export const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(12)
})

