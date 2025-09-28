import { z } from "zod";
import express from "express";
//import { error } from "console";

//initializing and startup
const app = express();
app.use(express.json());
const PORT = 3000;

//all the different zod schemas
//define a schema for a "username"
const user = {
    name: "Ida",
    age: 48
};

//schema for POST user
const userSchema = z.object({
    name: z.string().min(3).max(12),
    age: z
        .number()
        .min(18)
        .max(100)
        .optional()
        .default(28),
    email: z.email().toLowerCase(),   //want email to be all lowercase
});

//schema for random user API
const randomUserResponsSchema = z.object({
    results: z.array(
        z.object({
            name: z.object({
                first: z.string(),
                last: z.string(),
            }),
            location: z.object({
                country: z.string(),
            }),
        }),
    ),
});

//Phase 1 — Minimal server & ping
app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

//Phase 2 — Fetch random person
app.get("/random-user", async (req, res) => {
try {
    const response = await fetch("https://randomuser.me/api");
    const data = await response.json();

    const validatedRandomUser = randomUserResponsSchema.safeParse(data);
    if (!validatedRandomUser.success) {
        return res.status(500).json({
            error: "Invalid data from Random user API",
            details: validatedRandomUser.error
        });
    }
    const randomUser = validatedRandomUser.data.results[0];
    res.json({
        name: `${randomUser?.name.first} ${randomUser?.name.last}`,
        country: randomUser?.location.country,
    })
} catch (error) {
    res.status(500).json({
        error: "Failed to fetch random user",
    });
}
});

const validatedUser = userSchema.safeParse(user);

if (!validatedUser.success) {
    console.error(validatedUser.error);
} else {
    console.log(validatedUser.data);
};

//Phase 3 — User POST route
app.post("/users", (req, res) => {
    const validatedNewUser = userSchema.safeParse(req.body);
    if (!validatedNewUser.success) {
        return res.status(400).json({
            error: "Invalid user data",
            details: validatedNewUser.error,
        });
        //console.error(validatedNewUser.error);
    } else {
        res.status(201).json({ user: validatedNewUser });
}
});

//start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
