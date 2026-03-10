import "./config/env.js";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";

export const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Scenely API is running");
});

const PORT = process.env.PORT || 5000;
const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

export default app;
