const { buildImagePrompt } = require("../utils/prompts");
const sharp = require("sharp");

async function generateBlogFromImage(req, res) {
  try {
    let imageUrl = null;

    // Check for image_url in body
    if (req.body.image_url) {
      imageUrl = req.body.image_url;
    }

    // If multer memoryStorage was used, req.file.buffer will be present
    if (req.file && req.file.buffer) {
      const mime = req.file.mimetype || "image/jpeg";

      // 🔹 Compress and resize image using sharp
      const compressedBuffer = await sharp(req.file.buffer)
        .resize(512, 512, { fit: "inside" }) // max width/height 512px
        .jpeg({ quality: 60 }) // compress JPEG
        .toBuffer();

      const b64 = compressedBuffer.toString("base64");
      imageUrl = `data:${mime};base64,${b64}`;
    }

    if (!imageUrl) {
      return res.status(400).json({
        error:
          "No image provided. Send 'image' (form upload), 'image_url' or 'image_base64'.",
        debug: {
          headers: req.headers,
          body: req.body,
          filePresent: !!req.file,
        },
      });
    }

    const prompt = buildImagePrompt(imageUrl);

    const baseUrl =
      process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1";
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey)
      return res
        .status(500)
        .json({ error: "OPENAI_API_KEY is not set in environment" });

    const resp = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-nano-12b-v2-vl:free",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
        max_tokens: 1200,
        temperature: 0.8,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res
        .status(resp.status)
        .json({ error: "OpenAI API error", details: text });
    }

    const data = await resp.json();
    const raw = data?.choices?.[0]?.message?.content;


    if (!raw)
      return res
        .status(502)
        .json({ error: "No content returned from model", details: data });

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      const match = raw.match(/```json\n([\s\S]*?)\n```/i);
      if (match) {
        try {
          parsed = JSON.parse(match[1]);
        } catch (e2) {
          parsed = null;
        }
      }
    }

    if (!parsed) return res.json({ raw });

    return res.json(parsed);
  } catch (err) {
    console.error("generateBlogFromImage error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { generateBlogFromImage };
