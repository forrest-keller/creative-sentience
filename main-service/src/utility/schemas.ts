import * as yup from "yup";

export const promptSchema = yup.object({
  text: yup.string().required(),
  weight: yup.number().min(0).max(1).required(),
});

export const resolutionSchema = yup.object({
  height: yup.number().min(50).required(),
  width: yup.number().min(50).required(),
});

export const generateRequestSchema = yup.object({
  prompts: yup.array(promptSchema).min(1).required(),
  resolution: resolutionSchema.required(),
  cycles: yup.number().min(200).max(400).required(),
});
