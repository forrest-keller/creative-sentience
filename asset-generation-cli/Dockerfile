FROM  continuumio/anaconda3

WORKDIR /app
COPY . /app

# Download dependency repositories 
RUN git clone 'https://github.com/openai/CLIP' /app/CLIP
RUN git clone 'https://github.com/CompVis/taming-transformers' /app/taming-transformers

# Download models
RUN mkdir /app/checkpoints;
RUN curl -L -o /app/checkpoints/vqgan_imagenet_f16_16384.yaml -C - 'https://heibox.uni-heidelberg.de/d/a7530b09fed84f80a887/files/?p=%2Fconfigs%2Fmodel.yaml&dl=1';
RUN curl -L -o /app/checkpoints/vqgan_imagenet_f16_16384.ckpt -C - 'https://heibox.uni-heidelberg.de/d/a7530b09fed84f80a887/files/?p=%2Fckpts%2Flast.ckpt&dl=1';

# Install dependency packages
RUN conda update -n base conda;
RUN conda create -n asset-generation-cli pip python=3.7;
# RUN conda run -n asset-generation-cli pip install torch torchvision torchaudio
RUN conda run -n asset-generation-cli pip install torch==1.9.0+cu111 torchvision==0.10.0+cu111 torchaudio==0.9.0 -f https://download.pytorch.org/whl/torch_stable.html
RUN conda run -n asset-generation-cli pip install ftfy regex tqdm omegaconf pytorch-lightning ipython kornia imageio imageio-ffmpeg einops torch-optimizer

SHELL ["conda", "run", "--name", "asset-generation-cli", "/bin/bash", "-c"]
ENTRYPOINT ["conda", "run", "--name", "asset-generation-cli", "python", "main.py"]