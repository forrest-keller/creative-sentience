# Download dependency repositories 
git clone 'https://github.com/openai/CLIP' src/generate/CLIP

# Download models
mkdir src/generate/checkpoints;
curl -L -o src/generate/checkpoints/vqgan_imagenet_f16_16384.yaml -C - 'https://heibox.uni-heidelberg.de/d/a7530b09fed84f80a887/files/?p=%2Fconfigs%2Fmodel.yaml&dl=1';
curl -L -o src/generate/checkpoints/vqgan_imagenet_f16_16384.ckpt -C - 'https://heibox.uni-heidelberg.de/d/a7530b09fed84f80a887/files/?p=%2Fckpts%2Flast.ckpt&dl=1';

# Install dependency packages
conda update -n base conda;
conda create -n asset-generation-service pip python=3.7;
conda run -n asset-generation-service pip install torch torchvision torchaudio;
conda run -n asset-generation-service pip install ftfy regex tqdm omegaconf pytorch-lightning ipython kornia imageio imageio-ffmpeg einops torch-optimizer flask google-cloud-storage python-dotenv taming-transformers;