"use client";

import React, { useState } from "react";
import { ClipboardCopyIcon } from "lucide-react";

interface CodeOutputProps {
  code: string;
}

const CodeOutput: React.FC<CodeOutputProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 bg-secondary/10 rounded-xl overflow-hidden shadow-lg">
      <div className="flex justify-between items-center p-4 bg-secondary/5">
        <h3 className="text-lg font-semibold">Generated Code</h3>
        <button
          onClick={handleCopy}
          className={`
            flex items-center space-x-2 p-2 rounded-md 
            transition-all duration-300 ease-in-out
            ${
              copied
                ? "bg-green-500 text-white"
                : "hover:bg-primary/10 text-secondary"
            }
          `}
        >
          <ClipboardCopyIcon className="w-5 h-5" />
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
      <pre
        className="
          p-4 overflow-x-auto bg-secondary/5 
          text-sm font-mono max-h-[500px]
        "
      >
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeOutput;
