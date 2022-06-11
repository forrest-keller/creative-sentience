import { Router } from "express";
import * as yup from "yup";
import { v4 as uuid } from "uuid";
import assetGenerationService from "../utility/asset-generation-service";
import { generateRequestSchema } from "../utility/schemas";
import rateLimit from "express-rate-limit";

const router = Router();

const statuses: { [key: string]: "failed" | "processing" | "complete" } = {};

const rateLimiter = rateLimit({
  windowMs: 600000, // 10 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", rateLimiter, async (req, res, next) => {
  try {
    const body = await generateRequestSchema.validate(req.body);
    const id = uuid();
    const promptString = body.prompts
      .map(({ text, weight }) => `${text}:${weight}`)
      .join(" | ");
    const params = `-o assets/${id}.jpg -s ${body.resolution.width} ${body.resolution.height} -i ${body.cycles} -p "${promptString}"`;

    res.status(201).send(id);

    try {
      statuses[id] = "processing";
      await assetGenerationService.post("/run-generate", params);
      statuses[id] = "complete";
    } catch (e) {
      statuses[id] = "failed";
    }
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      return res.status(400).send({ name: e.name, message: e.message });
    }

    next(e);
  }
});

router.get("/:id/status", (req, res, next) => {
  try {
    const id = req.params.id;

    if (!statuses[id]) {
      return res.sendStatus(404);
    }

    return res.send({
      id,
      status: statuses[id],
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:id/asset", (req, res, next) => {
  try {
    const id = req.params.id;
    return res.sendFile(`/app/assets/${id}.jpg`);
  } catch (e) {
    next(e);
  }
});

export default router;
