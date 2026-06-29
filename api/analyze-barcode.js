export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "חסר OPENAI_API_KEY ב־Vercel. הוסף Environment Variable ואז עשה Redeploy." });
  }

  try {
    const { imageData } = req.body || {};
    if (!imageData || typeof imageData !== "string" || !imageData.startsWith("data:image/")) {
      return res.status(400).json({ error: "לא התקבלה תמונת ברקוד תקינה" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0,
        input: [{
          role: "user",
          content: [
            { type: "input_text", text: "קרא את מספר הברקוד/מק״ט מהתמונה. החזר JSON תקין בלבד עם שדה barcode כמחרוזת ספרות בלבד. אם לא ברור, החזר barcode ריק." },
            { type: "input_image", image_url: imageData, detail: "high" },
          ],
        }],
        text: {
          format: {
            type: "json_schema",
            name: "barcode_result",
            schema: {
              type: "object",
              additionalProperties: false,
              properties: { barcode: { type: "string" } },
              required: ["barcode"],
            },
          },
        },
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || "זיהוי הברקוד נכשל" });
    const outputText = data.output_text || data.output?.flatMap((item) => item.content || []).find((c) => c.type === "output_text")?.text;
    const parsed = outputText ? JSON.parse(outputText) : {};
    const barcode = String(parsed?.barcode || "").replace(/\D/g, "");
    return res.status(200).json({ barcode });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "שגיאה בקריאת ברקוד" });
  }
}
