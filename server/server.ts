
import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

// GET /ping endpoint
app.get('/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
