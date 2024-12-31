import init, { greet } from '/static/rust/rust_to_wasm/pkg/rust_to_wasm.js';

export async function runRustWasmExample(name) {
    await init('/static/rust/rust_to_wasm/pkg/rust_to_wasm_bg.wasm');
    return greet(name);
}