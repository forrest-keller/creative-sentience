import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import routes from "./routes";

const PORT = process.env.PORT || 8080;
const rateLimiter = rateLimit({
  windowMs: 600000, // 10 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// Initialize app
const app = express();

// Middleware
app.use(rateLimiter);
app.use(express.json());
app.use(routes);

// Start server
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
