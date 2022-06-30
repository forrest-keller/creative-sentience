import "dotenv/config";
import express from "express";
import routes from "./routes";
import cors from "cors";

const PORT = process.env.PORT;

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use(routes);

// Start server
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
