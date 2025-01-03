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
  const [imageSrc, setImageSrc] = useState(null); // State for storing the image source
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
    setImageSrc(null); // Reset the image source

    try {
      const response = await fetch("http://10.0.0.34:1313/v1/exec", {
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
        const stdout = data.stdout.trim();
        setOutput(data.stdout);
        // Check if output contains Base64 image data
        if (stdout.startsWith("data:image/png;base64,")) {
          setImageSrc(stdout); // Update image source
        }
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
            </div>
          )}
        </div>
      );
};

export default CodeAPI;
