function parseGrams(value) {
  if (!value || typeof value !== "string") return null;
  const normalized = value.replace(",", ".");
  const match = normalized.match(/(\d+(?:\.\d+)?)\s*(kg|קג|ק"ג|g|גרם|מ״ל|מיליליטר|ml)/i);
  if (!match) return null;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const unit = match[2].toLowerCase();
  if (["kg", "קג", "ק\"ג"].includes(unit)) return Math.round(amount * 1000);
  return Math.round(amount);
}

function roundOne(n) {
  return Math.round(Number(n) * 10) / 10;
}

function getNumber(...values) {
  for (const value of values) {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const barcode = String(req.query?.barcode || "").replace(/\D/g, "");
  if (!barcode || barcode.length < 6) return res.status(400).json({ error: "ברקוד לא תקין" });

  try {
    const fields = [
      "product_name",
      "product_name_he",
      "brands",
      "quantity",
      "serving_size",
      "nutriments",
    ].join(",");

    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json?fields=${fields}`, {
      headers: { "User-Agent": "TomerDayBoard/1.0 (personal nutrition journal)" },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.status === 0 || !data?.product) {
      return res.status(404).json({ error: "המוצר לא נמצא במאגר הברקודים" });
    }

    const product = data.product;
    const nutriments = product.nutriments || {};
    const kcal100 = getNumber(nutriments["energy-kcal_100g"], nutriments["energy-kcal"], nutriments["energy-kcal_serving"]);
    const protein100 = getNumber(nutriments.proteins_100g, nutriments.proteins, nutriments.proteins_serving);
    const fat100 = getNumber(nutriments.fat_100g, nutriments.fat, nutriments.fat_serving);

    if (kcal100 === null && protein100 === null && fat100 === null) {
      return res.status(422).json({ error: "המוצר נמצא, אבל אין לו ערכים תזונתיים במאגר" });
    }

    const servingGrams = parseGrams(product.serving_size);
    const quantityGrams = parseGrams(product.quantity);
    const grams = servingGrams || (quantityGrams && quantityGrams <= 250 ? quantityGrams : 100);
    const factor = grams / 100;
    const name = product.product_name_he || product.product_name || product.brands || `מוצר ${barcode}`;

    return res.status(200).json({
      barcode,
      name,
      grams,
      calories: kcal100 !== null ? Math.round(kcal100 * factor) : null,
      protein: protein100 !== null ? roundOne(protein100 * factor) : null,
      fat: fat100 !== null ? roundOne(fat100 * factor) : null,
      note: `זוהה לפי ברקוד. חושב לפי ${grams} גרם${servingGrams ? " (מנה מהתווית)" : ""}. אפשר לשנות גרמים לפני שמירה.`,
    });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "שגיאה בחיפוש הברקוד" });
  }
}
