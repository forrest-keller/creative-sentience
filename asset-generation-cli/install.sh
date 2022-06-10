#!/bin/bash 

# Install dependencies
conda create -n asset-generation-cli pip python=3.7;
conda activate asset-generation-cli;
pip install torch torchvision torchaudio;
pip install ftfy regex tqdm omegaconf pytorch-lightning ipython kornia imageio imageio-ffmpeg einops torch-optimizer;

# Download external dependencies
git clone 'https://github.com/openai/CLIP';
git clone 'https://github.com/CompVis/taming-transformers';

# Download models
mkdir -p checkpoints;
curl -L -k -o checkpoints/vqgan_imagenet_f16_16384.yaml -C - 'https://heibox.uni-heidelberg.de/d/a7530b09fed84f80a887/files/?p=%2Fconfigs%2Fmodel.yaml&dl=1';
curl -L -k -o checkpoints/vqgan_imagenet_f16_16384.ckpt -C - 'https://heibox.uni-heidelberg.de/d/a7530b09fed84f80a887/files/?p=%2Fckpts%2Flast.ckpt&dl=1';