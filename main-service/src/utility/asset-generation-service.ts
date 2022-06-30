import axios from "axios";

const assetGenerationService = axios.create({
  baseURL: process.env.ASSET_GENERATION_SERVICE_BASE_URL,
  timeout: 600000,
});

export default assetGenerationService;
