FROM  continuumio/anaconda3

WORKDIR /app
COPY . /app

# Download dependency repositories 
RUN git clone 'https://github.com/openai/CLIP' /app/CLIP
RUN git clone 'https://github.com/CompVis/taming-transformers' /app/taming-transformers

# Download models
RUN mkdir /app/checkpoints
RUN curl -L -o /app/checkpoints/vqgan_imagenet_f16_16384.yaml -C - 'https://heibox.uni-heidelberg.de/d/a7530b09fed84f80a887/files/?p=%2Fconfigs%2Fmodel.yaml&dl=1'
RUN curl -L -o /app/checkpoints/vqgan_imagenet_f16_16384.ckpt -C - 'https://heibox.uni-heidelberg.de/d/a7530b09fed84f80a887/files/?p=%2Fckpts%2Flast.ckpt&dl=1'

# Install dependency packages
RUN conda update -n base conda
RUN conda create -n asset-generation-service pip python=3.7
RUN conda run -n asset-generation-service pip install torch torchvision torchaudio
RUN conda run -n asset-generation-service pip install ftfy regex tqdm omegaconf pytorch-lightning ipython kornia imageio imageio-ffmpeg einops torch-optimizer flask

# Flask configuration
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=development 

CMD ["conda", "run", "-n", "asset-generation-service", "flask", "run" ]