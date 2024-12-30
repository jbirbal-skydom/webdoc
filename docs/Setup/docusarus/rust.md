# Rust in markdwon example

You can integrate Rust examples into your Docusaurus Markdown files using WebAssembly (Wasm). This involves compiling Rust code to WebAssembly, embedding it into your Docusaurus site, and using a JavaScript interface to execute the Wasm code. Here's a step-by-step guide:

## 1. Set Up Your Rust Project for WebAssembly

make folder and cd into it `rust`

1. **Install the `wasm-pack` tool**:

    ```bash
    rustup update
    cargo install wasm-pack
    ```

2. **Create a new Rust project or use an existing one**:

    ```bash
    cargo new --lib rust_to_wasm
    cd rust_to_wasm
    ```

3. **Update the Rust code in `lib.rs` to include a function you want to expose**:

    ```rust
    use wasm_bindgen::prelude::*;
    
    #[wasm_bindgen]
    pub fn greet(name: &str) -> String {
        format!("Hello, {}!", name)
    }
    ```

4. **Add the `wasm-bindgen` dependency in `Cargo.toml`**:

    ```toml
    [dependencies]
    wasm-bindgen = "0.2"
    ```

5. **Build the Rust project for WebAssembly**:

    ```bash
    wasm-pack build --target web
    ```

This will generate a `pkg/` directory containing WebAssembly files and JavaScript bindings.

* * *

### 2. Integrate Wasm into Docusaurus

1. **Copy the `pkg/` directory to your Docusaurus `static` folder**:

    ```bash
    cp -r pkg/ /path-to-docusaurus/static/
    ```

    The `static` folder in Docusaurus serves static assets like the WebAssembly files and JavaScript bindings.

2. **Create a JavaScript Wrapper**: Create a JavaScript file in your `src` folder (e.g., `src/wasm-example.js`) to load and use the Wasm module:

    ```javascript
    import init, { greet } from '/pkg/rust_to_wasm.js';
    
    export async function runRustWasmExample(name) {
        await init('/pkg/rust_to_wasm_bg.wasm');
        return greet(name);
    }
    ```

* * *

### 3. Add Markdown with Rust Example

1. **Include a `Markdown` file in your Docusaurus project** (e.g., `docs/wasm-example.md`):

    ```markdown
    ---
    title: Rust to Wasm Example
    ---
    
    # Rust to Wasm Example
    
    This is an example of integrating Rust with WebAssembly.
    
    <div id="wasm-example">
        <input type="text" id="name" placeholder="Enter your name">
        <button onclick="runExample()">Run Example</button>
        <p id="output"></p>
    </div>
    
    <script type="module">
    import { runRustWasmExample } from '/src/wasm-example.js';
    
    async function runExample() {
        const name = document.getElementById('name').value;
        const output = await runRustWasmExample(name);
        document.getElementById('output').innerText = output;
    }
    </script>
    ```

* * *

### 4. Build and Test

1. **Run the Docusaurus development server**:

    ```bash
    npm run start
    ```

2. **Navigate to your Rust-Wasm example page** and test the functionality.

* * *

### Key Notes

* Ensure your WebAssembly file is accessible via the Docusaurus `static` folder or another location served by your site.
* Use WebAssembly bindings (`wasm-bindgen`) to export and access Rust functions in JavaScript.
* Use `<script type="module">` in Markdown to include custom JavaScript logic.

This setup allows you to embed Rust code seamlessly into your Markdown files with WebAssembly integration.
