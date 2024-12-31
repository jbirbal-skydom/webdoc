import React, { useState, useEffect } from 'react';

const WasmExample = () => {
  const [name, setName] = useState('');
  const [output, setOutput] = useState('');
  const [wasmModule, setWasmModule] = useState(null);

  useEffect(() => {
    const loadWasm = async () => {
      try {
        const { default: init, greet } = await import('/static/rust/rust_to_wasm/pkg/rust_to_wasm.js');
        await init('/static/rust/rust_to_wasm/pkg/rust_to_wasm_bg.wasm');
        setWasmModule({ greet });
      } catch (err) {
        console.error('Failed to load WASM:', err);
        setOutput('Failed to load WASM module');
      }
    };

    loadWasm();
  }, []);

  const handleRun = async () => {
    if (wasmModule && name) {
      try {
        const result = wasmModule.greet(name);
        setOutput(result);
      } catch (err) {
        console.error('Failed to run WASM function:', err);
        setOutput('Error running WASM function');
      }
    }
  };

  return (
    <div className="p-4 space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="border rounded p-2"
      />
      <button
        onClick={handleRun}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Run Example
      </button>
      <p className="mt-2">{output}</p>
    </div>
  );
};

export default WasmExample;