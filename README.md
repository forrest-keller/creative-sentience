This project contains two images that are generated with a docker-compose file. The `asset-generation-service` image exposes a Flask server that internally calls the `generate.py` script with passed parameters to initiate image generation. The `main-service` image exposes a NodeJS server that takes user input and cals the `asset-generation-service` to initiate generations.

To get started, run `docker-compose up` and view the route specification in the main service to make requests. The main service port mapping is set to `8080`.
