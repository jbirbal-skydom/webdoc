# CodeAPI

CodeApi runs code snippets inside a docker image.

## Windows

For testing the instructions give linux as a production environment. We will use WSL and a temporary linux environment

### WSL

* Install WSL
    `wsl --install`
  * List all WSL distribution
        available:
        `wsl --list --online`
        installed
        `wsl --list --verbose`
  * Get .tar for distribution
    * export the tar
    * get `.tar` from online repo
    * `https://cloud-images.ubuntu.com/wsl/`
  * create a temporary distribution
      `mkdir -p C:\temp\UbuntuTemp`
      `wsl --import UbuntuTemp C:\temp\UbuntuTemp C:\Users\skydom\Downloads\ubuntu-noble-wsl-amd64-24.04lts.rootfs.tar.gz`
  * Start distribution
      `wsl -d UbuntuTemp`
  * Remove distribution
      `wsl --unregister UbuntuTemp`
  * Bind Docker
      Open Docker Desktop > Settings > Resources > WSL Integration.
      Toggle on the distributions you want Docker to integrate with.

## Linux

    Follow instructions repo 

      `https://github.com/nalgeon/codapi`

## Install CodeAPI

install and make a sandbox

* Follow **instructions** repo
    `https://github.com/nalgeon/codapi`
* Rust
  * To install the rust sandbox
    `https://github.com/nalgeon/codapi/blob/ccea62a7622dd7d1ecdb5dc8836947b8517c89e7/docs/add-sandbox.md`

    wsl:
    `cd /opt/codapi`
    `mkdir images/rust`
    `touch images/rust/Dockerfile`

Create a Dockerfile for Rust:

        ```dockerfile
        dockerfileCopyFROM rust:1.75-alpine

        RUN adduser --home /sandbox --disabled-password sandbox

        # Add any specific dependencies your Monolith project needs
        RUN apk add --no-cache build-base

        USER sandbox
        WORKDIR /sandbox

        # Environment variables for Rust
        ENV RUSTC_WRAPPER=""
        ENV CARGO_HOME="/sandbox/.cargo"
        ```

Build the Docker image:

`docker build --file images/rust/Dockerfile --tag codapi/rust:latest images/rust/`

Register the Rust sandbox by creating `configs/boxes/rust.json`:

    ```json
    {
        "image": "codapi/rust",
        "writable": true,
        "volume": "%s:/sandbox"
    }
    ```

Configure the run command by creating `configs/commands/rust.json`:

    ```json
    {
        "run": {
            "engine": "docker",
            "entry": "main.rs",
            "steps": [
                {
                    "box": "rust",
                    "command": ["rustc", "main.rs", "-o", "main"],
                    "noutput": 4096
                },
                {
                    "box": "rust",
                    "command": ["./main"],
                    "noutput": 4096
                }
            ]
        }
    }

    ```
apply
    `systemctl restart codapi.service`


install editor

`npm install react-simple-code-editor prismjs`
