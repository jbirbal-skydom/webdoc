import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-rust";
import "prismjs/themes/prism-dark.css";
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
    <div className="editor-container">
      <div className="editor-header">
        <span className="file-name">main.rs</span>
      </div>
      <div className="editor-body">
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(code) => highlightWithLineNumbers(code, languages.rust)}
          padding={10}
          className="code-editor"
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            backgroundColor: "#1e1e1e", // Dark background
            color: "#d4d4d4", // Light text
            outline: 0,
          }}
        />
      </div>

      <div className="editor-footer">
        <button onClick={runCode} disabled={isLoading} className="run-button">
          {isLoading ? "⟳ Running..." : "▶ Run"}
        </button>
      </div>

      {(output || error) && (
        <div className="output-panel">
          <div className="output-header">Output</div>
          <div className={`output-content ${error ? "error" : ""}`}>
            {error || output}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeAPI;
