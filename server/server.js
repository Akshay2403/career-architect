import "dotenv/config";

import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
console.log("API Key loaded:", process.env.OPENROUTER_API_KEY ? "YES" : "NO");

app.post("/api/generate", async (req, res) => {
  try {
    const { title, location } = req.body;

    if (!title || !location) {
      return res.status(400).json({ error: "Title or location is missing" });
    }

    const prompt = `Generate a professional 2-3 line job description for a ${title} in ${location}.
Return ONLY the final answer.
Do not include phrases like "Here is", "Job Description", or any headings.
Start directly with the content.`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
          ],
          max_tokens: 120,
          temperature: 0.7,
        }),
      },
    );

    const data = await response.json();

    let generated = "";

    if (data.choices && data.choices.length > 0) {
      generated = data.choices[0].message.content.trim();
    } else {
      generated = "Description has been not genrated. Try again!";
    }

    res.json({ generated });
  } catch (err) {
    console.error("Error generating description:", err);
    res.status(500).json({ error: "AI generation failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running: on port ${PORT}`);
});
