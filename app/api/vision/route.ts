import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GROK_VISION_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Grok Vision API key is not configured" },
        { status: 500 }
      );
    }

    const { base64Image } = await request.json();

    const response = await axios.post(
      "https://api.x.ai/v1/chat/completions",
      {
        model: "grok-vision-beta",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: "high",
                },
              },
              {
                type: "text",
                text: "Generate a complete, single HTML file that exactly replicates the screenshot's UI. Requirements:\n- Use a single HTML file with embedded CSS in <style> tag\n- Include any necessary JavaScript in <script> tag within the same file\n- Use Tailwind CSS classes for styling\n- Ensure pixel-perfect visual reproduction\n- Include all functional elements\n- Minimize external dependencies\n- Provide ONLY the raw HTML file code, without any additional explanation or comments",
              },
            ],
          },
        ],
        temperature: 0.05,
        max_tokens: 7200,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const codeContent = response.data.choices[0].message.content;

    return NextResponse.json({
      code: codeContent.trim(),
    });
  } catch (error) {
    console.error("Error in vision API route:", error);
    return NextResponse.json(
      { error: "Failed to convert screenshot" },
      { status: 500 }
    );
  }
}
