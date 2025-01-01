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
`cd /opt/codapi/`

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

Check the debug:
`docker run -it --entrypoint /bin/sh codapi/rust`

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

The editor doesn't come with a theme or line numbers and adding a theme affect the global theme. adding a scoped theme doens't register the prism syntax highlighting.

add the react component with the global highlights:

    ```js
    import React, { useState } from "react";
    import Editor from "react-simple-code-editor";
    import { highlight, languages } from "prismjs";
    import "prismjs/components/prism-rust";
    // import "prismjs/themes/prism-dark.css";
    import styles from './CodeApi.module.css';
    // import "./styles.css";

    const CodeAPI = ({ sandbox = "rust", files = {}, initialCode = "" }) => {
      const defaultCode = `fn main() {
        println!("Hello, World!");
    }`;

      const [code, setCode] = useState(
        files["main.rs"] || initialCode || defaultCode
      );
      const [output, setOutput] = useState("");
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState(null);
      const prismDarkCSS = `
      .token.comment { color: #6a9955; }
      .token.keyword { color: #569cd6; }
      .token.string { color: #ce9178; }
      .token.function { color: #dcdcaa; }
      .token.operator { color: #d4d4d4; }
      .token.punctuation { opacity: 0.7; }
    `;
      const runCode = async () => {
        setIsLoading(true);
        setError(null);
        setOutput("");

        try {
          const response = await fetch("http://localhost:1313/v1/exec", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sandbox,
              command: "run",
              files: {
                "main.rs": code,
              },
            }),
          });

          const data = await response.json();

          if (!data.ok) {
            setError(data.stderr || "Execution failed");
          } else {
            setOutput(data.stdout);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      const highlightWithLineNumbers = (input, language) =>
        highlight(input, language)
          .split("\n")
          .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
          .join("\n");

          return (
            <div className={styles.editorContainer}>
              <style>{prismDarkCSS}</style>
              <div className={styles.editorHeader}>
                <span className={styles.fileName}>main.rs</span>
              </div>
              <div className={styles.editorBody}>
                <Editor
                  value={code}
                  onValueChange={setCode}
                  highlight={(code) => highlightWithLineNumbers(code, languages.rust)}
                  padding={10}
                  className={styles.codeEditor}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 14,
                    outline: 0, // Removed inline background and text colors to let CSS handle it
                    lineHeight: 1.5,
                  }}
                />
              </div>
          
              <div className={styles.editorFooter}>
                <button onClick={runCode} disabled={isLoading} className={styles.runButton}>
                  {isLoading ? "⟳ Running..." : "▶ Run"}
                </button>
              </div>
          
              {(output || error) && (
                <div className={styles.outputPanel}>
                  <div className={styles.outputHeader}>Output</div>
                  <div className={`${styles.outputContent} ${error ? styles.error : ''}`}>
                    {error || output}
                  </div>
                </div>
              )}
            </div>
          );
    };

    export default CodeAPI;

    ```

the css for the line numbers

    ```css
    .editorContainer {
      border: 1px solid #444;
      border-radius: 5px;
      overflow: hidden;
    }

    .editorHeader {
      background: #333;
      color: #fff;
      padding: 5px 10px;
    }

    .fileName {
      font-weight: bold;
    }

    .editorBody {
      position: relative;
      counter-reset: line;  /* Add this to reset the line counter */
    }

    .codeEditor {
      position: relative;
      background-color: #1e1e1e;
      color: #d4d4d4;
      margin: 0;
      width: 100%;
    }
    /* Add these new styles for line numbers */
    .codeEditor :global(.editorLineNumber) {
      position: absolute;
      left: 0;
      color: #858585;
      text-align: right;
      width: 40px;
      padding-right: 10px;
      font-size: 14px;
      line-height: 1.5;
      user-select: none;
    }

    .editorFooter {
      margin-top: 10px;
    }

    .runButton {
      background: #007acc;
      color: white;
      border: none;
      border-radius: 3px;
      padding: 8px 12px;
      cursor: pointer;
    }

    .runButton:disabled {
      background: #555;
      cursor: not-allowed;
    }

    .outputPanel {
      background: #252526;
      color: #d4d4d4;
      padding: 10px;
      margin-top: 10px;
      border-radius: 5px;
      border: 1px solid #444;
    }

    .outputPanel.error {
      color: #f44747;
    }

    .outputContent {
      white-space: pre-wrap;
      font-family: "Fira Code", monospace;
    }

    /* Ensure the textarea and highlighted code have proper padding */
    .codeEditor textarea,
    .codeEditor pre {
      padding-left: 50px !important;
      min-height: 100px;
      line-height: 1.5;
    }
    ```

### Dependencies and Generate image

We need to add dependencies to crease a image to generate for hte front end. To do this we need to edit the dockerfile and command to import the files needed.
build the dockerfile and compile the rust program

* Dockerfile
  
  We needed to precompile the dockerfile to make the new front end a bit fast. it is still slow but it is a compiled code.

      ```dockerfile
      FROM rust:1.83-alpine

      # First, we create a user that will run our code
      RUN adduser --home /sandbox --disabled-password sandbox

      # Add necessary build tools
      RUN apk add --no-cache build-base pkgconfig

      # Install image processing dependencies
      RUN apk add --no-cache jpeg-dev libpng-dev


      # Pre-install commonly used crates
      WORKDIR /usr/local/workspace
      RUN cargo new --bin myapp
      WORKDIR /usr/local/workspace/myapp

      RUN cat > /usr/local/workspace/myapp/Cargo.toml <<EOF
      [package]
      name = "myapp"
      version = "0.1.0"
      edition = "2021"

      [dependencies]
      image = "0.25.5"
      base64 = "0.22.1"
      EOF

      # Add a placeholder main.rs that uses the dependencies
      # This ensures everything gets compiled
      RUN cat > src/main.rs <<EOF
      use image::{ImageBuffer, Rgb};
      use base64;
      fn main() {
          println!("initalizing");
      }
      EOF

      # Set ownership before building
      RUN mkdir -p /usr/local/workspace/myapp/src && \
          chown -R sandbox:sandbox /usr/local/workspace/myapp && \
          chown -R sandbox:sandbox /sandbox
      RUN chown -R sandbox:sandbox /usr/local/workspace

      # Switch to sandbox user
      USER sandbox

      # Build dependencies
      RUN cargo build --release

      # Set up Rust environment variables
      ENV RUSTC_WRAPPER=""
      ENV CARGO_HOME="/usr/local/cargo"
      #Remove main.rs for brevity
      ```

* Box

The standard directory was the `/sandbox` directory and we are now working with the file system. i think the volume mount point over wrote rust file directory initially. needs investigation.

      ```json
      {
          "image": "codapi/rust",
          "writable": true,
          "volume": "%s:/usr/local/workspace/myapp/src",
          "env": {
              "CARGO_HOME": "/sandbox/.cargo"
          },
          "working_dir": "/usr/local/workspace/myapp"
      }
      ```

* Command
  
    We did the cargo run instead of the single executable.

      ```js
      {
          "run": {
              "engine": "docker",
              "entry": "main.rs",
              "steps": [
                  {
                      "box": "rust",
                      "command": ["cargo", "run", "--release"],
                      "noutput": 1048576,
                      "timeout": 45
                  }
              ]
          }
      }
      ```

* config

 We increased the cpu power memory timeout, and byte output to compensate for a compiled binary time.
cat configs/config.json

      ```json
      {
          "pool_size": 8,
          "verbose": true,
          "box": {
              "runtime": "runc",
              "cpu": 2,
              "memory": 512,
              "network": "none",
              "writable": false,
              "volume": "%s:/sandbox:ro",
              "cap_drop": ["all"],
              "ulimit": ["nofile=96"],
              "nproc": 128
          },
          "step": {
              "user": "sandbox",
              "action": "run",
              "timeout": 30,
              "noutput": 8192
          }
      }
      ```

* react
  
  We need to display the image base64 in our react app.

      ```json
      ...
          setImageSrc(null); // Reset the image source
      ...
            if (!data.ok) {
              setError(data.stderr || "Execution failed");
            } else {
              const stdout = data.stdout.trim();
              setOutput(data.stdout);
              // Check if output contains Base64 image data
              if (stdout.startsWith("data:image/png;base64,")) {
                setImageSrc(stdout); // Update image source
              }
            }
      ...
            {(output || error || imageSrc) && (
              <div className={styles.outputPanel}>
                <div className={styles.outputHeader}>Output</div>
                <div className={`${styles.outputContent} ${error ? styles.error : ''}`}>
                  {error || output}
                </div>
                {imageSrc && (
              <div className={styles.imagePreview}>
                <img src={imageSrc} alt="Generated" />
              </div>
            )}
      ```
