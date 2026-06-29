export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "חסר OPENAI_API_KEY ב־Vercel. הוסף Environment Variable ואז עשה Redeploy." });
  }

  try {
    const { imageData } = req.body || {};
    if (!imageData || typeof imageData !== "string" || !imageData.startsWith("data:image/")) {
      return res.status(400).json({ error: "לא התקבלה תמונת תווית תקינה" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.1,
        input: [{
          role: "user",
          content: [
            { type: "input_text", text: "אתה קורא תווית תזונתית של מוצר עבור יומן קלוריות. קרא שם מוצר אם מופיע, גודל מנה/כמות אם מופיעים, וערכים תזונתיים. אם הערכים הם ל-100 גרם ויש גודל מנה ברור, חשב למנה. אם אין גודל מנה ברור, החזר לפי 100 גרם. החזר JSON תקין בלבד: name בעברית קצר, grams מספר, calories מספר, protein גרם, fat גרם, confidence low/medium/high, note בעברית קצרה. אם לא בטוח, השתמש בביטחון low וכתוב שאפשר לערוך." },
            { type: "input_image", image_url: imageData, detail: "high" },
          ],
        }],
        text: {
          format: {
            type: "json_schema",
            name: "nutrition_label_result",
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
                note: { type: "string" },
              },
              required: ["name", "grams", "calories", "protein", "fat", "confidence", "note"],
            },
          },
        },
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || "קריאת התווית נכשלה" });
    const outputText = data.output_text || data.output?.flatMap((item) => item.content || []).find((c) => c.type === "output_text")?.text;
    if (!outputText) return res.status(502).json({ error: "לא התקבלה תשובה מקריאת התווית" });
    const parsed = JSON.parse(outputText);
    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(500).json({ error: error?.message || "שגיאה בקריאת תווית" });
  }
}
