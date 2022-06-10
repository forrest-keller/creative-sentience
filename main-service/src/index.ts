import { Axios } from "axios";
import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import * as yup from "yup";
import { v4 as uuid } from "uuid";

const PORT = process.env.PORT || 8080;
const rateLimiter = rateLimit({
  windowMs: 600000, // 10 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// Axios wrappers for services
const assetGenerationService = new Axios({
  baseURL: process.env.ASSET_GENERATION_SERVICE_BASE_URL,
  timeout: 600000, // 10 minutes
  headers: {
    "Content-Type": "text/plain",
  },
});

// Initialize app
const app = express();

// Middleware
app.use(rateLimiter);
app.use(express.json());

// Routes
app.post("/generated-images", async (req, res) => {
  const promptSchema = yup.object({
    text: yup.string().required(),
    weight: yup.number().min(0).max(1).required(),
  });
  const resolutionSchema = yup.object({
    height: yup.number().min(50).max(500).required(),
    width: yup.number().min(50).max(500).required(),
  });
  const reqBodySchema = yup.object({
    prompts: yup.array(promptSchema).min(1).required(),
    resolution: resolutionSchema.required(),
    cycles: yup.number().min(0).max(100).required(),
  });

  // Validate input
  try {
    const body = await reqBodySchema.validate(req.body);

    // Make request
    try {
      const id = uuid();
      const promptString = body.prompts
        .map(({ text, weight }) => `${text}:${weight}`)
        .join(" | ");
      const params = `-o assets/${id}.jpg -s ${body.resolution.width} ${body.resolution.height} -i ${body.cycles} -p "${promptString}"`;

      // Trigger generation, don't wait
      await assetGenerationService.post("/run-generate", params);

      res.send(id);
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      res.status(400).send({ name: e.name, message: e.message });
    }
  }
});

app.get("/generated-images/:imageId", async (_req, res) => {
  // TODO: See if file with id is in volume
  res.send("");
});

// Start server
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
