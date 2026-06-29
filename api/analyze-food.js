export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "חסר OPENAI_API_KEY ב־Vercel. הוסף Environment Variable בשם OPENAI_API_KEY ואז עשה Redeploy.",
    });
  }

  try {
    const { imageData } = req.body || {};
    if (!imageData || typeof imageData !== "string" || !imageData.startsWith("data:image/")) {
      return res.status(400).json({ error: "לא התקבלה תמונת אוכל תקינה" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.1,
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text:
                  "אתה מנתח תמונת אוכל עבור יומן קלוריות אישי. זהה את המאכל/ים המרכזיים בתמונה ותן הערכה ממוצעת. החזר רק JSON תקין בלי טקסט נוסף. השדות: name בעברית קצר, grams מספר משוער של כל המנה, calories מספר כולל, protein מספר גרם, fat מספר גרם, confidence אחד מתוך low/medium/high, note בעברית קצרה שמסבירה שזו הערכה מתמונה. אם יש כמה מאכלים, תן שם מאוחד כמו 'אורז עם עוף'. אל תחזיר null; אם לא בטוח, תן הערכה שמרנית וביטחון low."
              },
              {
                type: "input_image",
                image_url: imageData,
                detail: "low"
              }
            ]
          }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "food_estimate",
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                name: { type: "string" },
                grams: { type: "number" },
                calories: { type: "number" },
                protein: { type: "number" },
                fat: { type: "number" },
                confidence: { type: "string", enum: ["low", "medium", "high"] },
                note: { type: "string" }
              },
              required: ["name", "grams", "calories", "protein", "fat", "confidence", "note"]
            }
          }
        }
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      const message = data?.error?.message || "OpenAI request failed";
      return res.status(response.status).json({ error: message });
    }

    const outputText = data.output_text || data.output?.flatMap((item) => item.content || []).find((c) => c.type === "output_text")?.text;
    if (!outputText) {
      return res.status(502).json({ error: "לא התקבלה תשובת זיהוי מהמודל" });
    }

    let parsed;
    try {
      parsed = JSON.parse(outputText);
    } catch {
      return res.status(502).json({ error: "תשובת הזיהוי לא הייתה JSON תקין" });
    }

    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(500).json({ error: error?.message || "שגיאה בזיהוי תמונה" });
  }
}
