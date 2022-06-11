import { Router } from "express";
import * as yup from "yup";
import { v4 as uuid } from "uuid";
import assetGenerationService from "../utility/asset-generation-service";
import { generateRequestSchema } from "../utility/schemas";
import fs from "fs";

const router = Router();

const failedIds: string[] = [];

router.post("/", async (req, res) => {
  try {
    const body = await generateRequestSchema.validate(req.body);
    const id = uuid();
    const promptString = body.prompts
      .map(({ text, weight }) => `${text}:${weight}`)
      .join(" | ");
    const params = `-o assets/${id}.jpg -s ${body.resolution.width} ${body.resolution.height} -i ${body.cycles} -p "${promptString}"`;

    res.status(201).send(id);

    try {
      await assetGenerationService.post("/run-generate", params);
    } catch (e) {
      failedIds.push(id);
      console.log(failedIds);
    }
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      res.status(400).send({ name: e.name, message: e.message });
    }
  }
});

router.get("/:id/status", (req, res) => {
  const id = req.params.id;
  const fileExists = fs.existsSync(`assets/${id}.jpg`);
  const status = failedIds.includes(id)
    ? "fail"
    : fileExists
    ? "success"
    : "procesing";

  res.send({
    id,
    status,
    filePath: "unimplemented",
  });
});

router.get("/:id/asset", (req, res) => {
  const id = req.params.id;
  res.sendFile(`assets/${id}.jpg`);
});

export default router;
