import { Axios } from "axios";

const assetGenerationService = new Axios({
  baseURL: process.env.ASSET_GENERATION_SERVICE_BASE_URL,
  timeout: 600000, // 10 minutes
  headers: {
    "Content-Type": "text/plain",
  },
});

export default assetGenerationService;
