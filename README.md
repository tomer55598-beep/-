# תכנון יומי

פרויקט React/Vite שמוכן ל־Vercel.

## הרצה מקומית

```bash
npm install
npm run dev
```

## Deploy ל־Vercel

```bash
npm run build
```

## זיהוי אוכל מתמונה

הפיצ׳ר של צילום אוכל משתמש ב־Vercel Function שנמצאת ב־`api/analyze-food.js`.
כדי שהזיהוי יעבוד ב־Vercel צריך להוסיף Environment Variable:

```txt
OPENAI_API_KEY=המפתח שלך
```

ב־Vercel:
Project → Settings → Environment Variables → Add → Redeploy.

בלי המפתח, כל שאר האפליקציה תעבוד, אבל צילום אוכל יחזיר הודעה שחסר מפתח.
