import { Router } from "express";
import generationRequests from "./generation-requests";

const router = Router();

router.use("/generation-requests", generationRequests);

export default router;
