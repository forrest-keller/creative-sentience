import { Router } from "express";
import * as yup from "yup";
import { v4 as uuid } from "uuid";
import assetGenerationService from "../utility/asset-generation-service";
import { generateRequestSchema } from "../utility/schemas";
import rateLimit from "express-rate-limit";
import { Storage } from "@google-cloud/storage";

const router = Router();

const statuses: { [key: string]: "failed" | "processing" | "complete" } = {}; // TODO: Replace with database

const rateLimiter = rateLimit({
  windowMs: 600000,
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

    res.status(201).send({ id });

    try {
      statuses[id] = "processing"; // TODO: Replace with database
      await assetGenerationService.post("/generate-asset", {
        id,
        height: body.resolution.height,
        width: body.resolution.width,
        cycles: body.cycles,
        prompt_string: promptString,
      });
      statuses[id] = "complete"; // TODO: Replace with database
    } catch (e) {
      statuses[id] = "failed"; // TODO: Replace with database
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
      // TODO: Replace with database
      return res.sendStatus(404);
    }

    return res.send({
      id,
      status: statuses[id], // TODO: Replace with database
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:id/asset", async (req, res, next) => {
  try {
    const storage = new Storage();
    const bucketName = process.env.ASSET_BUCKET_NAME;

    if (bucketName === undefined) {
      throw new Error();
    }

    const assetBucket = storage.bucket(bucketName);
    const fileName = `${req.params.id}.jpg`;
    const data = await assetBucket.file(fileName).download();
    res.contentType("image/jpeg").send(data[0]);
  } catch (e) {
    next(e);
  }
});

export default router;
