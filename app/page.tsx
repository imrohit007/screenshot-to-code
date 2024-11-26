"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import CodeOutput from "@/components/CodeOutput";

export default function Home() {
  const [generatedCode, setGeneratedCode] = useState("");

  return (
    <div className="min-h-screen flex flex-col container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Screenshot to Code
          </h1>
          <p className="text-secondary max-w-xl mx-auto">
            Upload a screenshot, and we'll generate a comprehensive HTML file
            with embedded styles and scripts.
          </p>
        </header>

        <ImageUploader onCodeGenerated={(code) => setGeneratedCode(code)} />

        {generatedCode && <CodeOutput code={generatedCode} />}
      </div>
    </div>
  );
}
