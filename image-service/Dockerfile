FROM  continuumio/anaconda3

WORKDIR /app
COPY . /app

# RUN apt-get install -y --no-install-recommends ca-certificates
# RUN update-ca-certificates

# Install dependencies
# RUN conda config --set ssl_verify false;
RUN conda update -n base conda;
RUN conda create -n vqgan pip python=3.7;
# RUN conda run -n vqgan pip --trusted-host pypi.org --trusted-host files.pythonhosted.org install torch torchvision torchaudio
RUN conda run -n vqgan pip files.pythonhosted.org install torch torchvision torchaudio
# RUN conda run -n vqgan pip --trusted-host pypi.org --trusted-host files.pythonhosted.org install ftfy regex tqdm omegaconf pytorch-lightning ipython kornia imageio imageio-ffmpeg einops torch-optimizer
RUN conda run -n vqgan pip install ftfy regex tqdm omegaconf pytorch-lightning ipython kornia imageio imageio-ffmpeg einops torch-optimizer

# Download models
RUN mkdir -p /app/checkpoints;
# RUN curl -L -k -o /app/checkpoints/vqgan_imagenet_f16_16384.yaml -C - 'https://heibox.uni-heidelberg.de/d/a7530b09fed84f80a887/files/?p=%2Fconfigs%2Fmodel.yaml&dl=1';
RUN curl -L -o /app/checkpoints/vqgan_imagenet_f16_16384.yaml -C - 'https://heibox.uni-heidelberg.de/d/a7530b09fed84f80a887/files/?p=%2Fconfigs%2Fmodel.yaml&dl=1';
# RUN curl -L -k -o /app/checkpoints/vqgan_imagenet_f16_16384.ckpt -C - 'https://heibox.uni-heidelberg.de/d/a7530b09fed84f80a887/files/?p=%2Fckpts%2Flast.ckpt&dl=1';
RUN curl -L -o /app/checkpoints/vqgan_imagenet_f16_16384.ckpt -C - 'https://heibox.uni-heidelberg.de/d/a7530b09fed84f80a887/files/?p=%2Fckpts%2Flast.ckpt&dl=1';

SHELL ["conda", "run", "--name", "vqgan", "/bin/bash", "-c"]
ENTRYPOINT ["conda", "run", "--name", "vqgan", "python", "generate.py"]