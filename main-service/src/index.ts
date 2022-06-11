import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import routes from "./routes";

const PORT = process.env.PORT || 8080;

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(routes);

// Start server
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
