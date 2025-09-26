import {z} from "zod";
import express from "express";

const app = express();
app.use(express.json());
const PORT = 3000;

//define a schema for a "username"
const user = {
    name: "Ida",
    age: 48
};

const userSchema = z.object({
    name: z.string().min(3).max(10),
    age: z
        .number()
        .min(18, {message: 'You must be an adult'})
        .max(67, {message: 'your are too old, baby...'})
        .optional()
        .default(18),
    email: z.email(),
});

const restaurantSchema = z.object({
    name: z.string(),
    menu: z.object({
        appetizers: z.array(z.string()),
        mains: z.array(z.string().min(1, "At least one dish is required")),
    }),
    openingHours: z.record(z.string(), z.array(z.string())),    //{mon: ["kl9", "kl10"]}
});

const emailSchema = z.object({
    email: z.email().toLowerCase(),   //want email to be all lowercase
});

const validatedUser = userSchema.safeParse(user);

if (!validatedUser.success) {
    console.error(validatedUser.error);
} else {
    console.log(validatedUser.data);
};

app.post("/users", (req, res) => {
    const validatedNewUser = userSchema.safeParse(req.body);
    if (!validatedNewUser.success) {
        return res.status(400).json({
            error: "Invalid usre data",
            details: validatedNewUser.error,
        });
        //console.error(validatedNewUser.error);
    } else {
        res.status(201).json({ user: validatedNewUser });
}
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
