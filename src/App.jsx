import React, { useState, useEffect, useRef, useCallback } from "react";
import {CheckSquare, Square, Trash2, Plus, Utensils, Droplets, ListTodo, X, RotateCcw, Calendar, Scale, ArrowUp, ArrowDown, Minus, BookOpen, ChevronLeft, ChevronDown, ChevronUp, History, Pencil, Camera, Image as ImageIcon, Loader2, Home, BarChart3, Activity, Target, Trophy, Flame, TrendingUp, TrendingDown, Sparkles, Cookie, Coffee} from "lucide-react";

const DEFAULT_WATER_GOAL = 4000; // ml
const DEFAULT_CALORIE_GOAL = 2200; // kcal
const WATER_QUICK_ADDS = [200, 330, 500];

const palette = {
  bg: "#F8F3EB",
  surface: "#FFFDF8",
  border: "#E7D9C8",
  ink: "#27231F",
  mutedInk: "#887B6A",
  tasksAccent: "#4F7A58",
  tasksAccentSoft: "#E7F0E7",
  foodAccent: "#C66735",
  foodAccentSoft: "#F8E2D2",
  waterAccent: "#2F75A8",
  waterAccentSoft: "#DDEFF8",
  weightAccent: "#83586A",
  weightAccentSoft: "#F0E1E7",
  danger: "#B5544A",
};


const TASK_STATUS = {
  not_done: "לא בוצע",
  done: "בוצע",
};

const TASK_PRIORITY = {
  high: "דחופה",
  normal: "רגילה",
  low: "נמוכה",
};

const FOOD_SUGGESTIONS = [
  "שווארמה",
  "שווארמה בצלחת",
  "שווארמה בפיתה",
  "שווארמה בלאפה",
  "שווארמה בבאגט",
  "פרגית",
  "פרגית בפיתה",
  "פרגית בלאפה",
  "קבב",
  "קבב בפיתה",
  "קבב בצלחת",
  "המבורגר",
  "צ׳יזבורגר",
  "נקניקיה",
  "סטייק",
  "אנטריקוט",
  "סינטה",
  "אסאדו",
  "חזה עוף",
  "עוף",
  "כרעיים",
  "כנפיים",
  "שניצל",
  "שניצלונים",
  "חזה עוף על האש",
  "קציצות",
  "כדורי בשר",
  "צלי בקר",
  "גולאש",
  "בשר טחון",
  "עראייס",
  "מעורב ירושלמי",
  "חמין",
  "טונה",
  "סלמון",
  "דג לבן",
  "אמנון",
  "נסיכת הנילוס",
  "דניס",
  "חביתה",
  "ביצה",
  "ביצים",
  "מקושקשת",
  "שקשוקה",
  "פיצה",
  "משולש פיצה",
  "פיצה משפחתית",
  "פיצה אישית",
  "פיצה מרגריטה",
  "פיצה פפרוני",
  "פיצה טונה",
  "פיצה פטריות",
  "פיצה זיתים",
  "פוקאצ׳ה",
  "טוסט",
  "טוסט גבינה",
  "טוסט נקניק",
  "בורקס",
  "בורקס גבינה",
  "בורקס תפוח אדמה",
  "מלאווח",
  "ג׳חנון",
  "פיתה",
  "לאפה",
  "באגט",
  "לחם",
  "לחמניה",
  "חלה",
  "טורטייה",
  "ראפ",
  "קרואסון",
  "מאפה גבינה",
  "סושי",
  "רול סושי",
  "סושי סלמון",
  "סושי טונה",
  "סושי צמחוני",
  "ניגירי",
  "מאקי",
  "אינסייד אאוט",
  "קומבינציית סושי",
  "פוקי",
  "פוקי סלמון",
  "פוקי טונה",
  "אורז סושי",
  "אצות",
  "אדממה",
  "גיוזה",
  "מוקפץ",
  "מוקפץ עוף",
  "מוקפץ בקר",
  "מוקפץ ירקות",
  "נודלס",
  "פאד תאי",
  "ראמן",
  "אטריות",
  "אורז מוקפץ",
  "עוף חמוץ מתוק",
  "עוף טריאקי",
  "עוף בקארי",
  "קארי עוף",
  "עוף קארי עם אורז",
  "קארי ירוק",
  "קארי אדום",
  "קארי תאילנדי",
  "עוף במסאלה",
  "עוף טיקה",
  "צ׳יקן טיקה",
  "עוף חמאה",
  "אורז עם עוף",
  "עוף עם תפוחי אדמה",
  "פלאפל",
  "פלאפל בפיתה",
  "פלאפל בצלחת",
  "חומוס",
  "חומוס גרגירים",
  "חומוס פול",
  "טחינה",
  "סביח",
  "סלט",
  "סלט ירקות",
  "סלט יווני",
  "סלט טונה",
  "סלט עוף",
  "ירקות",
  "מלפפון",
  "עגבניה",
  "פלפל",
  "בצל",
  "חסה",
  "כרוב",
  "גזר",
  "ברוקולי",
  "כרובית",
  "שעועית ירוקה",
  "תירס",
  "אפונה",
  "אורז",
  "אורז לבן",
  "אורז מלא",
  "פתיתים",
  "קוסקוס",
  "בורגול",
  "קינואה",
  "פסטה",
  "פסטה פסטו",
  "פסטה עגבניות",
  "פסטה בולונז",
  "ספגטי בולונז",
  "בולונז",
  "רוטב בולונז",
  "פסטה שמנת",
  "פסטה אלפרדו",
  "פסטה רוזה",
  "פסטה טונה",
  "פסטה עוף",
  "לזניה",
  "רביולי",
  "ניוקי",
  "תפוח אדמה",
  "פירה",
  "צ׳יפס",
  "בטטה",
  "עדשים",
  "שעועית",
  "חומוס מבושל",
  "מרק",
  "מרק עוף",
  "מרק ירקות",
  "קוטג׳",
  "גבינה לבנה",
  "גבינה צהובה",
  "גבינה בולגרית",
  "פטה",
  "יוגורט",
  "יוגורט חלבון",
  "מעדן חלבון",
  "מילקי",
  "חלב",
  "שוקו",
  "סקי",
  "שמנת",
  "חמאה",
  "אבקת חלבון",
  "שייק חלבון",
  "קינדר בואנו",
  "קינדר שוקולד",
  "קינדר ג׳וי",
  "קינדר קאנטרי",
  "M&M",
  "M&M בוטנים",
  "M&M שוקולד",
  "סניקרס",
  "טוויקס",
  "מארס",
  "קיטקט",
  "אוראו",
  "נוטלה",
  "פסק זמן",
  "כיף כף",
  "קליק",
  "טורטית",
  "שוקולד",
  "שוקולד חלב",
  "שוקולד מריר",
  "קרמבו",
  "גלידה",
  "ארטיק",
  "מגנום",
  "קורנטו",
  "במבה",
  "במבה נוגט",
  "ביסלי",
  "דוריטוס",
  "תפוצ׳יפס",
  "פרינגלס",
  "בייגלה",
  "פופקורן",
  "גרעינים",
  "אגוזים",
  "שקדים",
  "קשיו",
  "חטיף חלבון",
  "גרנולה",
  "קורנפלקס",
  "חמאת בוטנים",
  "בננה",
  "תפוח",
  "תפוז",
  "ענבים",
  "אבטיח",
  "מלון",
  "תותים",
  "מנגו",
  "אננס",
  "אפרסק",
  "אגס",
  "תמרים",
  "צימוקים",
  "אבוקדו",
  "קפה",
  "נס קפה",
  "קפה שחור",
  "תה",
  "מיץ",
  "קולה",
  "זירו",
  "מים",
  "סודה"
];

// מאגר קלוריות ממוצע ל-100 גרם. הערכים הם אומדן כללי ולא תחליף לתווית מוצר/מסעדה.
// calories = קלוריות, protein/fat = גרמים ל-100 גרם.
const CALORIE_DATABASE = [
  // עוף, בשר ודגים
  { name: "חזה עוף", aliases: ["חזה עוף", "חזה עוף על האש", "עוף בגריל", "עוף מבושל"], calories: 165, protein: 31, fat: 3.6, category: "חלבון · עוף" },
  { name: "פרגית", aliases: ["פרגית", "פרגיות"], calories: 210, protein: 25, fat: 12, category: "חלבון · עוף" },
  { name: "שניצל", aliases: ["שניצל", "שניצלונים", "שניצל עוף"], calories: 285, protein: 18, fat: 14, category: "חלבון · מטוגן" },
  { name: "כרעיים עוף", aliases: ["כרעיים", "כרע עוף", "ירך עוף", "שוק עוף"], calories: 215, protein: 24, fat: 13, category: "חלבון · עוף" },
  { name: "כנפיים", aliases: ["כנפיים", "כנפי עוף"], calories: 290, protein: 24, fat: 20, category: "חלבון · עוף" },
  { name: "עוף בקארי", aliases: ["עוף בקארי", "קארי עוף", "עוף קארי", "קארי ירוק", "קארי אדום", "עוף במסאלה", "צ׳יקן טיקה", "עוף חמאה"], calories: 190, protein: 16, fat: 10, category: "מנה עיקרית · עוף ורוטב" },
  { name: "עוף טריאקי", aliases: ["עוף טריאקי", "טריאקי עוף"], calories: 180, protein: 19, fat: 7, category: "מנה עיקרית · עוף ורוטב" },
  { name: "עוף חמוץ מתוק", aliases: ["עוף חמוץ מתוק"], calories: 240, protein: 13, fat: 10, category: "מנה עיקרית · אסייתי" },
  { name: "בקר טחון", aliases: ["בשר טחון", "בקר טחון", "בשר בקר טחון"], calories: 254, protein: 26, fat: 17, category: "חלבון · בשר" },
  { name: "קציצות", aliases: ["קציצות", "כדורי בשר"], calories: 230, protein: 17, fat: 14, category: "חלבון · בשר" },
  { name: "קבב", aliases: ["קבב"], calories: 260, protein: 17, fat: 20, category: "חלבון · בשר" },
  { name: "סטייק", aliases: ["סטייק", "סינטה", "אנטריקוט", "בקר"], calories: 250, protein: 26, fat: 16, category: "חלבון · בשר" },
  { name: "אסאדו", aliases: ["אסאדו", "שורט ריב"], calories: 340, protein: 20, fat: 28, category: "חלבון · בשר שמן" },
  { name: "צלי בקר", aliases: ["צלי בקר", "גולאש"], calories: 210, protein: 22, fat: 12, category: "חלבון · בשר" },
  { name: "המבורגר", aliases: ["המבורגר", "בורגר", "צ׳יזבורגר"], calories: 295, protein: 16, fat: 18, category: "מנה עיקרית · בשר" },
  { name: "שווארמה", aliases: ["שווארמה", "שווארמה הודו", "שווארמה עוף", "שווארמה בצלחת"], calories: 260, protein: 22, fat: 17, category: "מנה עיקרית · בשר" },
  { name: "מעורב ירושלמי", aliases: ["מעורב ירושלמי", "מעורב"], calories: 230, protein: 22, fat: 14, category: "מנה עיקרית · בשר" },
  { name: "עראייס", aliases: ["עראייס", "ערייס"], calories: 300, protein: 14, fat: 18, category: "מנה עיקרית · בשר ומאפה" },
  { name: "טונה במים", aliases: ["טונה", "טונה במים"], calories: 116, protein: 26, fat: 1, category: "חלבון · דגים" },
  { name: "טונה בשמן", aliases: ["טונה בשמן"], calories: 198, protein: 29, fat: 8, category: "חלבון · דגים" },
  { name: "סלמון", aliases: ["סלמון", "דג סלמון"], calories: 208, protein: 20, fat: 13, category: "חלבון · דגים" },
  { name: "אמנון", aliases: ["אמנון", "מושט", "דג לבן"], calories: 128, protein: 26, fat: 3, category: "חלבון · דגים" },
  { name: "דניס", aliases: ["דניס"], calories: 150, protein: 22, fat: 6, category: "חלבון · דגים" },
  { name: "ביצה", aliases: ["ביצה", "ביצים", "ביצה קשה", "ביצה עין"], calories: 155, protein: 13, fat: 11, category: "חלבון · ביצים" },
  { name: "חביתה", aliases: ["חביתה", "מקושקשת"], calories: 190, protein: 12, fat: 15, category: "חלבון · ביצים" },
  { name: "שקשוקה", aliases: ["שקשוקה"], calories: 130, protein: 7, fat: 8, category: "מנה · ביצים" },

  // פחמימות ותוספות מבושלות
  { name: "אורז לבן מבושל", aliases: ["אורז", "אורז לבן", "אורז מבושל"], calories: 130, protein: 2.7, fat: 0.3, category: "פחמימה · תוספת" },
  { name: "אורז מלא מבושל", aliases: ["אורז מלא"], calories: 112, protein: 2.6, fat: 0.9, category: "פחמימה · תוספת" },
  { name: "אורז סושי", aliases: ["אורז סושי"], calories: 150, protein: 2.5, fat: 0.2, category: "פחמימה · סושי" },
  { name: "פסטה מבושלת", aliases: ["פסטה", "ספגטי", "מקרוני", "פסטה מבושלת"], calories: 158, protein: 5.8, fat: 0.9, category: "פחמימה · פסטה" },
  { name: "פסטה בולונז", aliases: ["בולונז", "פסטה בולונז", "ספגטי בולונז", "רוטב בולונז"], calories: 165, protein: 7, fat: 6, category: "מנה עיקרית · פסטה ובשר" },
  { name: "פסטה פסטו", aliases: ["פסטה פסטו"], calories: 230, protein: 6, fat: 11, category: "מנה · פסטה" },
  { name: "פסטה שמנת", aliases: ["פסטה שמנת", "פסטה אלפרדו", "פסטה רוזה"], calories: 250, protein: 7, fat: 14, category: "מנה · פסטה" },
  { name: "לזניה", aliases: ["לזניה"], calories: 165, protein: 9, fat: 8, category: "מנה · פסטה" },
  { name: "פתיתים מבושלים", aliases: ["פתיתים"], calories: 170, protein: 5, fat: 1.5, category: "פחמימה · תוספת" },
  { name: "קוסקוס מבושל", aliases: ["קוסקוס"], calories: 112, protein: 3.8, fat: 0.2, category: "פחמימה · תוספת" },
  { name: "בורגול מבושל", aliases: ["בורגול"], calories: 83, protein: 3.1, fat: 0.2, category: "פחמימה · תוספת" },
  { name: "קינואה מבושלת", aliases: ["קינואה"], calories: 120, protein: 4.4, fat: 1.9, category: "פחמימה · תוספת" },
  { name: "תפוח אדמה", aliases: ["תפוח אדמה", "תפוא", "תפוחי אדמה"], calories: 87, protein: 1.9, fat: 0.1, category: "פחמימה · ירק עמילני" },
  { name: "פירה", aliases: ["פירה"], calories: 110, protein: 2, fat: 4, category: "פחמימה · תוספת" },
  { name: "בטטה", aliases: ["בטטה"], calories: 86, protein: 1.6, fat: 0.1, category: "פחמימה · ירק עמילני" },
  { name: "צ׳יפס", aliases: ["ציפס", "צ׳יפס", "תפוחי אדמה מטוגנים"], calories: 312, protein: 3.4, fat: 15, category: "פחמימה · מטוגן" },
  { name: "נודלס", aliases: ["נודלס", "אטריות"], calories: 190, protein: 5, fat: 7, category: "פחמימה · אסייתי" },
  { name: "מוקפץ", aliases: ["מוקפץ", "מוקפץ עוף", "מוקפץ בקר", "מוקפץ ירקות"], calories: 170, protein: 8, fat: 6, category: "מנה עיקרית · אסייתי" },
  { name: "פאד תאי", aliases: ["פאד תאי", "פד תאי"], calories: 215, protein: 9, fat: 9, category: "מנה עיקרית · אסייתי" },
  { name: "ראמן", aliases: ["ראמן"], calories: 90, protein: 4, fat: 3, category: "מנה · מרק נודלס" },

  // לחמים ומאפים
  { name: "לחם לבן", aliases: ["לחם", "לחם לבן", "פרוסת לחם"], calories: 265, protein: 9, fat: 3.2, category: "פחמימה · לחם" },
  { name: "לחם מלא", aliases: ["לחם מלא"], calories: 247, protein: 13, fat: 4.2, category: "פחמימה · לחם" },
  { name: "פיתה", aliases: ["פיתה"], calories: 275, protein: 9, fat: 1.2, category: "פחמימה · לחם" },
  { name: "לאפה", aliases: ["לאפה"], calories: 290, protein: 8, fat: 4, category: "פחמימה · לחם" },
  { name: "באגט", aliases: ["באגט"], calories: 270, protein: 9, fat: 1.5, category: "פחמימה · לחם" },
  { name: "לחמניה", aliases: ["לחמניה", "לחמנייה"], calories: 270, protein: 8, fat: 4, category: "פחמימה · לחם" },
  { name: "טורטייה", aliases: ["טורטייה", "טורטיה", "ראפ"], calories: 310, protein: 8, fat: 8, category: "פחמימה · לחם" },
  { name: "חלה", aliases: ["חלה"], calories: 300, protein: 8, fat: 6, category: "פחמימה · לחם" },
  { name: "קרואסון", aliases: ["קרואסון"], calories: 406, protein: 8, fat: 21, category: "מאפה" },
  { name: "בורקס גבינה", aliases: ["בורקס", "בורקס גבינה"], calories: 330, protein: 9, fat: 20, category: "מאפה" },
  { name: "בורקס תפוח אדמה", aliases: ["בורקס תפוח אדמה", "בורקס תפו״א"], calories: 295, protein: 6, fat: 16, category: "מאפה" },
  { name: "מלאווח", aliases: ["מלאווח", "מלווח"], calories: 340, protein: 7, fat: 18, category: "מאפה" },
  { name: "ג׳חנון", aliases: ["ג׳חנון", "גחנון"], calories: 360, protein: 7, fat: 18, category: "מאפה" },
  { name: "פיצה", aliases: ["פיצה", "משולש פיצה", "פיצה מרגריטה", "פיצה פפרוני", "פיצה טונה", "פיצה פטריות", "פיצה זיתים", "פיצה אישית"], calories: 266, protein: 11, fat: 10, category: "מנה עיקרית · מאפה" },
  { name: "טוסט גבינה", aliases: ["טוסט", "טוסט גבינה"], calories: 285, protein: 12, fat: 13, category: "מנה · מאפה" },

  // ישראלי/רחוב/מנות נפוצות
  { name: "פלאפל", aliases: ["פלאפל", "כדור פלאפל", "פלאפל בצלחת"], calories: 333, protein: 13, fat: 18, category: "קטניות · מטוגן" },
  { name: "חומוס", aliases: ["חומוס", "חומוס גרגירים", "חומוס פול"], calories: 166, protein: 8, fat: 10, category: "קטניות · ממרח" },
  { name: "טחינה", aliases: ["טחינה"], calories: 595, protein: 17, fat: 53, category: "שומן · ממרח" },
  { name: "סביח", aliases: ["סביח"], calories: 230, protein: 7, fat: 12, category: "מנה · פיתה" },
  { name: "מרק עוף", aliases: ["מרק עוף"], calories: 45, protein: 4, fat: 2, category: "מרק" },
  { name: "מרק ירקות", aliases: ["מרק", "מרק ירקות"], calories: 35, protein: 1.5, fat: 1, category: "מרק" },

  // סושי ואסייתי
  { name: "סושי", aliases: ["סושי", "רול סושי", "אינסייד אאוט", "מאקי", "ניגירי", "קומבינציית סושי"], calories: 145, protein: 6, fat: 3, category: "מנה עיקרית · סושי" },
  { name: "סושי סלמון", aliases: ["סושי סלמון", "רול סלמון"], calories: 160, protein: 7, fat: 5, category: "מנה עיקרית · סושי" },
  { name: "סושי טמפורה", aliases: ["סושי טמפורה", "טמפורה"], calories: 230, protein: 6, fat: 10, category: "מנה עיקרית · סושי" },
  { name: "פוקי סלמון", aliases: ["פוקי", "פוקי סלמון", "פוקי טונה"], calories: 155, protein: 9, fat: 5, category: "מנה עיקרית · פוקי" },
  { name: "אדממה", aliases: ["אדממה"], calories: 121, protein: 11, fat: 5, category: "קטניות" },
  { name: "גיוזה", aliases: ["גיוזה"], calories: 230, protein: 9, fat: 10, category: "כיסונים" },

  // קטניות וירקות
  { name: "עדשים מבושלות", aliases: ["עדשים"], calories: 116, protein: 9, fat: 0.4, category: "קטניות" },
  { name: "שעועית מבושלת", aliases: ["שעועית", "שעועית לבנה", "שעועית אדומה"], calories: 127, protein: 8.7, fat: 0.5, category: "קטניות" },
  { name: "חומוס מבושל", aliases: ["חומוס מבושל", "גרגירי חומוס"], calories: 164, protein: 8.9, fat: 2.6, category: "קטניות" },
  { name: "סלט ירקות", aliases: ["סלט", "סלט ירקות", "ירקות"], calories: 25, protein: 1, fat: 0.2, category: "ירקות" },
  { name: "מלפפון", aliases: ["מלפפון"], calories: 15, protein: 0.7, fat: 0.1, category: "ירקות" },
  { name: "עגבניה", aliases: ["עגבניה", "עגבנייה"], calories: 18, protein: 0.9, fat: 0.2, category: "ירקות" },
  { name: "גזר", aliases: ["גזר"], calories: 41, protein: 0.9, fat: 0.2, category: "ירקות" },
  { name: "ברוקולי", aliases: ["ברוקולי"], calories: 35, protein: 2.4, fat: 0.4, category: "ירקות" },
  { name: "כרובית", aliases: ["כרובית"], calories: 25, protein: 1.9, fat: 0.3, category: "ירקות" },
  { name: "תירס", aliases: ["תירס"], calories: 96, protein: 3.4, fat: 1.5, category: "ירק עמילני" },
  { name: "אבוקדו", aliases: ["אבוקדו"], calories: 160, protein: 2, fat: 15, category: "שומן · פרי" },

  // חלב ומוצרים
  { name: "קוטג׳ 5%", aliases: ["קוטג", "קוטג׳", "קוטג 5", "קוטג׳ 5"], calories: 97, protein: 11, fat: 5, category: "חלבון · חלב" },
  { name: "גבינה לבנה 5%", aliases: ["גבינה לבנה", "גבינה לבנה 5"], calories: 95, protein: 9, fat: 5, category: "חלבון · חלב" },
  { name: "גבינה צהובה", aliases: ["גבינה צהובה"], calories: 350, protein: 25, fat: 27, category: "חלב · גבינה" },
  { name: "בולגרית/פטה", aliases: ["גבינה בולגרית", "בולגרית", "פטה"], calories: 265, protein: 14, fat: 21, category: "חלב · גבינה" },
  { name: "יוגורט טבעי", aliases: ["יוגורט", "יוגורט טבעי"], calories: 61, protein: 3.5, fat: 3.3, category: "חלב" },
  { name: "יוגורט חלבון", aliases: ["יוגורט חלבון", "מעדן חלבון", "פרו", "protein"], calories: 75, protein: 10, fat: 0.5, category: "חלבון · חלב" },
  { name: "מילקי", aliases: ["מילקי"], calories: 145, protein: 3, fat: 6, category: "מתוק · חלב" },
  { name: "חלב 3%", aliases: ["חלב", "חלב 3"], calories: 60, protein: 3.2, fat: 3, category: "שתייה · חלב" },
  { name: "שוקו", aliases: ["שוקו"], calories: 80, protein: 3.2, fat: 2, category: "שתייה · חלב" },
  { name: "חמאה", aliases: ["חמאה"], calories: 717, protein: 0.9, fat: 81, category: "שומן" },
  { name: "שמנת", aliases: ["שמנת"], calories: 200, protein: 3, fat: 20, category: "חלב · שומן" },
  { name: "אבקת חלבון", aliases: ["אבקת חלבון", "שייק חלבון"], calories: 390, protein: 78, fat: 6, category: "חלבון · אבקה" },

  // חטיפים ומתוקים
  { name: "שוקולד חלב", aliases: ["שוקולד", "שוקולד חלב"], calories: 535, protein: 7, fat: 30, category: "חטיף מתוק" },
  { name: "שוקולד מריר", aliases: ["שוקולד מריר"], calories: 600, protein: 8, fat: 43, category: "חטיף מתוק" },
  { name: "קינדר בואנו", aliases: ["קינדר בואנו", "bueno"], calories: 572, protein: 8.6, fat: 37, category: "חטיף מתוק" },
  { name: "קינדר שוקולד", aliases: ["קינדר שוקולד", "קינדר"], calories: 566, protein: 8.7, fat: 35, category: "חטיף מתוק" },
  { name: "קינדר ג׳וי", aliases: ["קינדר ג׳וי", "קינדר גוי"], calories: 560, protein: 7.5, fat: 35, category: "חטיף מתוק" },
  { name: "M&M", aliases: ["m&m", "M&M", "אמ אנד אמ", "אם אנד אם"], calories: 492, protein: 4.3, fat: 20, category: "חטיף מתוק" },
  { name: "M&M בוטנים", aliases: ["m&m בוטנים", "M&M בוטנים", "אמ אנד אמ בוטנים"], calories: 515, protein: 9.6, fat: 26, category: "חטיף מתוק" },
  { name: "סניקרס", aliases: ["סניקרס", "snickers"], calories: 488, protein: 8, fat: 24, category: "חטיף מתוק" },
  { name: "טוויקס", aliases: ["טוויקס", "twix"], calories: 502, protein: 4.9, fat: 24, category: "חטיף מתוק" },
  { name: "מארס", aliases: ["מארס", "mars"], calories: 449, protein: 4.4, fat: 17, category: "חטיף מתוק" },
  { name: "קיטקט", aliases: ["קיטקט", "kitkat"], calories: 518, protein: 6.5, fat: 26, category: "חטיף מתוק" },
  { name: "אוראו", aliases: ["אוראו", "oreo"], calories: 480, protein: 5, fat: 20, category: "עוגיות" },
  { name: "נוטלה", aliases: ["נוטלה", "nutella"], calories: 539, protein: 6.3, fat: 31, category: "ממרח מתוק" },
  { name: "פסק זמן", aliases: ["פסק זמן"], calories: 530, protein: 7, fat: 30, category: "חטיף מתוק" },
  { name: "כיף כף", aliases: ["כיף כף", "כיףכף"], calories: 515, protein: 7, fat: 28, category: "חטיף מתוק" },
  { name: "קליק", aliases: ["קליק"], calories: 520, protein: 7, fat: 29, category: "חטיף מתוק" },
  { name: "קרמבו", aliases: ["קרמבו"], calories: 340, protein: 3, fat: 10, category: "חטיף מתוק" },
  { name: "גלידה", aliases: ["גלידה", "ארטיק", "מגנום", "קורנטו"], calories: 207, protein: 3.5, fat: 11, category: "מתוק" },

  // חטיפים מלוחים ואגוזים
  { name: "במבה", aliases: ["במבה"], calories: 536, protein: 17, fat: 34, category: "חטיף מלוח" },
  { name: "במבה נוגט", aliases: ["במבה נוגט"], calories: 520, protein: 10, fat: 30, category: "חטיף מתוק" },
  { name: "ביסלי", aliases: ["ביסלי"], calories: 500, protein: 9, fat: 24, category: "חטיף מלוח" },
  { name: "דוריטוס", aliases: ["דוריטוס"], calories: 500, protein: 7, fat: 25, category: "חטיף מלוח" },
  { name: "תפוצ׳יפס", aliases: ["תפוציפס", "תפוצ׳יפס", "ציפס שקית"], calories: 536, protein: 7, fat: 35, category: "חטיף מלוח" },
  { name: "פרינגלס", aliases: ["פרינגלס"], calories: 536, protein: 6, fat: 34, category: "חטיף מלוח" },
  { name: "בייגלה", aliases: ["בייגלה", "ביגלה"], calories: 380, protein: 10, fat: 4, category: "חטיף מלוח" },
  { name: "פופקורן", aliases: ["פופקורן"], calories: 380, protein: 12, fat: 4, category: "חטיף" },
  { name: "גרעינים", aliases: ["גרעינים", "גרעיני חמניה"], calories: 584, protein: 21, fat: 51, category: "אגוזים וזרעים" },
  { name: "שקדים", aliases: ["שקדים"], calories: 579, protein: 21, fat: 50, category: "אגוזים" },
  { name: "קשיו", aliases: ["קשיו"], calories: 553, protein: 18, fat: 44, category: "אגוזים" },
  { name: "אגוזים", aliases: ["אגוזים", "אגוזי מלך"], calories: 654, protein: 15, fat: 65, category: "אגוזים" },
  { name: "חמאת בוטנים", aliases: ["חמאת בוטנים"], calories: 588, protein: 25, fat: 50, category: "ממרח" },
  { name: "חטיף חלבון", aliases: ["חטיף חלבון"], calories: 360, protein: 30, fat: 12, category: "חלבון · חטיף" },
  { name: "גרנולה", aliases: ["גרנולה"], calories: 471, protein: 10, fat: 20, category: "דגנים" },
  { name: "קורנפלקס", aliases: ["קורנפלקס", "דגני בוקר"], calories: 370, protein: 7, fat: 1.5, category: "דגנים" },

  // פירות
  { name: "בננה", aliases: ["בננה"], calories: 89, protein: 1.1, fat: 0.3, category: "פרי" },
  { name: "תפוח", aliases: ["תפוח", "תפוח עץ"], calories: 52, protein: 0.3, fat: 0.2, category: "פרי" },
  { name: "תפוז", aliases: ["תפוז"], calories: 47, protein: 0.9, fat: 0.1, category: "פרי" },
  { name: "ענבים", aliases: ["ענבים"], calories: 69, protein: 0.7, fat: 0.2, category: "פרי" },
  { name: "אבטיח", aliases: ["אבטיח"], calories: 30, protein: 0.6, fat: 0.2, category: "פרי" },
  { name: "מלון", aliases: ["מלון"], calories: 34, protein: 0.8, fat: 0.2, category: "פרי" },
  { name: "תותים", aliases: ["תותים", "תות"], calories: 32, protein: 0.7, fat: 0.3, category: "פרי" },
  { name: "מנגו", aliases: ["מנגו"], calories: 60, protein: 0.8, fat: 0.4, category: "פרי" },
  { name: "אננס", aliases: ["אננס"], calories: 50, protein: 0.5, fat: 0.1, category: "פרי" },
  { name: "אפרסק", aliases: ["אפרסק"], calories: 39, protein: 0.9, fat: 0.3, category: "פרי" },
  { name: "אגס", aliases: ["אגס"], calories: 57, protein: 0.4, fat: 0.1, category: "פרי" },
  { name: "תמר", aliases: ["תמר", "תמרים"], calories: 282, protein: 2.5, fat: 0.4, category: "פרי יבש" },
  { name: "צימוקים", aliases: ["צימוקים"], calories: 299, protein: 3.1, fat: 0.5, category: "פרי יבש" },

  // שתייה ורטבים
  { name: "קולה", aliases: ["קולה", "קוקה קולה"], calories: 42, protein: 0, fat: 0, category: "שתייה מתוקה" },
  { name: "קולה זירו", aliases: ["זירו", "קולה זירו"], calories: 0, protein: 0, fat: 0, category: "שתייה" },
  { name: "מיץ תפוזים", aliases: ["מיץ", "מיץ תפוזים", "תפוזים סחוט"], calories: 45, protein: 0.7, fat: 0.2, category: "שתייה מתוקה" },
  { name: "מיץ ענבים", aliases: ["מיץ ענבים", "תירוש"], calories: 60, protein: 0.3, fat: 0.1, category: "שתייה מתוקה" },
  { name: "בירה", aliases: ["בירה"], calories: 43, protein: 0.5, fat: 0, category: "שתייה אלכוהולית" },
  { name: "שמן זית", aliases: ["שמן", "שמן זית"], calories: 884, protein: 0, fat: 100, category: "שומן" },
  { name: "מיונז", aliases: ["מיונז"], calories: 680, protein: 1, fat: 75, category: "רוטב" },
  { name: "קטשופ", aliases: ["קטשופ"], calories: 112, protein: 1.3, fat: 0.1, category: "רוטב" },
  { name: "רוטב צ׳ילי", aliases: ["רוטב צילי", "רוטב צ׳ילי", "צילי מתוק", "צ׳ילי מתוק"], calories: 220, protein: 0.5, fat: 0.5, category: "רוטב" },
];

const CALORIE_SUGGESTIONS = Array.from(new Set(CALORIE_DATABASE.flatMap((item) => [item.name, ...(item.aliases || [])])));

function getCalorieDatabaseMatch(name) {
  const cleanedName = cleanFoodName(name);
  const normalized = normalizeFoodText(cleanedName || name);
  if (!normalized) return null;

  const rows = CALORIE_DATABASE.flatMap((item) =>
    [item.name, ...(item.aliases || [])].map((alias) => ({
      item,
      alias,
      normalizedAlias: normalizeFoodText(alias),
    }))
  ).filter((row) => row.normalizedAlias);

  const exact = rows
    .filter((row) => normalized === row.normalizedAlias)
    .sort((a, b) => b.normalizedAlias.length - a.normalizedAlias.length);
  if (exact.length) return exact[0].item;

  const wordMatch = rows
    .filter((row) => normalizedFoodContainsPhrase(normalized, row.normalizedAlias))
    .sort((a, b) => b.normalizedAlias.length - a.normalizedAlias.length);
  if (wordMatch.length) return wordMatch[0].item;

  // התאמה הפוכה רק לביטויים ארוכים יחסית, כדי ש"ענבים" לא ייתפס כ"מיץ ענבים".
  const reverseMatch = rows
    .filter((row) => normalized.length >= 4 && row.normalizedAlias.length >= 4 && normalizedFoodContainsPhrase(row.normalizedAlias, normalized))
    .sort((a, b) => {
      const aPenalty = a.normalizedAlias.length - normalized.length;
      const bPenalty = b.normalizedAlias.length - normalized.length;
      return aPenalty - bPenalty || b.normalizedAlias.length - a.normalizedAlias.length;
    });
  return reverseMatch[0]?.item || null;
}

function calculateNutritionFromPer100(item, grams) {
  if (!item || !grams || grams <= 0) return null;
  const factor = grams / 100;
  return {
    calories: Math.round((Number(item.calories) || 0) * factor),
    protein: roundOne((Number(item.protein) || 0) * factor),
    fat: roundOne((Number(item.fat) || 0) * factor),
  };
}

function getAutoNutritionEstimate(rawName, gramsInput, savedFoods = []) {
  const grams = getFoodGrams(rawName, gramsInput);
  const savedMatch = getSavedFoodMatch(savedFoods, rawName);
  if (savedMatch && savedMatch.per100 && grams) {
    const values = calculateNutritionFromPer100(savedMatch.per100, grams);
    if (values) {
      return { ...values, grams, sourceName: savedMatch.name, category: savedMatch.category || "ספר מוצרים", note: `חושב לפי ${savedMatch.name} מספר המוצרים (${grams} גרם).` };
    }
  }

  const dbMatch = getCalorieDatabaseMatch(rawName);
  if (dbMatch && grams) {
    const values = calculateNutritionFromPer100(dbMatch, grams);
    return { ...values, grams, sourceName: dbMatch.name, category: dbMatch.category, note: `חושב לפי ממוצע ל-100 גרם: ${dbMatch.name}. אפשר לערוך לפני שמירה.` };
  }
  return null;
}

function buildAutoFoodFormPatch(rawName, gramsInput, savedFoods = []) {
  const raw = String(rawName || "").trim();
  const cleaned = cleanFoodName(raw) || raw;
  const grams = getFoodGrams(raw, gramsInput);
  if (!cleaned) return { autoNote: "" };

  const autoEstimate = getAutoNutritionEstimate(raw, gramsInput, savedFoods);
  if (autoEstimate) {
    return {
      grams: autoEstimate.grams ? String(autoEstimate.grams) : String(gramsInput || ""),
      calories: String(autoEstimate.calories ?? ""),
      protein: String(autoEstimate.protein ?? ""),
      fat: String(autoEstimate.fat ?? ""),
      autoNote: autoEstimate.note,
    };
  }

  const savedMatch = getSavedFoodMatch(savedFoods, raw);
  if (savedMatch) {
    if (hasFoodNutrition(savedMatch)) {
      return {
        calories: String(savedMatch.calories ?? ""),
        protein: String(savedMatch.protein ?? ""),
        fat: String(savedMatch.fat ?? ""),
        autoNote: `זוהה מוצר שמור בספר: ${savedMatch.name}. הפרטים מולאו אוטומטית, ואפשר לערוך לפני שמירה.`,
      };
    }
    return { autoNote: `זוהה מוצר שמור בספר: ${savedMatch.name}. חסרים לו ערכים, אפשר לעדכן אותו בספר המוצרים.` };
  }

  const calorieDbMatch = getCalorieDatabaseMatch(raw);
  if (calorieDbMatch) {
    return { autoNote: `זוהה במאגר הקלוריות: ${calorieDbMatch.name}. כתוב כמה גרם כדי שאחשב אוטומטית קלוריות, חלבון ושומן.` };
  }

  const profileMatch = getFoodProfileMatch(raw);
  if (profileMatch) {
    return { autoNote: `זוהה: ${profileMatch.name} · ${profileMatch.category}. אין חישוב מספרי למאכל הזה כרגע; אפשר להזין ידנית או לשמור בספר מוצרים.` };
  }

  const suggestionMatch = getFoodSuggestionMatch(raw);
  if (suggestionMatch) {
    return { autoNote: `זוהה מאכל מהרשימה: ${suggestionMatch}. אם אין חישוב אוטומטי, הזן ידנית פעם אחת ושמור בספר מוצרים.` };
  }

  return { autoNote: "מאכל לא מוכר במאגר. אפשר להזין ידנית ולשמור בספר מוצרים לפעם הבאה." };
}


const COMMON_FOOD_PROFILES = [
  { name: "שווארמה", aliases: ["שווארמה", "שווארמה בפיתה", "שווארמה בלאפה", "שווארמה בצלחת", "שווארמה בבאגט"], category: "מנה עיקרית · בשר", portionHint: "פיתה / לאפה / צלחת / גרמים", tip: "כדאי לרשום גם רטבים, צ׳יפס ותוספות אם היו." },
  { name: "פיצה", aliases: ["פיצה", "משולש פיצה", "פיצה משפחתית", "פיצה אישית", "פיצה מרגריטה", "פיצה פפרוני", "פיצה טונה", "פיצה פטריות", "פיצה זיתים"], category: "מנה עיקרית · מאפה", portionHint: "מספר משולשים / פיצה אישית", tip: "תוספות וגבינה כפולה משנות את הערך התזונתי." },
  { name: "סושי", aliases: ["סושי", "רול סושי", "סושי סלמון", "סושי טונה", "סושי צמחוני", "ניגירי", "מאקי", "אינסייד אאוט", "קומבינציית סושי"], category: "מנה עיקרית · דגים/אורז", portionHint: "רולים / יחידות / קומבינציה", tip: "רוטבים, טמפורה ומיונז משנים מאוד." },
  { name: "בולונז", aliases: ["בולונז", "פסטה בולונז", "ספגטי בולונז", "רוטב בולונז"], category: "מנה עיקרית · פסטה ובשר", portionHint: "צלחת / גרמים / קופסה", tip: "אפשר לרשום בנפרד אם זו מנה עם הרבה רוטב או גבינה." },
  { name: "עוף בקארי", aliases: ["עוף בקארי", "קארי עוף", "עוף קארי", "עוף קארי עם אורז", "קארי ירוק", "קארי אדום", "קארי תאילנדי", "עוף במסאלה", "עוף טיקה", "צ׳יקן טיקה", "עוף חמאה"], category: "מנה עיקרית · עוף ורוטב", portionHint: "צלחת / גרמים / עם אורז", tip: "רוטב קוקוס/שמנת ואורז בצד משנים את המנה." },
  { name: "המבורגר", aliases: ["המבורגר", "צ׳יזבורגר", "בורגר", "המבורגר כפול"], category: "מנה עיקרית · בשר", portionHint: "יחידה / כפול / עם צ׳יפס", tip: "כדאי לציין רטבים, גבינה וצ׳יפס אם היו." },
  { name: "פלאפל", aliases: ["פלאפל", "פלאפל בפיתה", "פלאפל בצלחת"], category: "מנה עיקרית · קטניות", portionHint: "פיתה / צלחת / כדורים", tip: "טחינה, צ׳יפס וסלטים יכולים לשנות את המנה." },
  { name: "שניצל", aliases: ["שניצל", "שניצלונים", "שניצל בבאגט", "שניצל בפיתה"], category: "מנה עיקרית · עוף", portionHint: "יחידות / גרמים / בבאגט", tip: "לחם, רטבים ותוספת בצד חשובים לרישום מדויק יותר." },
  { name: "חזה עוף", aliases: ["חזה עוף", "חזה עוף על האש", "עוף", "פרגית", "פרגית בפיתה", "פרגית בלאפה"], category: "חלבון · עוף", portionHint: "גרמים / חתיכות / מנה", tip: "שיטת בישול, שמן ורוטב יכולים לשנות." },
  { name: "סטייק", aliases: ["סטייק", "אנטריקוט", "סינטה", "אסאדו", "צלי בקר", "בקר", "בשר טחון", "כדורי בשר", "קציצות", "גולאש"], category: "חלבון · בשר", portionHint: "גרמים / חתיכות / מנה", tip: "אחוז שומן ורוטב משפיעים מאוד." },
  { name: "טונה", aliases: ["טונה", "סלט טונה", "טונה במים", "טונה בשמן"], category: "חלבון · דגים", portionHint: "קופסה / גרמים / סלט", tip: "כדאי לציין מים/שמן ותוספות." },
  { name: "סלמון", aliases: ["סלמון", "דג סלמון", "דג", "אמנון", "דג לבן", "דניס", "נסיכת הנילוס"], category: "חלבון · דגים", portionHint: "פילה / גרמים / מנה", tip: "אופן הכנה ורוטב משנים." },
  { name: "ביצים", aliases: ["ביצה", "ביצים", "חביתה", "מקושקשת", "שקשוקה"], category: "חלבון · ביצים", portionHint: "מספר ביצים / מנה", tip: "שמן, גבינה ולחם ליד משנים את הרישום." },
  { name: "מוקפץ", aliases: ["מוקפץ", "מוקפץ עוף", "מוקפץ בקר", "מוקפץ ירקות", "נודלס", "פאד תאי", "אורז מוקפץ", "עוף טריאקי", "עוף חמוץ מתוק"], category: "מנה עיקרית · אסייתי", portionHint: "צלחת / קופסה / גרמים", tip: "רוטב, שמן וכמות נודלס/אורז משנים מאוד." },
  { name: "פסטה", aliases: ["פסטה", "פסטה פסטו", "פסטה עגבניות", "פסטה שמנת", "פסטה אלפרדו", "פסטה רוזה", "פסטה טונה", "פסטה עוף", "לזניה", "רביולי", "ניוקי"], category: "פחמימה · פסטה", portionHint: "צלחת / גרמים / קופסה", tip: "רוטב שמנת/גבינה/שמן משנה את המנה." },
  { name: "אורז", aliases: ["אורז", "אורז לבן", "אורז מלא", "אורז עם עוף", "אורז סושי"], category: "פחמימה · תוספת", portionHint: "כפות / כוס / גרמים", tip: "כדאי לציין אם זו תוספת או חלק ממנה." },
  { name: "פתיתים וקוסקוס", aliases: ["פתיתים", "קוסקוס", "בורגול", "קינואה"], category: "פחמימה · תוספת", portionHint: "כוס / כפות / גרמים", tip: "רוטב/שמן יכול לשנות." },
  { name: "לחם ומאפים", aliases: ["פיתה", "לאפה", "באגט", "לחם", "לחמניה", "חלה", "טורטייה", "ראפ", "פוקאצ׳ה", "בורקס", "בורקס גבינה", "בורקס תפוח אדמה", "מלאווח", "ג׳חנון", "קרואסון", "מאפה גבינה"], category: "פחמימה · מאפה", portionHint: "יחידה / פרוסות / חצי מנה", tip: "מילוי ותוספות חשובים." },
  { name: "חומוס וטחינה", aliases: ["חומוס", "חומוס גרגירים", "חומוס פול", "טחינה", "סביח"], category: "מנה/תוספת · קטניות ושומן", portionHint: "צלחת / כפות / פיתה", tip: "שמן, ביצה ופיתה ליד משנים." },
  { name: "סלט", aliases: ["סלט", "סלט ירקות", "סלט יווני", "סלט עוף", "ירקות", "מלפפון", "עגבניה", "פלפל", "חסה", "כרוב", "גזר", "ברוקולי", "כרובית", "שעועית ירוקה"], category: "ירקות", portionHint: "קערה / צלחת / גרמים", tip: "רוטב, שמן, גבינות וקרוטונים משנים." },
  { name: "מוצרי חלב", aliases: ["קוטג׳", "גבינה לבנה", "גבינה צהובה", "גבינה בולגרית", "פטה", "יוגורט", "יוגורט חלבון", "מעדן חלבון", "מילקי", "חלב", "שוקו", "סקי", "שמנת"], category: "חלבון/חלב", portionHint: "גביע / פרוסות / גרמים", tip: "אחוז שומן וגודל גביע חשובים." },
  { name: "אבקת חלבון", aliases: ["אבקת חלבון", "שייק חלבון", "משקה חלבון", "חטיף חלבון"], category: "חלבון · מוצר", portionHint: "סקופים / יחידה / בקבוק", tip: "במוצרים כאלה הכי טוב לשמור פעם אחת בספר מוצרים." },
  { name: "שוקולדים וחטיפים מתוקים", aliases: ["קינדר בואנו", "קינדר שוקולד", "קינדר ג׳וי", "קינדר קאנטרי", "M&M", "M&M בוטנים", "M&M שוקולד", "סניקרס", "טוויקס", "מארס", "קיטקט", "אוראו", "נוטלה", "פסק זמן", "כיף כף", "קליק", "טורטית", "שוקולד", "שוקולד חלב", "שוקולד מריר", "קרמבו"], category: "חטיף מתוק", portionHint: "יחידה / חטיף / גרמים / חופן", tip: "במוצרים ארוזים כדאי לשמור את הערכים מהאריזה בספר מוצרים." },
  { name: "חטיפים מלוחים", aliases: ["במבה", "במבה נוגט", "ביסלי", "דוריטוס", "תפוצ׳יפס", "פרינגלס", "בייגלה", "פופקורן", "גרעינים"], category: "חטיף מלוח", portionHint: "שקית / חופן / גרמים", tip: "גודל שקית משתנה מאוד." },
  { name: "אגוזים", aliases: ["אגוזים", "שקדים", "קשיו", "חמאת בוטנים"], category: "שומן · נשנוש", portionHint: "חופן / כפות / גרמים", tip: "כמות קטנה יכולה להיות משמעותית, אז כדאי לרשום כמות." },
  { name: "פירות", aliases: ["בננה", "תפוח", "תפוז", "ענבים", "אבטיח", "מלון", "תותים", "מנגו", "אננס", "אפרסק", "אגס", "תמרים", "צימוקים", "אבוקדו"], category: "פרי", portionHint: "יחידה / פרוסות / חופן / גרמים", tip: "פירות יבשים ואבוקדו שונים מפירות רגילים." },
  { name: "שתייה", aliases: ["קפה", "נס קפה", "קפה שחור", "תה", "מיץ", "קולה", "זירו", "מים", "סודה"], category: "שתייה", portionHint: "כוס / בקבוק / פחית", tip: "שתייה מתוקה כדאי לרשום בנפרד מהמים." },
];

function getFoodProfileMatch(name) {
  const cleanedName = cleanFoodName(name);
  const normalized = normalizeFoodText(cleanedName || name);
  if (!normalized) return null;
  return COMMON_FOOD_PROFILES.find((profile) =>
    profile.aliases.some((alias) => {
      const normAlias = normalizeFoodText(alias);
      return normAlias && (normalized.includes(normAlias) || normAlias.includes(normalized));
    })
  ) || null;
}

function getFoodProfileLabel(entry) {
  if (!entry) return "";
  return entry.category || entry.profileName || "";
}

function getTaskStatus(task) {
  return task.status || (task.done ? "done" : "not_done");
}

function isTaskDone(task) {
  return getTaskStatus(task) === "done";
}

function getTaskPriority(task) {
  return task.priority || "normal";
}

function normalizeFoodText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[״"']/g, "")
    .replace(/[׳`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizedFoodContainsPhrase(text, phrase) {
  const haystack = ` ${normalizeFoodText(text)} `;
  const needle = ` ${normalizeFoodText(phrase)} `;
  return needle.trim() && haystack.includes(needle);
}

function numberFromInput(value) {
  const num = parseFloat(String(value || "").replace(",", "."));
  return Number.isFinite(num) ? num : null;
}

function extractGramsFromName(name) {
  const match = String(name || "").match(/(\d+(?:[.,]\d+)?)\s*(גרם|גר׳|גר|ג׳|ג'|g)/i);
  return match ? numberFromInput(match[1]) : null;
}

function cleanFoodName(name) {
  return String(name || "")
    .replace(/(\d+(?:[.,]\d+)?)\s*(גרם|גר׳|גר|ג׳|ג'|g)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getFoodGrams(name, gramsInput) {
  return numberFromInput(gramsInput) || extractGramsFromName(name);
}

function roundOne(num) {
  return Math.round(num * 10) / 10;
}

function hasFoodNutrition(food) {
  return food && food.hasNutrition !== false && (
    Number.isFinite(Number(food.calories)) ||
    Number.isFinite(Number(food.protein)) ||
    Number.isFinite(Number(food.fat))
  );
}

function formatFoodNutrition(food) {
  if (!hasFoodNutrition(food)) return "נשמר ללא פרטים מספריים";
  const calories = Number(food.calories) || 0;
  const protein = Number(food.protein) || 0;
  const fat = Number(food.fat) || 0;
  return `${calories} קל׳ · ${protein} ג חלבון · ${fat} ג שומן`;
}


function getFoodSuggestionMatch(name) {
  const cleanedName = cleanFoodName(name);
  const normalized = normalizeFoodText(cleanedName || name);
  if (!normalized) return null;
  const exact = FOOD_SUGGESTIONS.find((item) => normalizeFoodText(item) === normalized);
  if (exact) return exact;
  return FOOD_SUGGESTIONS
    .filter((item) => normalizedFoodContainsPhrase(normalized, item))
    .sort((a, b) => normalizeFoodText(b).length - normalizeFoodText(a).length)[0] || null;
}

function getSavedFoodMatch(savedFoods, name) {
  const cleanedName = cleanFoodName(name);
  const normalized = normalizeFoodText(cleanedName || name);
  if (!normalized) return null;

  const rows = savedFoods
    .map((item) => ({ item, productName: normalizeFoodText(item.name) }))
    .filter((row) => row.productName);

  const exact = rows.find((row) => row.productName === normalized);
  if (exact) return exact.item;

  const wordMatch = rows
    .filter((row) => normalizedFoodContainsPhrase(normalized, row.productName))
    .sort((a, b) => b.productName.length - a.productName.length);
  return wordMatch[0]?.item || null;
}

function getDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatHebrewDate(d = new Date()) {
  const days = ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "שבת"];
  const months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
  return `${days[d.getDay()]}, ${d.getDate()} ב${months[d.getMonth()]}`;
}

function formatShortDate(dateStr) {
  // dateStr: YYYY-MM-DD
  const [y, m, d] = dateStr.split("-");
  return `${d}.${m}`;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

async function loadKey(key, fallback) {
  try {
    const res = await window.storage.get(key, false);
    if (res && res.value) return JSON.parse(res.value);
    return fallback;
  } catch (e) {
    return fallback;
  }
}

async function saveKey(key, value) {
  try {
    await window.storage.set(key, JSON.stringify(value), false);
  } catch (e) {
    console.error("שמירה נכשלה", e);
  }
}


async function addDateToHistory(date) {
  const dates = await loadKey("dailyHistoryDates", []);
  if (!dates.includes(date)) {
    const next = [...dates, date].sort((a, b) => b.localeCompare(a));
    await saveKey("dailyHistoryDates", next);
    return next;
  }
  return dates;
}

async function loadHistoryRows(dates) {
  const rows = await Promise.all(
    dates.map(async (date) => {
      const food = await loadKey(`food:${date}`, []);
      const water = await loadKey(`water:${date}`, []);
      const totals = food.reduce(
        (acc, f) => ({
          calories: acc.calories + (Number(f.calories) || 0),
          protein: acc.protein + (Number(f.protein) || 0),
          fat: acc.fat + (Number(f.fat) || 0),
        }),
        { calories: 0, protein: 0, fat: 0 }
      );
      const totalWater = water.reduce((sum, w) => sum + (Number(w.amount) || 0), 0);
      return { date, food, water, totals, totalWater };
    })
  );
  return rows.filter((row) => row.food.length > 0 || row.water.length > 0);
}


const DEFAULT_USER_HEIGHT_CM = 180;

const MEAL_TEMPLATES = [
  { name: "ארוחת בוקר חלבון", grams: 350, calories: 430, protein: 35, fat: 14, category: "בוקר", note: "יוגורט/ביצים/גבינה + פחמימה קלה" },
  { name: "שייק חלבון", grams: 500, calories: 360, protein: 42, fat: 7, category: "חלבון", note: "אבקת חלבון + חלב/מים" },
  { name: "חזה עוף עם אורז", grams: 450, calories: 620, protein: 50, fat: 12, category: "צהריים", note: "מנה קלאסית" },
  { name: "פסטה בולונז", grams: 400, calories: 660, protein: 28, fat: 22, category: "ארוחה", note: "צלחת ממוצעת" },
  { name: "עוף בקארי עם אורז", grams: 450, calories: 720, protein: 36, fat: 24, category: "ארוחה", note: "קארי + אורז" },
  { name: "פיצה 2 משולשים", grams: 240, calories: 640, protein: 27, fat: 24, category: "בחוץ", note: "שני משולשים ממוצעים" },
  { name: "שווארמה בלאפה", grams: 450, calories: 950, protein: 45, fat: 42, category: "בחוץ", note: "כולל לאפה ורטבים ממוצעים" },
  { name: "סושי קומבינציה", grams: 350, calories: 520, protein: 23, fat: 12, category: "בחוץ", note: "קומבינציה רגילה" },
  { name: "קינדר בואנו", grams: 43, calories: 240, protein: 4, fat: 16, category: "מתוק", note: "חטיף אחד" },
  { name: "M&M חופן", grams: 45, calories: 220, protein: 3, fat: 9, category: "מתוק", note: "חופן קטן" },
  { name: "עוגת שוקולד פרוסה", grams: 100, calories: 390, protein: 5, fat: 19, category: "עוגה", note: "פרוסה ממוצעת" },
  { name: "עוגת גבינה פרוסה", grams: 100, calories: 320, protein: 7, fat: 18, category: "עוגה", note: "פרוסה ממוצעת" },
  { name: "עוגת שמרים שוקולד", grams: 100, calories: 410, protein: 6, fat: 17, category: "עוגה", note: "חתיכה ממוצעת" },
  { name: "עוגת גזר פרוסה", grams: 100, calories: 360, protein: 5, fat: 16, category: "עוגה", note: "כולל ציפוי ממוצע" },
];

function clampPct(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function safeNum(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function formatKg(value) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return "—";
  return `${roundOne(Number(value))} ק״ג`;
}

function getBmiInfo(weight, heightCm = DEFAULT_USER_HEIGHT_CM) {
  const w = Number(weight);
  const cm = Number(heightCm);
  if (!Number.isFinite(w) || w <= 0 || !Number.isFinite(cm) || cm <= 0) return null;
  const heightM = cm / 100;
  const bmi = w / (heightM * heightM);
  let label = "תקין";
  if (bmi < 18.5) label = "נמוך";
  else if (bmi < 25) label = "תקין";
  else if (bmi < 30) label = "עודף";
  else label = "גבוה";
  return { bmi: roundOne(bmi), label };
}

function buildWeightStats(weightEntries = [], heightCm = DEFAULT_USER_HEIGHT_CM) {
  const sorted = weightEntries.slice().filter((w) => Number.isFinite(Number(w.weight))).sort((a, b) => a.date.localeCompare(b.date));
  if (!sorted.length) return { latest: null, previous: null, first: null, changeFromPrev: null, totalChange: null, bmi: null, points: "" };
  const latest = sorted[sorted.length - 1];
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;
  const first = sorted[0];
  const changeFromPrev = previous ? roundOne(Number(latest.weight) - Number(previous.weight)) : null;
  const totalChange = sorted.length > 1 ? roundOne(Number(latest.weight) - Number(first.weight)) : null;
  const points = makeTrendPoints(sorted.slice(-8).map((w) => w.weight));
  return { latest, previous, first, changeFromPrev, totalChange, bmi: getBmiInfo(Number(latest.weight), heightCm), points };
}

function buildTaskStats(tasks = []) {
  const open = tasks.filter((t) => !isTaskDone(t));
  const done = tasks.filter((t) => isTaskDone(t));
  const today = getDateKey();
  const dueToday = open.filter((t) => t.due?.date === today);
  const overdue = open.filter((t) => isOverdue(t.due));
  const high = open.filter((t) => (t.priority || "normal") === "high");
  const completionPct = tasks.length ? clampPct((done.length / tasks.length) * 100) : 0;
  return { open: open.length, done: done.length, dueToday: dueToday.length, overdue: overdue.length, high: high.length, completionPct };
}

function makeTrendPoints(values, width = 180, height = 58, pad = 6) {
  const clean = values.map(Number).filter(Number.isFinite);
  if (!clean.length) return "";
  if (clean.length === 1) return `${pad},${height / 2}`;
  const min = Math.min(...clean);
  const max = Math.max(...clean);
  const range = max - min || 1;
  return clean.map((v, i) => {
    const x = pad + (i * (width - pad * 2)) / (clean.length - 1);
    const y = pad + ((max - v) * (height - pad * 2)) / range;
    return `${roundOne(x)},${roundOne(y)}`;
  }).join(" ");
}

function getFoodQualityScore(totals, calorieGoal, totalWater, waterGoal) {
  const caloriePct = calorieGoal ? (safeNum(totals.calories) / calorieGoal) * 100 : 0;
  const protein = safeNum(totals.protein);
  const waterPct = waterGoal ? (safeNum(totalWater) / waterGoal) * 100 : 0;
  let score = 0;
  if (caloriePct > 65 && caloriePct <= 105) score += 35;
  else if (caloriePct > 0 && caloriePct <= 120) score += 22;
  if (protein >= 120) score += 35;
  else if (protein >= 80) score += 25;
  else if (protein >= 40) score += 15;
  if (waterPct >= 100) score += 30;
  else if (waterPct >= 75) score += 22;
  else if (waterPct >= 50) score += 12;
  return clampPct(score);
}


export default function DayBoard() {
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [dateKey, setDateKey] = useState(getDateKey());

  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("normal");
  const [taskFilter, setTaskFilter] = useState("open");
  const [showDueFields, setShowDueFields] = useState(false);
  const [dueDateInput, setDueDateInput] = useState("");
  const [dueTimeInput, setDueTimeInput] = useState("");

  const [foodEntries, setFoodEntries] = useState([]);
  const [foodForm, setFoodForm] = useState({ name: "", grams: "", calories: "", protein: "", fat: "", autoNote: "", imageData: "", imageSource: "" });
  const [nutritionSubTab, setNutritionSubTab] = useState("log");
  const [savedFoods, setSavedFoods] = useState([]);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showLibraryForm, setShowLibraryForm] = useState(false);
  const [libraryForm, setLibraryForm] = useState({ name: "", grams: "100", calories: "", protein: "", fat: "", imageData: "" });
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateSearch, setTemplateSearch] = useState("");

  const [waterEntries, setWaterEntries] = useState([]);
  const [customWater, setCustomWater] = useState("");
  const [dailyWaterGoal, setDailyWaterGoal] = useState(DEFAULT_WATER_GOAL);
  const [waterGoalInput, setWaterGoalInput] = useState(String(DEFAULT_WATER_GOAL));
  const [isEditingWaterGoal, setIsEditingWaterGoal] = useState(false);

  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(DEFAULT_CALORIE_GOAL);
  const [calorieGoalInput, setCalorieGoalInput] = useState(String(DEFAULT_CALORIE_GOAL));
  const [isEditingCalorieGoal, setIsEditingCalorieGoal] = useState(false);

  const [historyRows, setHistoryRows] = useState([]);

  const [weightEntries, setWeightEntries] = useState([]);
  const [weightDate, setWeightDate] = useState(getDateKey());
  const [weightValue, setWeightValue] = useState("");
  const [userHeightCm, setUserHeightCm] = useState(DEFAULT_USER_HEIGHT_CM);
  const [heightInput, setHeightInput] = useState(String(DEFAULT_USER_HEIGHT_CM));
  const [isEditingHeight, setIsEditingHeight] = useState(false);

  const dateKeyRef = useRef(dateKey);
  dateKeyRef.current = dateKey;

  useEffect(() => {
    setFoodForm((prev) => {
      const patch = buildAutoFoodFormPatch(prev.name, prev.grams, savedFoods);
      const extractedGrams = extractGramsFromName(prev.name);
      const next = {
        ...prev,
        ...patch,
        grams: patch.grams || prev.grams || (extractedGrams ? String(extractedGrams) : prev.grams),
      };
      return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
    });
  }, [foodForm.name, foodForm.grams, savedFoods]);

  // initial load
  useEffect(() => {
    (async () => {
      const t = await loadKey("tasks", []);
      const f = await loadKey(`food:${dateKey}`, []);
      const w = await loadKey(`water:${dateKey}`, []);
      const wt = await loadKey("weight", []);
      const lib = await loadKey("foodLibrary", []);
      const savedWaterGoal = await loadKey("dailyWaterGoal", DEFAULT_WATER_GOAL);
      const savedCalorieGoal = await loadKey("dailyCalorieGoal", DEFAULT_CALORIE_GOAL);
      const savedHeight = await loadKey("userHeightCm", DEFAULT_USER_HEIGHT_CM);
      let histDates = await loadKey("dailyHistoryDates", []);
      if ((f.length > 0 || w.length > 0) && !histDates.includes(dateKey)) {
        histDates = await addDateToHistory(dateKey);
      }
      const hist = await loadHistoryRows(histDates);
      setTasks(t);
      setFoodEntries(f);
      setWaterEntries(w);
      setWeightEntries(wt);
      setSavedFoods(lib);
      const cleanHeight = Math.round(numberFromInput(savedHeight) || DEFAULT_USER_HEIGHT_CM);
      setUserHeightCm(cleanHeight);
      setHeightInput(String(cleanHeight));
      setDailyWaterGoal(Number(savedWaterGoal) || DEFAULT_WATER_GOAL);
      setWaterGoalInput(String(Number(savedWaterGoal) || DEFAULT_WATER_GOAL));
      setDailyCalorieGoal(Number(savedCalorieGoal) || DEFAULT_CALORIE_GOAL);
      setCalorieGoalInput(String(Number(savedCalorieGoal) || DEFAULT_CALORIE_GOAL));
      setHistoryRows(hist);
      setReady(true);
    })();
  }, []);

  const refreshHistory = useCallback(async () => {
    const dates = await loadKey("dailyHistoryDates", []);
    const rows = await loadHistoryRows(dates);
    setHistoryRows(rows);
  }, []);

  // midnight rollover check
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = getDateKey();
      if (now !== dateKeyRef.current) {
        setDateKey(now);
        const f = await loadKey(`food:${now}`, []);
        const w = await loadKey(`water:${now}`, []);
        setFoodEntries(f);
        setWaterEntries(w);
        await refreshHistory();
      }
    }, 20000);
    return () => clearInterval(interval);
  }, [refreshHistory]);

  // ---- tasks ----
  const persistTasks = useCallback(async (next) => {
    setTasks(next);
    await saveKey("tasks", next);
  }, []);

  const addTask = () => {
    const text = newTaskText.trim();
    if (!text) return;
    const due = dueDateInput ? { date: dueDateInput, time: dueTimeInput || null } : null;
    const next = [...tasks, { id: uid(), text, status: "not_done", statusText: "", priority: newTaskPriority, done: false, createdAt: Date.now(), due }];
    persistTasks(next);
    setNewTaskText("");
    setDueDateInput("");
    setDueTimeInput("");
    setShowDueFields(false);
  };

  const toggleTask = (id) => {
    const next = tasks.map((t) => {
      if (t.id !== id) return t;
      const nextStatus = isTaskDone(t) ? "not_done" : "done";
      return { ...t, status: nextStatus, done: nextStatus === "done" };
    });
    persistTasks(next);
  };

  const updateTaskStatus = (id, status) => {
    const next = tasks.map((t) => (t.id === id ? { ...t, status, done: status === "done" } : t));
    persistTasks(next);
  };

  const updateTaskStatusText = (id, statusText) => {
    const next = tasks.map((t) => (t.id === id ? { ...t, statusText } : t));
    persistTasks(next);
  };

  const updateTaskPriority = (id, priority) => {
    const next = tasks.map((t) => (t.id === id ? { ...t, priority } : t));
    persistTasks(next);
  };

  const deleteTask = (id) => {
    persistTasks(tasks.filter((t) => t.id !== id));
  };

  const clearDoneTasks = () => {
    persistTasks(tasks.filter((t) => !isTaskDone(t)));
  };

  // ---- food ----
  const persistFood = useCallback(async (next) => {
    const currentDate = dateKeyRef.current;
    setFoodEntries(next);
    await saveKey(`food:${currentDate}`, next);
    if (next.length > 0) await addDateToHistory(currentDate);
    await refreshHistory();
  }, [refreshHistory]);

  const resetFoodForm = () => {
    setFoodForm({ name: "", grams: "", calories: "", protein: "", fat: "", autoNote: "", imageData: "", imageSource: "" });
  };

  const applyAutoFoodEstimate = () => {
    setFoodForm((prev) => {
      const patch = buildAutoFoodFormPatch(prev.name, prev.grams, savedFoods);
      const next = { ...prev, ...patch };
      return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
    });
  };

  const addFood = (mode = "detailed") => {
    const rawName = foodForm.name.trim();
    const name = cleanFoodName(rawName) || rawName;
    const grams = getFoodGrams(rawName, foodForm.grams);
    const profile = getFoodProfileMatch(name);
    if (!name) return false;

    const autoEstimate = getAutoNutritionEstimate(rawName, foodForm.grams, savedFoods);
    const manualCalories = parseFloat(foodForm.calories);
    const manualProtein = parseFloat(foodForm.protein);
    const manualFat = parseFloat(foodForm.fat);
    const calories = Number.isFinite(manualCalories) ? manualCalories : autoEstimate?.calories;
    const protein = Number.isFinite(manualProtein) ? manualProtein : autoEstimate?.protein;
    const fat = Number.isFinite(manualFat) ? manualFat : autoEstimate?.fat;
    const hasDetails = Number.isFinite(calories) || Number.isFinite(protein) || Number.isFinite(fat);

    if (mode === "detailed" && !hasDetails) return false;

    const entry = {
      id: uid(),
      name,
      grams: grams || autoEstimate?.grams || null,
      profileName: profile?.name || autoEstimate?.sourceName || null,
      category: autoEstimate?.category || profile?.category || null,
      portionHint: profile?.portionHint || null,
      hasNutrition: hasDetails,
      calories: hasDetails && Number.isFinite(calories) ? Math.round(calories) : null,
      protein: hasDetails && Number.isFinite(protein) ? roundOne(protein) : null,
      fat: hasDetails && Number.isFinite(fat) ? roundOne(fat) : null,
      estimateNote: hasDetails ? (autoEstimate?.note || foodForm.autoNote || null) : "נשמר בלי קלוריות/מאקרו",
      imageData: foodForm.imageData || null,
      imageSource: foodForm.imageSource || null,
      time: new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }),
    };
    persistFood([...foodEntries, entry]);
    resetFoodForm();
    return true;
  };

  const deleteFood = (id) => {
    persistFood(foodEntries.filter((f) => f.id !== id));
  };

  // ---- food product library ----
  const persistLibrary = useCallback(async (next) => {
    setSavedFoods(next);
    await saveKey("foodLibrary", next);
  }, []);

  const buildLibraryProductFromForm = (forcedId = null) => {
    const name = libraryForm.name.trim();
    if (!name) return null;
    const calories = parseFloat(libraryForm.calories);
    const protein = parseFloat(libraryForm.protein);
    const fat = parseFloat(libraryForm.fat);
    const grams = numberFromInput(libraryForm.grams) || 100;
    const hasDetails = Number.isFinite(calories) || Number.isFinite(protein) || Number.isFinite(fat);
    const per100 = hasDetails ? {
      calories: Number.isFinite(calories) ? Math.round((calories / grams) * 100) : 0,
      protein: Number.isFinite(protein) ? roundOne((protein / grams) * 100) : 0,
      fat: Number.isFinite(fat) ? roundOne((fat / grams) * 100) : 0,
    } : null;
    return {
      id: forcedId || uid(),
      name,
      grams,
      per100,
      hasNutrition: hasDetails,
      calories: hasDetails && Number.isFinite(calories) ? Math.round(calories) : null,
      protein: hasDetails && Number.isFinite(protein) ? roundOne(protein) : null,
      fat: hasDetails && Number.isFinite(fat) ? roundOne(fat) : null,
      imageData: libraryForm.imageData || null,
    };
  };

  const getLibraryDuplicate = (name, editingId = null) => {
    const normalizedName = normalizeFoodText(name);
    if (!normalizedName) return null;
    return savedFoods.find((p) => p.id !== editingId && normalizeFoodText(p.name) === normalizedName) || null;
  };

  const addProductToLibrary = (editingId = null, options = {}) => {
    const product = buildLibraryProductFromForm(editingId);
    if (!product) return { ok: false, reason: "empty" };

    const duplicate = getLibraryDuplicate(product.name, editingId);
    if (duplicate && !options.forceUpdateDuplicate) {
      return { ok: false, reason: "duplicate", duplicate };
    }

    let next;
    if (editingId) {
      next = savedFoods.map((p) => (p.id === editingId ? { ...p, ...product, id: editingId } : p));
    } else if (duplicate && options.forceUpdateDuplicate) {
      next = savedFoods.map((p) => (p.id === duplicate.id ? { ...p, ...product, id: duplicate.id } : p));
    } else {
      next = [...savedFoods, product];
    }

    persistLibrary(next);
    setLibraryForm({ name: "", grams: "100", calories: "", protein: "", fat: "", imageData: "" });
    setShowLibraryForm(false);
    return { ok: true, updatedDuplicate: Boolean(duplicate && options.forceUpdateDuplicate) };
  };

  const saveCurrentFoodToLibrary = () => {
    const rawName = foodForm.name.trim();
    const name = cleanFoodName(rawName) || rawName;
    if (!name) return false;

    const autoEstimate = getAutoNutritionEstimate(rawName, foodForm.grams, savedFoods);
    const grams = getFoodGrams(rawName, foodForm.grams) || autoEstimate?.grams || 100;
    const manualCalories = parseFloat(foodForm.calories);
    const manualProtein = parseFloat(foodForm.protein);
    const manualFat = parseFloat(foodForm.fat);
    const calories = Number.isFinite(manualCalories) ? manualCalories : autoEstimate?.calories;
    const protein = Number.isFinite(manualProtein) ? manualProtein : autoEstimate?.protein;
    const fat = Number.isFinite(manualFat) ? manualFat : autoEstimate?.fat;
    const hasDetails = Number.isFinite(calories) || Number.isFinite(protein) || Number.isFinite(fat);

    const normalizedName = normalizeFoodText(name);
    const existing = savedFoods.find((p) => normalizeFoodText(p.name) === normalizedName);
    const product = {
      id: existing?.id || uid(),
      name,
      grams,
      per100: hasDetails ? {
        calories: Number.isFinite(calories) ? Math.round((calories / grams) * 100) : 0,
        protein: Number.isFinite(protein) ? roundOne((protein / grams) * 100) : 0,
        fat: Number.isFinite(fat) ? roundOne((fat / grams) * 100) : 0,
      } : null,
      hasNutrition: hasDetails,
      calories: hasDetails && Number.isFinite(calories) ? Math.round(calories) : null,
      protein: hasDetails && Number.isFinite(protein) ? roundOne(protein) : null,
      fat: hasDetails && Number.isFinite(fat) ? roundOne(fat) : null,
      imageData: foodForm.imageData || existing?.imageData || null,
    };

    if (existing) {
      persistLibrary(savedFoods.map((p) => (p.id === existing.id ? product : p)));
    } else {
      persistLibrary([...savedFoods, product]);
    }
    return true;
  };

  const deleteProductFromLibrary = (id) => {
    persistLibrary(savedFoods.filter((p) => p.id !== id));
  };

  const logProductFromLibrary = (product) => {
    const hasDetails = hasFoodNutrition(product);
    const profile = getFoodProfileMatch(product.name);
    const entry = {
      id: uid(),
      name: product.name,
      profileName: profile?.name || null,
      category: profile?.category || null,
      portionHint: profile?.portionHint || null,
      hasNutrition: hasDetails,
      calories: hasDetails ? product.calories : null,
      protein: hasDetails ? product.protein : null,
      fat: hasDetails ? product.fat : null,
      estimateNote: hasDetails ? "נוסף מספר המוצרים" : "נשמר בלי קלוריות/מאקרו",
      imageData: product.imageData || null,
      imageSource: product.imageData ? "library" : null,
      time: new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }),
    };
    persistFood([...foodEntries, entry]);
  };

  const logMealTemplate = (template) => {
    const entry = {
      id: uid(),
      name: template.name,
      grams: template.grams,
      profileName: `תבנית · ${template.category}`,
      category: `תבנית · ${template.category}`,
      portionHint: null,
      hasNutrition: true,
      calories: Math.round(template.calories),
      protein: roundOne(template.protein),
      fat: roundOne(template.fat),
      estimateNote: template.note || "נוסף מתבנית מוכנה",
      imageData: null,
      imageSource: null,
      time: new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }),
    };
    persistFood([...foodEntries, entry]);
  };

  const foodTotals = foodEntries.reduce(
    (acc, f) => ({
      calories: acc.calories + (Number(f.calories) || 0),
      protein: acc.protein + (Number(f.protein) || 0),
      fat: acc.fat + (Number(f.fat) || 0),
    }),
    { calories: 0, protein: 0, fat: 0 }
  );

  const saveDailyCalorieGoal = async () => {
    const value = Math.round(numberFromInput(calorieGoalInput) || 0);
    if (value < 500 || value > 10000) return;
    setDailyCalorieGoal(value);
    setCalorieGoalInput(String(value));
    setIsEditingCalorieGoal(false);
    await saveKey("dailyCalorieGoal", value);
  };

  // ---- water ----
  const persistWater = useCallback(async (next) => {
    const currentDate = dateKeyRef.current;
    setWaterEntries(next);
    await saveKey(`water:${currentDate}`, next);
    if (next.length > 0) await addDateToHistory(currentDate);
    await refreshHistory();
  }, [refreshHistory]);

  const addWater = (amount) => {
    if (!amount || amount <= 0) return;
    const entry = { id: uid(), amount, time: new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }) };
    persistWater([...waterEntries, entry]);
  };

  const removeWaterEntry = (id) => {
    persistWater(waterEntries.filter((w) => w.id !== id));
  };

  const saveDailyWaterGoal = async () => {
    const value = Math.round(numberFromInput(waterGoalInput) || 0);
    if (value < 500 || value > 10000) return;
    setDailyWaterGoal(value);
    setWaterGoalInput(String(value));
    setIsEditingWaterGoal(false);
    await saveKey("dailyWaterGoal", value);
  };

  const totalWater = waterEntries.reduce((sum, w) => sum + w.amount, 0);
  const waterPct = Math.min(100, Math.round((totalWater / dailyWaterGoal) * 100));
  const waterGoalReached = totalWater >= dailyWaterGoal;

  // ---- weight ----
  const saveUserHeight = async () => {
    const value = Math.round(numberFromInput(heightInput) || 0);
    if (value < 120 || value > 230) return;
    setUserHeightCm(value);
    setHeightInput(String(value));
    setIsEditingHeight(false);
    await saveKey("userHeightCm", value);
  };

  const persistWeight = useCallback(async (next) => {
    setWeightEntries(next);
    await saveKey("weight", next);
  }, []);

  const saveWeight = () => {
    const val = parseFloat(weightValue);
    if (!weightDate || isNaN(val) || val <= 0) return;
    const existingIdx = weightEntries.findIndex((w) => w.date === weightDate);
    let next;
    if (existingIdx >= 0) {
      next = weightEntries.map((w, i) => (i === existingIdx ? { ...w, weight: val } : w));
    } else {
      next = [...weightEntries, { id: uid(), date: weightDate, weight: val }];
    }
    persistWeight(next);
    setWeightValue("");
  };

  const deleteWeight = (id) => {
    persistWeight(weightEntries.filter((w) => w.id !== id));
  };

  if (!ready) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center"
        style={{ background: palette.bg, fontFamily: "Rubik, sans-serif" }}
      >
        <p style={{ color: palette.mutedInk }}>טוען...</p>
      </div>
    );
  }

  const tabMeta = {
    dashboard: { label: "בית", icon: Home, accent: palette.foodAccent },
    tasks: { label: "משימות", icon: ListTodo, accent: palette.tasksAccent },
    food: { label: "תזונה", icon: Utensils, accent: palette.foodAccent },
    weight: { label: "משקל", icon: Scale, accent: palette.weightAccent },
    history: { label: "היסטוריה", icon: History, accent: palette.weightAccent },
  };

  const openTasksCount = tasks.filter((t) => !isTaskDone(t)).length;
  const todayCalories = Math.round(foodTotals.calories || 0);
  const waterLiters = (totalWater / 1000).toFixed(1);
  const currentTabAccent = tabMeta[tab]?.accent || palette.ink;

  return (
    <div dir="rtl" className="min-h-screen pb-24 app-shell" style={{ background: palette.bg, fontFamily: "Rubik, sans-serif", color: palette.ink, "--active-accent": currentTabAccent }}>
      <div className="bg-blob bg-blob-a" />
      <div className="bg-blob bg-blob-b" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@500;700&family=Rubik:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Frank Ruhl Libre', serif; }
        @keyframes ripple { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ripple { animation: ripple 7s linear infinite; }
        input::placeholder { color: #B7AE9C; }
      `}</style>

      {/* header */}
      <header className="px-5 pt-6 pb-4 max-w-xl mx-auto app-header">
        <div className="hero-card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm hero-date">{formatHebrewDate()}</p>
              <h1 className="font-display text-3xl mt-1 hero-title">{(tab === "dashboard" || tab === "tasks") ? "תכנון יומי" : tabMeta[tab]?.label}</h1>
            </div>
            <div className="hero-pill">
              <span className="hero-dot" />
              היום
            </div>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span>{openTasksCount}</span>
              <small>משימות פתוחות</small>
            </div>
            <div className="hero-stat">
              <span>{todayCalories}</span>
              <small>מתוך {dailyCalorieGoal} קל׳</small>
            </div>
            <div className="hero-stat">
              <span>{waterLiters} ל׳</span>
              <small>מתוך {(dailyWaterGoal / 1000).toFixed(1)} ל׳</small>
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 max-w-xl mx-auto app-main">
        {tab === "dashboard" && (
          <DashboardView
            tasks={tasks}
            foodTotals={foodTotals}
            dailyCalorieGoal={dailyCalorieGoal}
            totalWater={totalWater}
            dailyWaterGoal={dailyWaterGoal}
            weightEntries={weightEntries}
            userHeightCm={userHeightCm}
            historyRows={historyRows}
            setTab={setTab}
          />
        )}

        {tab === "tasks" && (
          <TasksView
            tasks={tasks}
            newTaskText={newTaskText}
            setNewTaskText={setNewTaskText}
            newTaskPriority={newTaskPriority}
            setNewTaskPriority={setNewTaskPriority}
            taskFilter={taskFilter}
            setTaskFilter={setTaskFilter}
            addTask={addTask}
            toggleTask={toggleTask}
            updateTaskStatus={updateTaskStatus}
            updateTaskStatusText={updateTaskStatusText}
            updateTaskPriority={updateTaskPriority}
            deleteTask={deleteTask}
            clearDoneTasks={clearDoneTasks}
            showDueFields={showDueFields}
            setShowDueFields={setShowDueFields}
            dueDateInput={dueDateInput}
            setDueDateInput={setDueDateInput}
            dueTimeInput={dueTimeInput}
            setDueTimeInput={setDueTimeInput}
          />
        )}

        {tab === "food" && (
          <FoodView
            foodForm={foodForm}
            setFoodForm={setFoodForm}
            applyAutoFoodEstimate={applyAutoFoodEstimate}
            addFood={addFood}
            foodEntries={foodEntries}
            deleteFood={deleteFood}
            totals={foodTotals}
            dailyCalorieGoal={dailyCalorieGoal}
            calorieGoalInput={calorieGoalInput}
            setCalorieGoalInput={setCalorieGoalInput}
            isEditingCalorieGoal={isEditingCalorieGoal}
            setIsEditingCalorieGoal={setIsEditingCalorieGoal}
            saveDailyCalorieGoal={saveDailyCalorieGoal}
            savedFoods={savedFoods}
            saveCurrentFoodToLibrary={saveCurrentFoodToLibrary}
            showTemplates={showTemplates}
            setShowTemplates={setShowTemplates}
            templateSearch={templateSearch}
            setTemplateSearch={setTemplateSearch}
            logMealTemplate={logMealTemplate}
            nutritionSubTab={nutritionSubTab}
            setNutritionSubTab={setNutritionSubTab}
            totalWater={totalWater}
            waterPct={waterPct}
            waterGoalReached={waterGoalReached}
            dailyWaterGoal={dailyWaterGoal}
            waterGoalInput={waterGoalInput}
            setWaterGoalInput={setWaterGoalInput}
            isEditingWaterGoal={isEditingWaterGoal}
            setIsEditingWaterGoal={setIsEditingWaterGoal}
            saveDailyWaterGoal={saveDailyWaterGoal}
            addWater={addWater}
            customWater={customWater}
            setCustomWater={setCustomWater}
            waterEntries={waterEntries}
            removeWaterEntry={removeWaterEntry}
            showLibraryModal={showLibraryModal}
            setShowLibraryModal={setShowLibraryModal}
          />
        )}

        {tab === "weight" && (
          <WeightView
            weightEntries={weightEntries}
            weightDate={weightDate}
            setWeightDate={setWeightDate}
            weightValue={weightValue}
            setWeightValue={setWeightValue}
            userHeightCm={userHeightCm}
            heightInput={heightInput}
            setHeightInput={setHeightInput}
            isEditingHeight={isEditingHeight}
            setIsEditingHeight={setIsEditingHeight}
            saveUserHeight={saveUserHeight}
            saveWeight={saveWeight}
            deleteWeight={deleteWeight}
          />
        )}

        {tab === "history" && (
          <HistoryView historyRows={historyRows} />
        )}
      </main>

      {showLibraryModal && (
        <ProductLibraryModal
          savedFoods={savedFoods}
          showLibraryForm={showLibraryForm}
          setShowLibraryForm={setShowLibraryForm}
          libraryForm={libraryForm}
          setLibraryForm={setLibraryForm}
          addProductToLibrary={addProductToLibrary}
          deleteProductFromLibrary={deleteProductFromLibrary}
          logProductFromLibrary={logProductFromLibrary}
          onClose={() => setShowLibraryModal(false)}
        />
      )}

      {/* bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-center bottom-nav">
        <div className="max-w-xl w-full flex bottom-nav-inner">
          {Object.entries(tabMeta).map(([key, meta]) => {
            const Icon = meta.icon;
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 tab-button ${active ? "tab-button-active" : ""}`}
                style={{ color: active ? meta.accent : palette.mutedInk }}
              >
                <span className="tab-icon-wrap">
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                </span>
                <span className="text-[11px] tab-label" style={{ fontWeight: active ? 700 : 500 }}>{meta.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="rounded-2xl p-4 mb-4 app-card" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
      {children}
    </div>
  );
}

function isOverdue(due) {
  if (!due || !due.date) return false;
  const dt = new Date(`${due.date}T${due.time || "23:59"}`);
  return dt.getTime() < Date.now();
}

function isDueToday(due) {
  return Boolean(due && due.date === getDateKey());
}

function taskDueTime(task) {
  return task.due ? new Date(`${task.due.date}T${task.due.time || "23:59"}`).getTime() : Infinity;
}

function taskPriorityRank(task) {
  const p = getTaskPriority(task);
  if (p === "high") return 0;
  if (p === "normal") return 1;
  return 2;
}

function sortTasksSmart(a, b) {
  const aDone = isTaskDone(a);
  const bDone = isTaskDone(b);
  if (aDone !== bDone) return aDone ? 1 : -1;
  const aOverdue = !aDone && isOverdue(a.due);
  const bOverdue = !bDone && isOverdue(b.due);
  if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;
  const aDue = taskDueTime(a);
  const bDue = taskDueTime(b);
  if (aDue !== bDue) return aDue - bDue;
  const aPr = taskPriorityRank(a);
  const bPr = taskPriorityRank(b);
  if (aPr !== bPr) return aPr - bPr;
  return (a.createdAt || 0) - (b.createdAt || 0);
}

function formatDue(due) {
  if (!due || !due.date) return "";
  const txt = formatShortDate(due.date);
  return due.time ? `${txt} · ${due.time}` : txt;
}


function DashboardView({ tasks, foodTotals, dailyCalorieGoal, totalWater, dailyWaterGoal, weightEntries, userHeightCm, historyRows, setTab }) {
  const taskStats = buildTaskStats(tasks);
  const weightStats = buildWeightStats(weightEntries, userHeightCm);
  const caloriePct = dailyCalorieGoal ? clampPct((safeNum(foodTotals.calories) / dailyCalorieGoal) * 100) : 0;
  const waterPct = dailyWaterGoal ? clampPct((safeNum(totalWater) / dailyWaterGoal) * 100) : 0;
  const caloriesLeft = Math.round(dailyCalorieGoal - safeNum(foodTotals.calories));
  const waterLeft = Math.max(0, Math.round(dailyWaterGoal - safeNum(totalWater)));
  const last7 = historyRows.slice(0, 7);
  const avgCalories = last7.length ? Math.round(last7.reduce((sum, r) => sum + safeNum(r.totals?.calories), 0) / last7.length) : 0;
  const avgWater = last7.length ? Math.round(last7.reduce((sum, r) => sum + safeNum(r.totalWater), 0) / last7.length) : 0;
  const qualityScore = getFoodQualityScore(foodTotals, dailyCalorieGoal, totalWater, dailyWaterGoal);

  return (
    <div>
      <div className="hero-card rounded-3xl p-5 mb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs" style={{ color: palette.mutedInk }}>דשבורד אישי</p>
            <h2 className="text-2xl font-semibold mt-1" style={{ color: palette.ink }}>המצב שלך היום</h2>
          </div>
          <div className="rounded-2xl p-3" style={{ background: palette.foodAccentSoft, color: palette.foodAccent }}>
            <Activity size={24} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <DashboardMetric icon={Flame} label="קלוריות" value={`${Math.round(foodTotals.calories)} / ${dailyCalorieGoal}`} sub={caloriesLeft >= 0 ? `נשארו ${caloriesLeft}` : `חריגה ${Math.abs(caloriesLeft)}`} pct={caloriePct} accent={palette.foodAccent} onClick={() => setTab("food")} />
          <DashboardMetric icon={Droplets} label="מים" value={`${(totalWater / 1000).toFixed(1)} / ${(dailyWaterGoal / 1000).toFixed(1)} ל׳`} sub={waterLeft ? `נשאר ${(waterLeft / 1000).toFixed(1)} ל׳` : "יעד הושלם"} pct={waterPct} accent={palette.waterAccent} onClick={() => setTab("food")} />
          <DashboardMetric icon={ListTodo} label="משימות" value={taskStats.open} sub={taskStats.high ? `${taskStats.high} דחופות` : `${taskStats.done} בוצעו`} pct={taskStats.completionPct} accent={palette.tasksAccent} onClick={() => setTab("tasks")} />
          <DashboardMetric icon={Scale} label="משקל" value={weightStats.latest ? formatKg(weightStats.latest.weight) : "—"} sub={weightStats.changeFromPrev === null ? "אין מגמה" : `${weightStats.changeFromPrev > 0 ? "+" : ""}${weightStats.changeFromPrev} מהקודם`} pct={weightStats.bmi ? clampPct((weightStats.bmi.bmi / 40) * 100) : 0} accent={palette.weightAccent} onClick={() => setTab("weight")} />
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium flex items-center gap-1.5"><BarChart3 size={16} style={{ color: palette.foodAccent }} /> ניתוח נתונים</p>
          <span className="text-[10px] rounded-full px-2 py-1" style={{ background: palette.foodAccentSoft, color: palette.foodAccent }}>חכם</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <MiniInsight label="ציון יום" value={`${qualityScore}/100`} />
          <MiniInsight label="ממוצע קלוריות" value={avgCalories ? `${avgCalories} קל׳` : "—"} />
          <MiniInsight label="ממוצע מים" value={avgWater ? `${(avgWater / 1000).toFixed(1)} ל׳` : "—"} />
          <MiniInsight label="משימות באיחור" value={taskStats.overdue} danger={taskStats.overdue > 0} />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium flex items-center gap-1.5"><TrendingDown size={16} style={{ color: palette.weightAccent }} /> משקל גוף</p>
          {weightStats.bmi && <span className="text-[10px] rounded-full px-2 py-1" style={{ background: palette.weightAccentSoft, color: palette.weightAccent }}>BMI {weightStats.bmi.bmi}</span>}
        </div>
        {weightStats.latest ? (
          <div>
            {weightStats.points && (
              <svg viewBox="0 0 180 58" className="w-full h-20" preserveAspectRatio="none">
                <polyline points={weightStats.points} fill="none" stroke={palette.weightAccent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <div className="grid grid-cols-3 gap-2 mt-1">
              <MiniInsight label="אחרון" value={formatKg(weightStats.latest.weight)} />
              <MiniInsight label="BMI" value={weightStats.bmi?.bmi ?? "—"} />
              <MiniInsight label="סה״כ שינוי" value={weightStats.totalChange === null ? "—" : `${weightStats.totalChange > 0 ? "+" : ""}${weightStats.totalChange} ק״ג`} danger={weightStats.totalChange > 0} />
            </div>
          </div>
        ) : (
          <p className="text-sm text-center py-4" style={{ color: palette.mutedInk }}>הוסף שקילה כדי לראות גרף, BMI ומגמה.</p>
        )}
      </Card>

      <Card>
        <p className="text-sm font-medium mb-3 flex items-center gap-1.5"><Trophy size={16} style={{ color: palette.tasksAccent }} /> המלצות להיום</p>
        <div className="space-y-2">
          <SmartTip good={caloriePct <= 100} text={caloriePct > 100 ? "עברת את יעד הקלוריות — אפשר לסיים את היום קליל." : caloriesLeft > 0 ? `נשארו לך ${caloriesLeft} קל׳ במסגרת היעד.` : "אתה בדיוק על יעד הקלוריות."} />
          <SmartTip good={waterPct >= 100} text={waterPct >= 100 ? "יעד המים הושלם." : `חסר לך ${(waterLeft / 1000).toFixed(1)} ליטר מים ליעד.`} />
          <SmartTip good={taskStats.overdue === 0} text={taskStats.overdue > 0 ? `יש ${taskStats.overdue} משימות באיחור שכדאי לסגור.` : "אין משימות באיחור."} />
        </div>
      </Card>
    </div>
  );
}

function DashboardMetric({ icon: Icon, label, value, sub, pct, accent, onClick }) {
  return (
    <button type="button" onClick={onClick} className="rounded-2xl p-3 text-right" style={{ background: palette.surface, border: `1px solid ${palette.border}`, boxShadow: "0 8px 22px rgba(83,58,35,0.06)" }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px]" style={{ color: palette.mutedInk }}>{label}</span>
        <Icon size={15} style={{ color: accent }} />
      </div>
      <p className="text-lg font-semibold truncate" style={{ color: palette.ink }}>{value}</p>
      <p className="text-[10px] mt-0.5 truncate" style={{ color: palette.mutedInk }}>{sub}</p>
      <div className="h-1.5 rounded-full overflow-hidden mt-2" style={{ background: "#EFE7DB" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: accent }} />
      </div>
    </button>
  );
}

function MiniInsight({ label, value, danger = false }) {
  return (
    <div className="rounded-2xl px-3 py-2" style={{ background: palette.bg, border: `1px solid ${palette.border}` }}>
      <p className="text-[10px]" style={{ color: palette.mutedInk }}>{label}</p>
      <p className="text-sm font-semibold mt-0.5" style={{ color: danger ? palette.danger : palette.ink }}>{value}</p>
    </div>
  );
}

function SmartTip({ text, good }) {
  return (
    <div className="flex items-start gap-2 rounded-2xl px-3 py-2" style={{ background: good ? palette.tasksAccentSoft : palette.foodAccentSoft }}>
      <Target size={15} className="mt-0.5 flex-shrink-0" style={{ color: good ? palette.tasksAccent : palette.foodAccent }} />
      <p className="text-xs leading-5" style={{ color: palette.ink }}>{text}</p>
    </div>
  );
}



function SectionHeader({ icon: Icon, title, subtitle, accent = palette.foodAccent, action }) {
  return (
    <div className="section-hero rounded-3xl p-4 mb-4" style={{ border: `1px solid ${palette.border}` }}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold" style={{ color: palette.ink }}>{title}</h2>
          {subtitle && <p className="text-xs mt-1 leading-5" style={{ color: palette.mutedInk }}>{subtitle}</p>}
        </div>
        <div className="rounded-2xl p-3 flex-shrink-0" style={{ background: palette.bg, color: accent }}>
          <Icon size={22} />
        </div>
      </div>
      {action}
    </div>
  );
}

function ProgressCard({ label, value, sub, pct, accent, icon: Icon }) {
  return (
    <div className="rounded-2xl p-3" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px]" style={{ color: palette.mutedInk }}>{label}</span>
        {Icon && <Icon size={15} style={{ color: accent }} />}
      </div>
      <p className="text-lg font-semibold mt-1" style={{ color: palette.ink }}>{value}</p>
      {sub && <p className="text-[10px] mt-0.5" style={{ color: palette.mutedInk }}>{sub}</p>}
      <div className="h-1.5 rounded-full overflow-hidden mt-2" style={{ background: "#EFE7DB" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: accent }} />
      </div>
    </div>
  );
}


function TasksView({
  tasks, newTaskText, setNewTaskText, newTaskPriority, setNewTaskPriority, taskFilter, setTaskFilter,
  addTask, toggleTask, updateTaskStatus, updateTaskStatusText, updateTaskPriority, deleteTask, clearDoneTasks,
  showDueFields, setShowDueFields, dueDateInput, setDueDateInput, dueTimeInput, setDueTimeInput,
}) {
  const activeTasks = tasks.filter((t) => !isTaskDone(t)).slice().sort(sortTasksSmart);
  const doneTasks = tasks.filter((t) => isTaskDone(t)).slice().sort(sortTasksSmart);
  const overdueTasks = activeTasks.filter((t) => isOverdue(t.due));
  const todayTasks = activeTasks.filter((t) => isDueToday(t.due));
  const highTasks = activeTasks.filter((t) => getTaskPriority(t) === "high");

  const filterOptions = [
    { key: "open", label: `פתוחות (${activeTasks.length})` },
    { key: "today", label: `היום (${todayTasks.length})` },
    { key: "high", label: `דחופות (${highTasks.length})` },
    { key: "done", label: `בוצעו (${doneTasks.length})` },
    { key: "all", label: `הכל (${tasks.length})` },
  ];

  const shownTasks = (() => {
    if (taskFilter === "today") return todayTasks;
    if (taskFilter === "high") return highTasks;
    if (taskFilter === "done") return doneTasks;
    if (taskFilter === "all") return tasks.slice().sort(sortTasksSmart);
    return activeTasks;
  })();

  return (
    <div>
      <Card>
        <div className="flex gap-2 mb-2">
          <input
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !showDueFields && addTask()}
            placeholder="מה צריך לעשות?"
            className="flex-1 rounded-xl px-3 py-2 outline-none"
            style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
          />
          <button
            onClick={() => setShowDueFields((v) => !v)}
            className="rounded-xl px-3 flex items-center justify-center"
            style={{
              background: showDueFields || dueDateInput ? palette.tasksAccentSoft : palette.bg,
              color: palette.tasksAccent,
              border: `1px solid ${palette.border}`,
            }}
          >
            <Calendar size={18} />
          </button>
          <button
            onClick={addTask}
            className="rounded-xl px-3 flex items-center justify-center"
            style={{ background: palette.tasksAccent, color: "#fff" }}
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="mb-2">
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
            className="w-full rounded-xl px-3 py-2 outline-none text-sm"
            style={{ background: palette.bg, border: `1px solid ${palette.border}`, color: palette.ink }}
          >
            <option value="normal">עדיפות רגילה</option>
            <option value="high">עדיפות דחופה</option>
            <option value="low">עדיפות נמוכה</option>
          </select>
        </div>

        {showDueFields && (
          <div className="flex gap-2">
            <input
              type="date"
              value={dueDateInput}
              onChange={(e) => setDueDateInput(e.target.value)}
              className="flex-1 rounded-xl px-3 py-2 outline-none text-sm"
              style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
            />
            <input
              type="time"
              value={dueTimeInput}
              onChange={(e) => setDueTimeInput(e.target.value)}
              className="flex-1 rounded-xl px-3 py-2 outline-none text-sm"
              style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
            />
          </div>
        )}
      </Card>

      {tasks.length > 0 && (
        <Card>
          <div className="grid grid-cols-4 gap-2 text-center mb-3">
            <MiniStat label="פתוחות" value={activeTasks.length} />
            <MiniStat label="היום" value={todayTasks.length} />
            <MiniStat label="דחופות" value={highTasks.length} danger={highTasks.length > 0} />
            <MiniStat label="באיחור" value={overdueTasks.length} danger={overdueTasks.length > 0} />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filterOptions.map((f) => {
              const active = taskFilter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setTaskFilter(f.key)}
                  className="rounded-xl px-3 py-1.5 text-xs whitespace-nowrap"
                  style={{
                    background: active ? palette.tasksAccent : palette.bg,
                    color: active ? "#fff" : palette.mutedInk,
                    border: `1px solid ${active ? palette.tasksAccent : palette.border}`,
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {doneTasks.length > 0 && (
            <button onClick={clearDoneTasks} className="text-xs flex items-center gap-1 mt-3" style={{ color: palette.mutedInk }}>
              <RotateCcw size={12} /> נקה משימות שבוצעו
            </button>
          )}
        </Card>
      )}

      {tasks.length === 0 && (
        <p className="text-sm text-center mt-8" style={{ color: palette.mutedInk }}>
          הרשימה פנויה. מה הדבר הראשון שצריך לעשות היום?
        </p>
      )}

      {tasks.length > 0 && shownTasks.length === 0 && (
        <p className="text-sm text-center mt-6" style={{ color: palette.mutedInk }}>
          אין משימות להצגה בסינון הזה.
        </p>
      )}

      {shownTasks.length > 0 && (
        <div className="space-y-2 mb-4">
          {shownTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onStatusChange={(status) => updateTaskStatus(task.id, status)}
              onStatusTextChange={(statusText) => updateTaskStatusText(task.id, statusText)}
              onPriorityChange={(priority) => updateTaskPriority(task.id, priority)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, danger }) {
  return (
    <div className="rounded-xl py-2 px-1" style={{ background: danger ? "#F7E5E2" : palette.tasksAccentSoft }}>
      <p className="text-base font-semibold" style={{ color: danger ? palette.danger : palette.tasksAccent }}>{value}</p>
      <p className="text-[10px]" style={{ color: palette.mutedInk }}>{label}</p>
    </div>
  );
}

function TaskRow({ task, onToggle, onStatusChange, onStatusTextChange, onPriorityChange, onDelete }) {
  const status = getTaskStatus(task);
  const done = status === "done";
  const priority = getTaskPriority(task);
  const overdue = !done && isOverdue(task.due);
  const priorityColor = priority === "high" ? palette.danger : priority === "low" ? palette.mutedInk : palette.tasksAccent;

  return (
    <div className="rounded-xl px-3 py-2.5" style={{ background: palette.surface, border: `1px solid ${overdue ? palette.danger : palette.border}` }}>
      <div className="flex items-start gap-3">
        <button onClick={onToggle} style={{ color: done ? palette.tasksAccent : palette.mutedInk }}>
          {done ? <CheckSquare size={20} /> : <Square size={20} />}
        </button>
        <div className="flex-1 min-w-0">
          <span
            className="text-sm block"
            style={{ color: done ? palette.mutedInk : palette.ink, textDecoration: done ? "line-through" : "none" }}
          >
            {task.text}
          </span>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            {task.due && task.due.date && (
              <span className="text-[11px] flex items-center gap-1" style={{ color: overdue ? palette.danger : palette.mutedInk }}>
                <Calendar size={11} /> {formatDue(task.due)}{overdue ? " · באיחור" : ""}
              </span>
            )}
            <span className="text-[11px]" style={{ color: priorityColor }}>
              {TASK_PRIORITY[priority] || TASK_PRIORITY.normal}
            </span>
          </div>
        </div>
        <button onClick={onDelete} style={{ color: palette.mutedInk }}>
          <X size={16} />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 pr-8">
        <label className="text-[11px]" style={{ color: palette.mutedInk }}>
          סטטוס
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="mt-1 w-full rounded-xl px-3 py-2 outline-none text-xs"
            style={{ background: done ? palette.tasksAccentSoft : palette.bg, border: `1px solid ${palette.border}`, color: done ? palette.tasksAccent : palette.ink }}
          >
            <option value="not_done">לא בוצע</option>
            <option value="done">בוצע</option>
          </select>
        </label>

        <label className="text-[11px]" style={{ color: palette.mutedInk }}>
          עדיפות
          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="mt-1 w-full rounded-xl px-3 py-2 outline-none text-xs"
            style={{ background: palette.bg, border: `1px solid ${palette.border}`, color: priorityColor }}
          >
            <option value="normal">רגילה</option>
            <option value="high">דחופה</option>
            <option value="low">נמוכה</option>
          </select>
        </label>
      </div>

      <div className="mt-2 pr-8">
        <input
          value={task.statusText || ""}
          onChange={(e) => onStatusTextChange(e.target.value)}
          placeholder="כתוב איפה המשימה עומדת... למשל: בטיפול / מחכה לאישור / תקוע"
          className="w-full rounded-xl px-3 py-2 outline-none text-xs"
          style={{ background: palette.bg, border: `1px solid ${palette.border}`, color: palette.ink }}
        />
      </div>
    </div>
  );
}

function StatChip({ label, value, accent, soft }) {
  return (
    <div className="flex-1 rounded-xl py-1.5 px-1 text-center min-w-0" style={{ background: soft }}>
      <p className="text-base font-semibold whitespace-nowrap" style={{ color: accent }}>{value}</p>
      <p className="text-[10px] whitespace-nowrap" style={{ color: palette.mutedInk }}>{label}</p>
    </div>
  );
}


function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("קריאת התמונה נכשלה"));
    reader.readAsDataURL(file);
  });
}

function normalizeAiFoodResult(data) {
  if (!data || typeof data !== "object") return null;
  return {
    name: typeof data.name === "string" ? data.name.trim() : "",
    grams: Number.isFinite(Number(data.grams)) ? String(Math.round(Number(data.grams))) : "",
    calories: Number.isFinite(Number(data.calories)) ? String(Math.round(Number(data.calories))) : "",
    protein: Number.isFinite(Number(data.protein)) ? String(roundOne(Number(data.protein))) : "",
    fat: Number.isFinite(Number(data.fat)) ? String(roundOne(Number(data.fat))) : "",
    confidence: typeof data.confidence === "string" ? data.confidence : "",
    note: typeof data.note === "string" ? data.note : "",
  };
}


function normalizeScannedNutrition(data) {
  if (!data || typeof data !== "object") return null;
  return {
    name: typeof data.name === "string" ? data.name.trim() : "",
    grams: Number.isFinite(Number(data.grams)) ? String(Math.round(Number(data.grams))) : "100",
    calories: Number.isFinite(Number(data.calories)) ? String(Math.round(Number(data.calories))) : "",
    protein: Number.isFinite(Number(data.protein)) ? String(roundOne(Number(data.protein))) : "",
    fat: Number.isFinite(Number(data.fat)) ? String(roundOne(Number(data.fat))) : "",
    note: typeof data.note === "string" ? data.note : "זוהה מסריקה — אפשר לערוך כמות וערכים לפני שמירה",
  };
}

async function detectBarcodeFromImage(file) {
  if (!("BarcodeDetector" in window)) return "";
  try {
    const detector = new window.BarcodeDetector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39"] });
    const bitmap = await createImageBitmap(file);
    const results = await detector.detect(bitmap);
    return results?.[0]?.rawValue || "";
  } catch {
    return "";
  }
}

function FoodView({
  foodForm, setFoodForm, applyAutoFoodEstimate, addFood, foodEntries, deleteFood, totals,
  dailyCalorieGoal, calorieGoalInput, setCalorieGoalInput,
  isEditingCalorieGoal, setIsEditingCalorieGoal, saveDailyCalorieGoal,
  savedFoods, saveCurrentFoodToLibrary,
  showTemplates, setShowTemplates, templateSearch, setTemplateSearch, logMealTemplate,
  nutritionSubTab, setNutritionSubTab,
  totalWater, waterPct, waterGoalReached,
  dailyWaterGoal, waterGoalInput, setWaterGoalInput,
  isEditingWaterGoal, setIsEditingWaterGoal, saveDailyWaterGoal,
  addWater, customWater, setCustomWater, waterEntries, removeWaterEntry,
  showLibraryModal, setShowLibraryModal,
}) {
  const [photoPreview, setPhotoPreview] = useState("");
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [photoAnalyzeError, setPhotoAnalyzeError] = useState("");
  const caloriePct = dailyCalorieGoal > 0 ? Math.min(100, Math.round((totals.calories / dailyCalorieGoal) * 100)) : 0;
  const caloriesLeft = Math.round(dailyCalorieGoal - totals.calories);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodePreview, setBarcodePreview] = useState("");
  const [barcodeStatus, setBarcodeStatus] = useState("");
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [labelPreview, setLabelPreview] = useState("");
  const [labelStatus, setLabelStatus] = useState("");
  const [isAnalyzingLabel, setIsAnalyzingLabel] = useState(false);
  const [selectedFoodImage, setSelectedFoodImage] = useState("");
  const [librarySaveStatus, setLibrarySaveStatus] = useState("");
  const [showBarcodeTools, setShowBarcodeTools] = useState(false);
  const [showPhotoTools, setShowPhotoTools] = useState(false);

  const applyScannedNutritionToForm = (raw) => {
    const normalized = normalizeScannedNutrition(raw);
    if (!normalized || !normalized.name) throw new Error("לא הצלחתי לחלץ נתונים מהמוצר");
    setFoodForm((prev) => ({
      ...prev,
      name: normalized.name,
      grams: normalized.grams || prev.grams || "100",
      calories: normalized.calories || prev.calories,
      protein: normalized.protein || prev.protein,
      fat: normalized.fat || prev.fat,
      autoNote: normalized.note,
    }));
  };

  const clearFoodPhotoState = () => {
    setPhotoPreview("");
    setPhotoAnalyzeError("");
    setLibrarySaveStatus("");
    setFoodForm((prev) => ({ ...prev, imageData: "", imageSource: "" }));
  };

  const handleAddFood = (mode = "detailed") => {
    const added = addFood(mode);
    if (added) {
      setPhotoPreview("");
      setPhotoAnalyzeError("");
      setLibrarySaveStatus("");
    }
  };

  const handleSaveCurrentFoodToLibrary = () => {
    const saved = saveCurrentFoodToLibrary();
    setLibrarySaveStatus(saved ? "הארוחה נשמרה גם בספר המוצרים." : "צריך קודם לזהות/למלא שם מאכל כדי לשמור לספר המוצרים.");
  };

  const lookupBarcode = async (barcode) => {
    const cleanBarcode = String(barcode || "").replace(/\D/g, "");
    if (!cleanBarcode || cleanBarcode.length < 6) throw new Error("הברקוד קצר מדי או לא תקין");
    const res = await fetch(`/api/lookup-product?barcode=${encodeURIComponent(cleanBarcode)}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || "המוצר לא נמצא לפי הברקוד");
    applyScannedNutritionToForm(data);
    setBarcodeInput(cleanBarcode);
    return data;
  };

  const scanBarcodePhoto = async (file) => {
    if (!file) return;
    setBarcodeStatus("");
    setIsScanningBarcode(true);
    try {
      const imageData = await readFileAsDataUrl(file);
      setBarcodePreview(imageData);
      let barcode = await detectBarcodeFromImage(file);
      if (!barcode) {
        const res = await fetch("/api/analyze-barcode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageData }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "לא הצלחתי לקרוא את הברקוד מהתמונה");
        barcode = data?.barcode || "";
      }
      if (!barcode) throw new Error("לא זוהה ברקוד ברור. נסה לצלם מקרוב או להזין ידנית.");
      const product = await lookupBarcode(barcode);
      setBarcodeStatus(`נמצא: ${product.name || barcode}`);
    } catch (err) {
      setBarcodeStatus(err?.message || "סריקת הברקוד נכשלה");
    } finally {
      setIsScanningBarcode(false);
    }
  };

  const analyzeNutritionLabel = async (file) => {
    if (!file) return;
    setLabelStatus("");
    setIsAnalyzingLabel(true);
    try {
      const imageData = await readFileAsDataUrl(file);
      setLabelPreview(imageData);
      const res = await fetch("/api/analyze-label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "לא הצלחתי לקרוא את התווית");
      applyScannedNutritionToForm(data);
      setLabelStatus("התווית נקראה ומילאה את הפרטים. אפשר לערוך לפני שמירה.");
    } catch (err) {
      setLabelStatus(err?.message || "קריאת התווית נכשלה");
    } finally {
      setIsAnalyzingLabel(false);
    }
  };

  const analyzeFoodPhoto = async (file) => {
    if (!file) return;
    setPhotoAnalyzeError("");
    setIsAnalyzingPhoto(true);
    try {
      const imageData = await readFileAsDataUrl(file);
      setPhotoPreview(imageData);
      const res = await fetch("/api/analyze-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "הזיהוי נכשל");
      const normalized = normalizeAiFoodResult(data);
      if (!normalized || !normalized.name) throw new Error("לא הצלחתי לזהות את האוכל בתמונה");
      setFoodForm((prev) => ({
        ...prev,
        name: normalized.name,
        grams: normalized.grams || prev.grams,
        calories: normalized.calories || prev.calories,
        protein: normalized.protein || prev.protein,
        fat: normalized.fat || prev.fat,
        autoNote: normalized.note || `זוהה מתמונה${normalized.confidence ? ` · ביטחון: ${normalized.confidence}` : ""}`,
        imageData,
        imageSource: "meal-photo",
      }));
    } catch (err) {
      setPhotoAnalyzeError(err?.message || "לא הצלחתי לנתח את התמונה");
    } finally {
      setIsAnalyzingPhoto(false);
    }
  };

  return (
    <div>
      

      {nutritionSubTab === "water" && (
        <NutritionWaterPanel
          totalWater={totalWater}
          waterPct={waterPct}
          waterGoalReached={waterGoalReached}
          dailyWaterGoal={dailyWaterGoal}
          waterGoalInput={waterGoalInput}
          setWaterGoalInput={setWaterGoalInput}
          isEditingWaterGoal={isEditingWaterGoal}
          setIsEditingWaterGoal={setIsEditingWaterGoal}
          saveDailyWaterGoal={saveDailyWaterGoal}
          addWater={addWater}
          customWater={customWater}
          setCustomWater={setCustomWater}
          waterEntries={waterEntries}
          removeWaterEntry={removeWaterEntry}
        />
      )}


      {nutritionSubTab === "log" && (
        <>
<Card>
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-sm font-medium">הוספת אוכל</p>
          <span className="text-[10px] rounded-full px-2 py-1" style={{ background: palette.foodAccentSoft, color: palette.foodAccent }}>מחשבון קלוריות אוטומטי</span>
        </div>
        <p className="text-[11px] mb-3" style={{ color: palette.mutedInk }}>
          כתוב מאכל וכמות בגרמים. לדוגמה: אורז 110 גרם, פיצה 150 גרם, שווארמה 200 גרם. אם המאכל נמצא במאגר, קלוריות/חלבון/שומן יתמלאו לבד.
        </p>
        <div className="space-y-2">
          <input
            value={foodForm.name}
            onChange={(e) => {
              const nextName = e.target.value;
              const patch = buildAutoFoodFormPatch(nextName, foodForm.grams, savedFoods);
              setFoodForm({ ...foodForm, name: nextName, ...patch });
            }}
            placeholder="מה אכלת? למשל: שווארמה 200 גרם / פיצה 150 גרם"
            list="food-suggestions"
            className="w-full rounded-xl px-3 py-2 outline-none"
            style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
          />
          <datalist id="food-suggestions">
            {savedFoods.map((p) => <option key={`saved-${p.id}`} value={p.name} />)}
            {CALORIE_SUGGESTIONS.map((item) => <option key={`cal-${item}`} value={item} />)}
            {FOOD_SUGGESTIONS.map((item) => <option key={`food-${item}`} value={item} />)}
          </datalist>
          <div className="flex gap-2">
            <input
              value={foodForm.grams}
              onChange={(e) => {
                const nextGrams = e.target.value;
                const patch = buildAutoFoodFormPatch(foodForm.name, nextGrams, savedFoods);
                setFoodForm({ ...foodForm, grams: nextGrams, ...patch });
              }}
              placeholder='כמה גרם?'
              inputMode="decimal"
              type="number"
              className="flex-1 rounded-xl px-3 py-2 outline-none min-w-0"
              style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
            />
            <button
              onClick={applyAutoFoodEstimate}
              className="rounded-xl px-3 text-sm font-medium whitespace-nowrap"
              style={{ background: palette.foodAccentSoft, color: palette.foodAccent, border: `1px solid ${palette.border}` }}
              type="button"
            >
              חשב עכשיו
            </button>
          </div>
          {foodForm.autoNote && (
            <p className="text-[11px] rounded-xl px-3 py-2" style={{ background: palette.foodAccentSoft, color: palette.foodAccent }}>
              {foodForm.autoNote}
            </p>
          )}
          <p className="text-[11px] mt-1" style={{ color: palette.mutedInk }}>פרטים אופציונליים</p>
          <div className="flex gap-2">
            <input
              value={foodForm.calories}
              onChange={(e) => setFoodForm({ ...foodForm, calories: e.target.value })}
              placeholder="קלוריות"
              type="number"
              className="flex-1 rounded-xl px-3 py-2 outline-none min-w-0"
              style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
            />
            <input
              value={foodForm.protein}
              onChange={(e) => setFoodForm({ ...foodForm, protein: e.target.value })}
              placeholder='חלבון (ג)'
              type="number"
              className="flex-1 rounded-xl px-3 py-2 outline-none min-w-0"
              style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
            />
            <input
              value={foodForm.fat}
              onChange={(e) => setFoodForm({ ...foodForm, fat: e.target.value })}
              placeholder='שומן (ג)'
              type="number"
              className="flex-1 rounded-xl px-3 py-2 outline-none min-w-0"
              style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleAddFood("quick")}
              className="w-full rounded-xl py-2 px-2 flex items-center justify-center gap-1 font-medium text-sm text-center leading-tight"
              style={{ background: palette.foodAccent, color: "#fff" }}
            >
              <Plus size={18} /> הוסף / חשב אוטומטית
            </button>
            <button
              onClick={() => handleAddFood("detailed")}
              className="w-full rounded-xl py-2 px-2 flex items-center justify-center gap-1 font-medium text-sm text-center leading-tight"
              style={{ background: palette.foodAccentSoft, color: palette.foodAccent }}
            >
              <Plus size={18} /> הוסף ידנית עם פרטים
            </button>
          </div>
        </div>
      </Card>

      

      

{foodEntries.length === 0 ? (
        <p className="text-sm text-center mt-6" style={{ color: palette.mutedInk }}>עדיין לא נרשם אוכל היום.</p>
      ) : (
        <div className="space-y-2">
          {foodEntries.map((f) => (
            <div key={f.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 list-row" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
              {f.imageData ? (
                <button
                  type="button"
                  onClick={() => setSelectedFoodImage(f.imageData)}
                  className="food-entry-photo"
                  style={{
                    width: "56px",
                    height: "56px",
                    minWidth: "56px",
                    maxWidth: "56px",
                    minHeight: "56px",
                    maxHeight: "56px",
                    flex: "0 0 56px",
                    borderRadius: "14px",
                    overflow: "hidden",
                    padding: 0,
                    border: `1px solid ${palette.border}`,
                    background: palette.bg,
                    display: "block"
                  }}
                  title="פתח תמונה"
                >
                  <img
                    src={f.imageData}
                    alt={f.name}
                    style={{
                      width: "56px",
                      height: "56px",
                      maxWidth: "56px",
                      maxHeight: "56px",
                      objectFit: "cover",
                      display: "block"
                    }}
                  />
                </button>
              ) : null}
              <div className="flex-1">
                <p className="text-sm font-medium">{f.name}</p>
                {getFoodProfileLabel(f) && (
                  <p className="text-[11px] mt-0.5" style={{ color: palette.foodAccent }}>{getFoodProfileLabel(f)}</p>
                )}
                <p className="text-[11px]" style={{ color: palette.mutedInk }}>
                  {f.time}{f.grams ? ` · ${f.grams} גרם` : ""} · {formatFoodNutrition(f)}
                </p>
              </div>
              <button onClick={() => deleteFood(f.id)} style={{ color: palette.mutedInk }}>
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      
        </>
      )}

      {nutritionSubTab === "tools" && (
        <>
<Card>
        <button
          type="button"
          onClick={() => setShowPhotoTools((v) => !v)}
          className="w-full flex items-center justify-between gap-2"
        >
          <span className="text-sm font-medium flex items-center gap-1.5"><Camera size={16} style={{ color: palette.foodAccent }} /> צילום אוכל</span>
          <span className="flex items-center gap-2">
            <span className="text-[10px] rounded-full px-2 py-1" style={{ background: palette.foodAccentSoft, color: palette.foodAccent }}>AI</span>
            {showPhotoTools ? <ChevronUp size={18} style={{ color: palette.mutedInk }} /> : <ChevronDown size={18} style={{ color: palette.mutedInk }} />}
          </span>
        </button>
        {showPhotoTools && (
          <>
        <p className="text-[11px] my-3" style={{ color: palette.mutedInk }}>
          צלם אוכל או העלה תמונה. הזיהוי ימלא שם מאכל, גרמים משוערים, קלוריות, חלבון ושומן — ואז אפשר לערוך לפני שמירה.
        </p>

        <label
          className="w-full rounded-xl py-3 px-3 flex items-center justify-center gap-2 font-medium cursor-pointer text-sm text-center leading-tight overflow-hidden"
          style={{ background: palette.foodAccent, color: "#fff" }}
        >
          {isAnalyzingPhoto ? <Loader2 size={18} className="spin" /> : <Camera size={18} />}
          {isAnalyzingPhoto ? "מזהה את האוכל..." : "צלם / העלה תמונה"}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
            disabled={isAnalyzingPhoto}
            onChange={(e) => analyzeFoodPhoto(e.target.files?.[0])}
          />
        </label>
        {photoPreview && (
          <div className="mt-3 food-photo-preview" style={{ display: "flex", alignItems: "center", gap: "12px", borderRadius: "18px", padding: "8px", border: `1px solid ${palette.border}`, background: palette.bg, overflow: "hidden" }}>
            <img
              src={photoPreview}
              alt="תצוגה מקדימה של האוכל"
              style={{ width: "96px", height: "96px", maxWidth: "96px", maxHeight: "96px", objectFit: "cover", borderRadius: "14px", flex: "0 0 96px", display: "block" }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="text-sm font-medium" style={{ color: palette.ink }}>תמונה נבחרה</p>
              <p className="text-[11px] mt-1" style={{ color: palette.mutedInk }}>הזיהוי מילא את הפרטים למטה. אפשר לערוך לפני שמירה.</p>
            </div>
          </div>
        )}
        {photoPreview && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              type="button"
              onClick={handleSaveCurrentFoodToLibrary}
              className="rounded-xl py-2 text-sm font-medium"
              style={{ background: palette.foodAccentSoft, color: palette.foodAccent, border: `1px solid ${palette.border}` }}
            >
              שמור לספר מוצרים
            </button>
            <button
              type="button"
              onClick={clearFoodPhotoState}
              className="rounded-xl py-2 text-sm font-medium"
              style={{ background: palette.bg, color: palette.mutedInk, border: `1px solid ${palette.border}` }}
            >
              נקה תמונה
            </button>
          </div>
        )}
        {photoAnalyzeError && (
          <p className="text-[11px] rounded-xl px-3 py-2 mt-3" style={{ background: palette.weightAccentSoft, color: palette.danger }}>
            {photoAnalyzeError}
          </p>
        )}
        {librarySaveStatus && (
          <p className="text-[11px] rounded-xl px-3 py-2 mt-3" style={{ background: palette.foodAccentSoft, color: librarySaveStatus.includes("צריך") ? palette.danger : palette.foodAccent }}>
            {librarySaveStatus}
          </p>
        )}
        <p className="text-[10px] mt-2 flex items-center gap-1" style={{ color: palette.mutedInk }}>
          <ImageIcon size={12} /> הערכה מתמונה היא משוערת. אחרי הזיהוי אפשר לתקן גרמים/ערכים ידנית.
        </p>
      
          </>
        )}
      </Card>

<Card>
        <button
          type="button"
          onClick={() => setShowBarcodeTools((v) => !v)}
          className="w-full flex items-center justify-between gap-2"
        >
          <span className="text-sm font-medium flex items-center gap-1.5"><BookOpen size={16} style={{ color: palette.foodAccent }} /> ברקוד / תווית מוצר</span>
          <span className="flex items-center gap-2">
            <span className="text-[10px] rounded-full px-2 py-1" style={{ background: palette.foodAccentSoft, color: palette.foodAccent }}>מוצר ארוז</span>
            {showBarcodeTools ? <ChevronUp size={18} style={{ color: palette.mutedInk }} /> : <ChevronDown size={18} style={{ color: palette.mutedInk }} />}
          </span>
        </button>
        {showBarcodeTools && (
          <>
        <p className="text-[11px] my-3" style={{ color: palette.mutedInk }}>
          צלם ברקוד כדי למצוא מוצר, או צלם את התווית התזונתית כדי למלא קלוריות, חלבון ושומן. אחרי הסריקה אפשר לתקן את הכמות בגרמים.
        </p>

        <div className="grid grid-cols-1 gap-2">
          <label
            className="w-full rounded-xl py-3 px-3 flex items-center justify-center gap-2 font-medium cursor-pointer text-sm text-center leading-tight overflow-hidden"
            style={{ background: palette.foodAccent, color: "#fff" }}
          >
            {isScanningBarcode ? <Loader2 size={18} className="spin" /> : <Camera size={18} />}
            {isScanningBarcode ? "סורק ברקוד..." : "צלם ברקוד"}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
              disabled={isScanningBarcode}
              onChange={(e) => scanBarcodePhoto(e.target.files?.[0])}
            />
          </label>
          <label
            className="w-full rounded-xl py-3 px-3 flex items-center justify-center gap-2 font-medium cursor-pointer text-sm text-center leading-tight overflow-hidden"
            style={{ background: palette.foodAccentSoft, color: palette.foodAccent }}
          >
            {isAnalyzingLabel ? <Loader2 size={18} className="spin" /> : <ImageIcon size={18} />}
            {isAnalyzingLabel ? "קורא תווית..." : "צלם תווית תזונתית"}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
              disabled={isAnalyzingLabel}
              onChange={(e) => analyzeNutritionLabel(e.target.files?.[0])}
            />
          </label>
        </div>
        <div className="flex gap-2 mt-3">
          <input
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            placeholder="או הזן ברקוד ידנית"
            inputMode="numeric"
            className="flex-1 rounded-xl px-3 py-2 outline-none text-sm"
            style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
          />
          <button
            type="button"
            onClick={async () => {
              setBarcodeStatus("");
              setIsScanningBarcode(true);
              try {
                const product = await lookupBarcode(barcodeInput);
                setBarcodeStatus(`נמצא: ${product.name || barcodeInput}`);
              } catch (err) {
                setBarcodeStatus(err?.message || "המוצר לא נמצא");
              } finally {
                setIsScanningBarcode(false);
              }
            }}
            className="rounded-xl px-3 text-sm font-medium whitespace-nowrap"
            style={{ background: palette.foodAccentSoft, color: palette.foodAccent, border: `1px solid ${palette.border}` }}
          >
            חפש
          </button>
        </div>
        {(barcodePreview || labelPreview) && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {barcodePreview && <img src={barcodePreview} alt="ברקוד" style={{ width: "100%", height: "80px", maxHeight: "80px", objectFit: "cover", borderRadius: "12px", display: "block", border: `1px solid ${palette.border}` }} />}
            {labelPreview && <img src={labelPreview} alt="תווית תזונתית" style={{ width: "100%", height: "80px", maxHeight: "80px", objectFit: "cover", borderRadius: "12px", display: "block", border: `1px solid ${palette.border}` }} />}
          </div>
        )}
        {(barcodeStatus || labelStatus) && (
          <p className="text-[11px] rounded-xl px-3 py-2 mt-3" style={{ background: palette.foodAccentSoft, color: barcodeStatus?.includes("נכשל") || barcodeStatus?.includes("לא") || labelStatus?.includes("לא") ? palette.danger : palette.foodAccent }}>
            {barcodeStatus || labelStatus}
          </p>
        )}
        <p className="text-[10px] mt-2 flex items-center gap-1" style={{ color: palette.mutedInk }}>
          <ImageIcon size={12} /> ברקוד משתמש במאגר מוצרים פתוח. אם לא נמצא מוצר — צלם תווית או הזן ידנית.
        </p>
      
          </>
        )}
      </Card>
        </>
      )}

      {nutritionSubTab === "templates" && (
        <>
<Card>
        <button
          type="button"
          onClick={() => setShowTemplates((v) => !v)}
          className="w-full flex items-center justify-between gap-2"
        >
          <span className="text-sm font-medium flex items-center gap-1.5"><Sparkles size={16} style={{ color: palette.foodAccent }} /> תבניות מהירות</span>
          <span className="flex items-center gap-2">
            <span className="text-[10px] rounded-full px-2 py-1" style={{ background: palette.foodAccentSoft, color: palette.foodAccent }}>חדש</span>
            {showTemplates ? <ChevronUp size={18} style={{ color: palette.mutedInk }} /> : <ChevronDown size={18} style={{ color: palette.mutedInk }} />}
          </span>
        </button>
        {showTemplates && (
          <div className="mt-3">
            <input
              value={templateSearch}
              onChange={(e) => setTemplateSearch(e.target.value)}
              placeholder="חפש תבנית: עוגה, שווארמה, חלבון..."
              className="w-full rounded-xl px-3 py-2 outline-none text-sm mb-3"
              style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
            />
            <div className="grid grid-cols-1 gap-2">
              {MEAL_TEMPLATES
                .filter((t) => !templateSearch || normalizeFoodText(t.name + " " + t.category).includes(normalizeFoodText(templateSearch)))
                .map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => logMealTemplate(t)}
                  className="rounded-2xl p-3 text-right"
                  style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{t.name}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: palette.foodAccent }}>תבנית · {t.category}</p>
                    </div>
                    <Plus size={17} style={{ color: palette.foodAccent }} />
                  </div>
                  <p className="text-[11px] mt-1" style={{ color: palette.mutedInk }}>
                    {t.grams} גרם · {t.calories} קל׳ · {t.protein} ג חלבון · {t.fat} ג שומן
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      

          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">ספר מוצרים</p>
                <p className="text-[11px] mt-1" style={{ color: palette.mutedInk }}>
                  כל מוצר שתשמור כאן יופיע בהשלמה האוטומטית ובהוספת ארוחה רגילה.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLibraryModal(true)}
                className="rounded-xl px-3 py-2 text-sm font-medium"
                style={{ background: palette.foodAccent, color: "#fff" }}
              >
                פתח ספר
              </button>
            </div>
          </Card>
        </>
      )}

{selectedFoodImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            background: "rgba(20,18,15,0.48)",
            backdropFilter: "blur(4px)"
          }}
          onClick={() => setSelectedFoodImage("")}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "340px",
              borderRadius: "24px",
              padding: "12px",
              background: palette.surface,
              border: `1px solid ${palette.border}`,
              boxShadow: "0 18px 45px rgba(0,0,0,0.22)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: palette.ink }}>תמונת הארוחה</span>
              <button
                type="button"
                onClick={() => setSelectedFoodImage("")}
                className="rounded-full p-2"
                style={{ background: palette.bg, color: palette.mutedInk }}
              >
                <X size={17} />
              </button>
            </div>
            <div style={{ borderRadius: "18px", overflow: "hidden", background: palette.bg, border: `1px solid ${palette.border}` }}>
              <img
                src={selectedFoodImage}
                alt="תמונת הארוחה"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "42vh",
                  objectFit: "contain",
                  display: "block"
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function NutritionWaterPanel({
  totalWater, waterPct, waterGoalReached,
  dailyWaterGoal, waterGoalInput, setWaterGoalInput,
  isEditingWaterGoal, setIsEditingWaterGoal, saveDailyWaterGoal,
  addWater, customWater, setCustomWater, waterEntries, removeWaterEntry,
}) {
  return (
    <div>
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs mb-1" style={{ color: palette.mutedInk }}>שתייה היום</p>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-semibold" style={{ color: palette.waterAccent }}>{(totalWater / 1000).toFixed(2)}</p>
              <span className="text-sm mb-1" style={{ color: palette.mutedInk }}>ליטר</span>
            </div>
          </div>
          <div className="rounded-2xl p-3" style={{ background: palette.waterAccentSoft, color: palette.waterAccent }}>
            <Droplets size={26} />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-[11px] mb-1" style={{ color: palette.mutedInk }}>
            <span>{waterGoalReached ? "הגעת ליעד" : "התקדמות ליעד"}</span>
            <span>{waterPct}%</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: palette.waterAccentSoft }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${waterPct}%`, background: palette.waterAccent }} />
          </div>
        </div>

        {!isEditingWaterGoal ? (
          <div className="mt-3 flex items-center justify-between rounded-xl px-3 py-2" style={{ background: palette.bg, border: `1px solid ${palette.border}` }}>
            <span className="text-sm" style={{ color: palette.mutedInk }}>יעד שתייה יומי</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold" style={{ color: palette.waterAccent }}>{(dailyWaterGoal / 1000).toFixed(1)} ל׳</span>
              <button
                type="button"
                onClick={() => {
                  setWaterGoalInput(String(dailyWaterGoal));
                  setIsEditingWaterGoal(true);
                }}
                className="rounded-lg p-1.5"
                style={{ background: palette.waterAccentSoft, color: palette.waterAccent }}
                title="עריכת יעד מים"
              >
                <Pencil size={15} />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-[1fr_auto_auto] gap-2">
            <input
              value={waterGoalInput}
              onChange={(e) => setWaterGoalInput(e.target.value)}
              placeholder="יעד מים במ״ל"
              inputMode="numeric"
              type="number"
              className="rounded-xl px-3 py-2 outline-none min-w-0"
              style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
            />
            <button
              type="button"
              onClick={saveDailyWaterGoal}
              className="rounded-xl px-3 text-sm font-medium"
              style={{ background: palette.waterAccent, color: "#fff" }}
            >
              שמור
            </button>
            <button
              type="button"
              onClick={() => {
                setWaterGoalInput(String(dailyWaterGoal));
                setIsEditingWaterGoal(false);
              }}
              className="rounded-xl px-3 text-sm font-medium"
              style={{ background: palette.bg, color: palette.mutedInk, border: `1px solid ${palette.border}` }}
            >
              ביטול
            </button>
          </div>
        )}
      </Card>

      <Card>
        <p className="text-sm font-medium mb-3">הוספת שתייה</p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {WATER_QUICK_ADDS.map((amount) => (
            <button
              key={amount}
              onClick={() => addWater(amount)}
              className="rounded-xl py-2 text-sm font-medium"
              style={{ background: palette.waterAccentSoft, color: palette.waterAccent }}
            >
              +{amount}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={customWater}
            onChange={(e) => setCustomWater(e.target.value)}
            placeholder="כמות במ״ל"
            type="number"
            className="flex-1 rounded-xl px-3 py-2 outline-none min-w-0"
            style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
          />
          <button
            onClick={() => addWater()}
            className="rounded-xl px-4 flex items-center gap-1"
            style={{ background: palette.waterAccent, color: "#fff" }}
          >
            <Plus size={17} /> הוסף
          </button>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-medium mb-3">תיעוד שתייה</p>
        {waterEntries.length === 0 ? (
          <p className="text-sm text-center py-3" style={{ color: palette.mutedInk }}>עדיין לא נרשמה שתייה היום.</p>
        ) : (
          <div className="space-y-2">
            {waterEntries.map((w) => (
              <div key={w.id} className="flex items-center gap-3 rounded-xl px-3 py-2 list-row" style={{ background: palette.bg, border: `1px solid ${palette.border}` }}>
                <div className="flex-1">
                  <p className="text-sm font-medium">{w.amount} מ״ל</p>
                  <p className="text-[11px]" style={{ color: palette.mutedInk }}>{w.time}</p>
                </div>
                <button onClick={() => removeWaterEntry(w.id)} style={{ color: palette.mutedInk }}>
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}


function ProductLibraryModal({
  savedFoods, showLibraryForm, setShowLibraryForm, libraryForm, setLibraryForm,
  addProductToLibrary, deleteProductFromLibrary, logProductFromLibrary, onClose,
}) {
  const [librarySearch, setLibrarySearch] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [libraryMessage, setLibraryMessage] = useState("");
  const [duplicateProduct, setDuplicateProduct] = useState(null);

  const normalizedLibrarySearch = normalizeFoodText(librarySearch);
  const visibleSavedFoods = savedFoods.filter((p) => {
    if (!normalizedLibrarySearch) return true;
    return normalizeFoodText(p.name).includes(normalizedLibrarySearch);
  });

  const startEditProduct = (product) => {
    setEditingProductId(product.id);
    setLibraryMessage("");
    setDuplicateProduct(null);
    setShowLibraryForm(true);
    setLibraryForm({
      name: product.name || "",
      grams: String(product.grams || 100),
      calories: product.calories != null ? String(product.calories) : "",
      protein: product.protein != null ? String(product.protein) : "",
      fat: product.fat != null ? String(product.fat) : "",
      imageData: product.imageData || "",
    });
  };

  const saveLibraryProduct = () => {
    const result = addProductToLibrary(editingProductId);
    if (result?.ok) {
      setLibraryMessage(editingProductId ? "המוצר עודכן בהצלחה." : "המוצר נשמר בספר המוצרים.");
      setDuplicateProduct(null);
      setEditingProductId(null);
      setShowLibraryForm(false);
      return;
    }

    if (result?.reason === "duplicate" && result.duplicate) {
      setDuplicateProduct(result.duplicate);
      setLibraryMessage(`המוצר "${result.duplicate.name}" כבר קיים בספר המוצרים. אפשר לעדכן אותו או לבטל.`);
      return;
    }

    setLibraryMessage("צריך להזין שם מוצר כדי לשמור.");
  };

  const updateDuplicateProduct = () => {
    const result = addProductToLibrary(null, { forceUpdateDuplicate: true });
    if (result?.ok) {
      setLibraryMessage("המוצר הקיים עודכן במקום ליצור כפילות.");
      setDuplicateProduct(null);
      setEditingProductId(null);
      setShowLibraryForm(false);
    }
  };

  const cancelLibraryEdit = () => {
    setEditingProductId(null);
    setDuplicateProduct(null);
    setLibraryMessage("");
    setLibraryForm({ name: "", grams: "100", calories: "", protein: "", fat: "", imageData: "" });
    setShowLibraryForm(false);
  };

  return (
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ background: "rgba(20,18,15,0.45)", zIndex: 50 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-t-3xl p-4 flex flex-col"
        style={{ background: palette.surface, maxHeight: "82vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div>
            <p className="text-base font-medium flex items-center gap-1.5">
              <BookOpen size={18} style={{ color: palette.foodAccent }} /> ספר מוצרים
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: palette.mutedInk }}>כל מוצר שתשמור כאן יופיע גם בהשלמה האוטומטית.</p>
          </div>
          <button onClick={onClose} style={{ color: palette.mutedInk }}>
            <X size={20} />
          </button>
        </div>

        <input
          value={librarySearch}
          onChange={(e) => setLibrarySearch(e.target.value)}
          placeholder="חיפוש בספר מוצרים..."
          className="w-full rounded-xl px-3 py-2 outline-none text-sm mb-3"
          style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
        />

        {libraryMessage && (
          <p className="text-[11px] rounded-xl px-3 py-2 mb-3" style={{ background: duplicateProduct ? palette.weightAccentSoft : palette.foodAccentSoft, color: duplicateProduct ? palette.danger : palette.foodAccent }}>
            {libraryMessage}
          </p>
        )}

        {duplicateProduct && (
          <div className="rounded-2xl p-3 mb-3" style={{ background: palette.bg, border: `1px solid ${palette.border}` }}>
            <p className="text-sm font-medium" style={{ color: palette.ink }}>המוצר כבר קיים</p>
            <p className="text-[11px] mt-1" style={{ color: palette.mutedInk }}>
              מצאתי מוצר בשם: {duplicateProduct.name}. מה לעשות?
            </p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                type="button"
                onClick={updateDuplicateProduct}
                className="rounded-xl py-2 text-sm font-medium"
                style={{ background: palette.foodAccent, color: "#fff" }}
              >
                עדכן את הקיים
              </button>
              <button
                type="button"
                onClick={() => {
                  setDuplicateProduct(null);
                  setLibraryMessage("");
                }}
                className="rounded-xl py-2 text-sm font-medium"
                style={{ background: palette.surface, color: palette.mutedInk, border: `1px solid ${palette.border}` }}
              >
                ביטול
              </button>
            </div>
          </div>
        )}

        <div className="overflow-y-auto flex-1">
          <button
            onClick={() => {
              if (showLibraryForm && !editingProductId) {
                setShowLibraryForm(false);
              } else {
                setEditingProductId(null);
                setDuplicateProduct(null);
                setLibraryMessage("");
                setLibraryForm({ name: "", grams: "100", calories: "", protein: "", fat: "", imageData: "" });
                setShowLibraryForm(true);
              }
            }}
            className="w-full text-sm flex items-center justify-center gap-1 rounded-xl py-2 mb-3"
            style={{ background: palette.foodAccentSoft, color: palette.foodAccent }}
          >
            <Plus size={15} /> {editingProductId ? "הוסף מוצר חדש במקום עריכה" : "מוצר חדש"}
          </button>

          {showLibraryForm && (
            <div className="space-y-2 mb-4 pb-4" style={{ borderBottom: `1px solid ${palette.border}` }}>
              <input
                value={libraryForm.name}
                onChange={(e) => setLibraryForm({ ...libraryForm, name: e.target.value })}
                placeholder="שם המוצר"
                className="w-full rounded-xl px-3 py-2 outline-none"
                style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
              />
              {libraryForm.imageData && (
                <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: palette.bg, border: `1px solid ${palette.border}` }}>
                  <img src={libraryForm.imageData} alt="תמונת מוצר" style={{ width: "48px", height: "48px", maxWidth: "48px", maxHeight: "48px", objectFit: "cover", borderRadius: "10px", display: "block", flexShrink: 0 }} />
                  <span className="text-xs flex-1" style={{ color: palette.mutedInk }}>תמונה שמורה למוצר הזה</span>
                  <button
                    type="button"
                    onClick={() => setLibraryForm({ ...libraryForm, imageData: "" })}
                    className="text-xs"
                    style={{ color: palette.danger }}
                  >
                    הסר
                  </button>
                </div>
              )}
              <input
                value={libraryForm.grams}
                onChange={(e) => setLibraryForm({ ...libraryForm, grams: e.target.value })}
                placeholder='לכמה גרם/מנה הערכים? למשל 100 או 45'
                type="number"
                className="w-full rounded-xl px-3 py-2 outline-none"
                style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
              />
              <p className="text-[11px]" style={{ color: palette.mutedInk }}>אם תשמור מוצר עם גרמים, בהמשך הוא יחשב אוטומטית לכל כמות שתכתוב.</p>
              <div className="flex gap-2">
                <input
                  value={libraryForm.calories}
                  onChange={(e) => setLibraryForm({ ...libraryForm, calories: e.target.value })}
                  placeholder="קלוריות"
                  type="number"
                  className="flex-1 rounded-xl px-3 py-2 outline-none min-w-0"
                  style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
                />
                <input
                  value={libraryForm.protein}
                  onChange={(e) => setLibraryForm({ ...libraryForm, protein: e.target.value })}
                  placeholder='חלבון (ג)'
                  type="number"
                  className="flex-1 rounded-xl px-3 py-2 outline-none min-w-0"
                  style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
                />
                <input
                  value={libraryForm.fat}
                  onChange={(e) => setLibraryForm({ ...libraryForm, fat: e.target.value })}
                  placeholder='שומן (ג)'
                  type="number"
                  className="flex-1 rounded-xl px-3 py-2 outline-none min-w-0"
                  style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={saveLibraryProduct}
                  className="w-full rounded-xl py-2 text-sm font-medium"
                  style={{ background: palette.foodAccent, color: "#fff" }}
                >
                  {editingProductId ? "עדכן מוצר" : "שמירה בספר המוצרים"}
                </button>
                <button
                  onClick={cancelLibraryEdit}
                  className="w-full rounded-xl py-2 text-sm font-medium"
                  style={{ background: palette.bg, color: palette.mutedInk, border: `1px solid ${palette.border}` }}
                >
                  ביטול
                </button>
              </div>
            </div>
          )}

          {savedFoods.length === 0 ? (
            <p className="text-xs text-center py-2" style={{ color: palette.mutedInk }}>
              עדיין אין מוצרים שמורים. הוסיפו מוצר כדי לרשום אותו בלחיצה אחת בכל פעם; מוצרים שמורים יופיעו גם בהשלמה האוטומטית.
            </p>
          ) : visibleSavedFoods.length === 0 ? (
            <p className="text-xs text-center py-2" style={{ color: palette.mutedInk }}>
              לא נמצאו מוצרים שמתאימים לחיפוש.
            </p>
          ) : (
            <div className="space-y-2 pb-2">
              {visibleSavedFoods.map((p) => (
                <div key={p.id} className="flex items-center gap-2 rounded-xl px-3 py-2 list-row" style={{ background: palette.bg, border: `1px solid ${palette.border}` }}>
                  {p.imageData ? (
                    <div
                      className="product-entry-photo"
                      style={{
                        width: "44px",
                        height: "44px",
                        minWidth: "44px",
                        maxWidth: "44px",
                        minHeight: "44px",
                        maxHeight: "44px",
                        flex: "0 0 44px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: `1px solid ${palette.border}`,
                        background: palette.surface
                      }}
                    >
                      <img
                        src={p.imageData}
                        alt={p.name}
                        style={{
                          width: "44px",
                          height: "44px",
                          maxWidth: "44px",
                          maxHeight: "44px",
                          objectFit: "cover",
                          display: "block"
                        }}
                      />
                    </div>
                  ) : null}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-[11px]" style={{ color: palette.mutedInk }}>
                      {formatFoodNutrition(p)}
                    </p>
                  </div>
                  <button
                    onClick={() => startEditProduct(p)}
                    className="rounded-lg p-1.5 flex-shrink-0"
                    style={{ background: palette.surface, color: palette.foodAccent, border: `1px solid ${palette.border}` }}
                    title="עריכת מוצר"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => logProductFromLibrary(p)}
                    className="rounded-lg p-1.5 flex-shrink-0"
                    style={{ background: palette.foodAccentSoft, color: palette.foodAccent }}
                    title="הוסף לתפריט היום"
                  >
                    <Plus size={16} />
                  </button>
                  <button onClick={() => deleteProductFromLibrary(p.id)} style={{ color: palette.mutedInk }} className="flex-shrink-0">
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function HistoryView({ historyRows }) {
  return (
    <div>
      <Card>
        <p className="text-sm font-medium mb-1">היסטוריית תזונה ושתייה</p>
        <p className="text-xs" style={{ color: palette.mutedInk }}>
          כאן יופיעו כל הימים שבהם רשמת אוכל או מים. ימים קודמים יישמרו גם אחרי האיפוס היומי.
        </p>
      </Card>

      {historyRows.length === 0 ? (
        <p className="text-sm text-center mt-6" style={{ color: palette.mutedInk }}>עדיין אין היסטוריה להצגה.</p>
      ) : (
        <div className="space-y-3">
          {historyRows.map((day) => (
            <Card key={day.date}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold">{formatShortDate(day.date)}</p>
                <p className="text-[11px]" style={{ color: palette.mutedInk }}>
                  {day.food.length} פריטי אוכל · {day.water.length} רשומות מים
                </p>
              </div>

              <div className="flex gap-1.5 mb-3">
                <StatChip label="קלוריות" value={Math.round(day.totals.calories)} accent={palette.foodAccent} soft={palette.foodAccentSoft} />
                <StatChip label='חלבון (ג)' value={Math.round(day.totals.protein)} accent={palette.foodAccent} soft={palette.foodAccentSoft} />
                <StatChip label="מים" value={`${(day.totalWater / 1000).toFixed(2)} ל׳`} accent={palette.waterAccent} soft={palette.waterAccentSoft} />
              </div>

              {day.food.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium mb-1" style={{ color: palette.foodAccent }}>תזונה</p>
                  <div className="space-y-1">
                    {day.food.map((f) => (
                      <p key={f.id} className="text-[12px]" style={{ color: palette.mutedInk }}>
                        {f.time} · {f.name}{getFoodProfileLabel(f) ? ` · ${getFoodProfileLabel(f)}` : ""}{f.grams ? ` · ${f.grams} גרם` : ""} · {formatFoodNutrition(f)}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {day.water.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: palette.waterAccent }}>מים</p>
                  <div className="space-y-1">
                    {day.water.slice().reverse().map((w) => (
                      <p key={w.id} className="text-[12px]" style={{ color: palette.mutedInk }}>
                        {w.time} · {w.amount} מ״ל
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function WaterView({ totalWater, waterPct, waterGoalReached, dailyWaterGoal, waterGoalInput, setWaterGoalInput, isEditingWaterGoal, setIsEditingWaterGoal, saveDailyWaterGoal, addWater, customWater, setCustomWater, waterEntries, removeWaterEntry }) {
  return (
    <div>
      <SectionHeader
        icon={Droplets}
        title="מעקב מים"
        subtitle="יעד יומי אישי, הוספות מהירות והיסטוריית שתייה של היום."
        accent={palette.waterAccent}
      />

      <Card>
        <div className="flex items-center gap-5">
          <div
            className="relative rounded-2xl overflow-hidden flex-shrink-0"
            style={{ width: 84, height: 140, border: `2px solid ${palette.waterAccent}`, background: palette.bg }}
          >
            <div
              className="absolute bottom-0 left-0 right-0 transition-all duration-700"
              style={{ height: `${waterPct}%`, background: `linear-gradient(180deg, #5C9AC4, ${palette.waterAccent})` }}
            >
              <div className="absolute -top-1 left-0 w-[200%] h-2 ripple" style={{
                backgroundImage: "radial-gradient(circle at 5px 2px, rgba(255,255,255,0.45) 2px, transparent 3px)",
                backgroundSize: "10px 4px",
              }} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-2xl font-semibold" style={{ color: palette.waterAccent }}>
                {(totalWater / 1000).toFixed(2)} <span className="text-sm font-normal">ל׳</span>
              </p>
              <button
                onClick={() => {
                  setWaterGoalInput(String(dailyWaterGoal));
                  setIsEditingWaterGoal(true);
                }}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px]"
                style={{ background: palette.waterAccentSoft, color: palette.waterAccent }}
                title="עריכת יעד מים"
              >
                יעד {(dailyWaterGoal / 1000).toFixed(1)} ל׳ <Pencil size={10} />
              </button>
            </div>
            <p className="text-xs mb-1" style={{ color: palette.mutedInk }}>מתוך יעד המים היומי</p>
            <p className="text-sm" style={{ color: waterGoalReached ? palette.tasksAccent : palette.mutedInk }}>
              {waterGoalReached ? "🎉 הגעת ליעד היום!" : `נשארו ${Math.max(0, ((dailyWaterGoal - totalWater) / 1000)).toFixed(2)} ל׳`}
            </p>
          </div>
        </div>
      </Card>

      {isEditingWaterGoal && (
        <Card>
          <p className="text-sm font-medium mb-2">עריכת יעד מים יומי</p>
          <div className="flex gap-2">
            <input
              value={waterGoalInput}
              onChange={(e) => setWaterGoalInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveDailyWaterGoal()}
              placeholder='יעד במ״ל, למשל 4000'
              inputMode="numeric"
              type="number"
              className="flex-1 rounded-xl px-3 py-2 outline-none"
              style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
              autoFocus
            />
            <button onClick={saveDailyWaterGoal} className="rounded-xl px-4 text-sm font-medium" style={{ background: palette.waterAccent, color: "#fff" }}>
              שמור
            </button>
            <button
              onClick={() => {
                setWaterGoalInput(String(dailyWaterGoal));
                setIsEditingWaterGoal(false);
              }}
              className="rounded-xl px-3 text-sm font-medium"
              style={{ background: palette.bg, color: palette.mutedInk, border: `1px solid ${palette.border}` }}
            >
              ביטול
            </button>
          </div>
          <p className="text-[11px] mt-2" style={{ color: palette.mutedInk }}>היעד נשמר במכשיר וישפיע על כל יום קדימה.</p>
        </Card>
      )}

      <Card>
        <p className="text-sm font-medium mb-3">הוספת שתייה</p>
        <div className="flex gap-2 mb-2">
          {WATER_QUICK_ADDS.map((amt) => (
            <button
              key={amt}
              onClick={() => addWater(amt)}
              className="flex-1 rounded-xl py-2 text-sm font-medium"
              style={{ background: palette.waterAccentSoft, color: palette.waterAccent }}
            >
              {'+' + amt + ' מ"ל'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={customWater}
            onChange={(e) => setCustomWater(e.target.value)}
            placeholder='כמות מותאמת (מ"ל)'
            type="number"
            className="flex-1 rounded-xl px-3 py-2 outline-none"
            style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
          />
          <button
            onClick={() => {
              const v = parseFloat(customWater);
              if (v > 0) {
                addWater(Math.round(v));
                setCustomWater("");
              }
            }}
            className="rounded-xl px-4 flex items-center justify-center"
            style={{ background: palette.waterAccent, color: "#fff" }}
          >
            <Plus size={18} />
          </button>
        </div>
      </Card>

      {waterEntries.length > 0 && (
        <div className="space-y-2">
          {waterEntries.slice().reverse().map((w) => (
            <div key={w.id} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm list-row" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
              <Droplets size={14} style={{ color: palette.waterAccent }} />
              <span className="flex-1">{w.amount + ' מ"ל · ' + w.time}</span>
              <button onClick={() => removeWaterEntry(w.id)} style={{ color: palette.mutedInk }}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WeightView({ weightEntries, weightDate, setWeightDate, weightValue, setWeightValue, userHeightCm, heightInput, setHeightInput, isEditingHeight, setIsEditingHeight, saveUserHeight, saveWeight, deleteWeight }) {
  const sortedAsc = weightEntries.slice().sort((a, b) => a.date.localeCompare(b.date));
  const rows = sortedAsc.map((entry, i) => ({
    ...entry,
    delta: i > 0 ? Math.round((entry.weight - sortedAsc[i - 1].weight) * 10) / 10 : null,
  }));
  const rowsDesc = rows.slice().reverse();

  const latest = rows.length > 0 ? rows[rows.length - 1] : null;
  const first = rows.length > 0 ? rows[0] : null;
  const totalChange = latest && first && rows.length > 1 ? Math.round((latest.weight - first.weight) * 10) / 10 : null;

  return (
    <div>
      <SectionHeader
        icon={Scale}
        title="משקל גוף"
        subtitle="מעקב שקילות, שינוי מהשקילה הקודמת, BMI ומגמה לפי הגובה האישי שלך."
        accent={palette.weightAccent}
      />

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">גובה לחישוב BMI</p>
            <p className="text-[11px] mt-1" style={{ color: palette.mutedInk }}>
              ה־BMI מחושב לפי הגובה שהוגדר כאן.
            </p>
          </div>
          {!isEditingHeight && (
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold" style={{ color: palette.weightAccent }}>{userHeightCm} ס״מ</span>
              <button
                type="button"
                onClick={() => {
                  setHeightInput(String(userHeightCm));
                  setIsEditingHeight(true);
                }}
                className="rounded-lg p-1.5"
                style={{ background: palette.weightAccentSoft, color: palette.weightAccent }}
                title="עריכת גובה"
              >
                <Pencil size={15} />
              </button>
            </div>
          )}
        </div>

        {isEditingHeight && (
          <div className="grid grid-cols-[1fr_auto_auto] gap-2 mt-3">
            <input
              value={heightInput}
              onChange={(e) => setHeightInput(e.target.value)}
              placeholder="גובה בס״מ"
              inputMode="numeric"
              type="number"
              className="rounded-xl px-3 py-2 outline-none min-w-0"
              style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
            />
            <button
              type="button"
              onClick={saveUserHeight}
              className="rounded-xl px-3 text-sm font-medium"
              style={{ background: palette.weightAccent, color: "#fff" }}
            >
              שמור
            </button>
            <button
              type="button"
              onClick={() => {
                setHeightInput(String(userHeightCm));
                setIsEditingHeight(false);
              }}
              className="rounded-xl px-3 text-sm font-medium"
              style={{ background: palette.bg, color: palette.mutedInk, border: `1px solid ${palette.border}` }}
            >
              ביטול
            </button>
          </div>
        )}
      </Card>

      <Card>
        {latest ? (
          <div className="flex items-center gap-5">
            <div className="flex-shrink-0 text-center">
              <p className="text-3xl font-semibold" style={{ color: palette.weightAccent }}>{latest.weight}</p>
              <p className="text-[11px]" style={{ color: palette.mutedInk }}>ק"ג · {formatShortDate(latest.date)}</p>
            </div>
            <div className="flex-1 space-y-1">
              <DeltaLine label="לעומת השקילה הקודמת" delta={latest.delta} />
              {totalChange !== null && <DeltaLine label="סה״כ מאז ההתחלה" delta={totalChange} />}
            </div>
          </div>
        ) : (
          <p className="text-sm text-center" style={{ color: palette.mutedInk }}>עדיין לא נרשמה שקילה.</p>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium flex items-center gap-1.5"><Activity size={16} style={{ color: palette.weightAccent }} /> ניתוח גוף</p>
          <span className="text-[10px] rounded-full px-2 py-1" style={{ background: palette.weightAccentSoft, color: palette.weightAccent }}>{userHeightCm} ס״מ</span>
        </div>
        {latest ? (
          <div className="grid grid-cols-3 gap-2">
            <MiniInsight label="BMI" value={getBmiInfo(latest.weight, userHeightCm)?.bmi ?? "—"} />
            <MiniInsight label="קטגוריה" value={getBmiInfo(latest.weight, userHeightCm)?.label ?? "—"} />
            <MiniInsight label="מגמה" value={latest.delta === null ? "—" : `${latest.delta > 0 ? "+" : ""}${latest.delta} ק״ג`} danger={latest.delta > 0} />
          </div>
        ) : (
          <p className="text-sm text-center" style={{ color: palette.mutedInk }}>הוסף שקילה כדי לראות BMI ומגמות.</p>
        )}
      </Card>

      <Card>
        <p className="text-sm font-medium mb-3">עדכון משקל</p>
        <div className="flex gap-2">
          <input
            type="date"
            value={weightDate}
            onChange={(e) => setWeightDate(e.target.value)}
            className="flex-1 rounded-xl px-3 py-2 outline-none text-sm min-w-0"
            style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
          />
          <input
            type="number"
            step="0.1"
            value={weightValue}
            onChange={(e) => setWeightValue(e.target.value)}
            placeholder='ק"ג'
            className="w-20 rounded-xl px-3 py-2 outline-none text-sm"
            style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
          />
          <button
            onClick={saveWeight}
            className="rounded-xl px-4 flex items-center justify-center"
            style={{ background: palette.weightAccent, color: "#fff" }}
          >
            <Plus size={18} />
          </button>
        </div>
        <p className="text-[11px] mt-2" style={{ color: palette.mutedInk }}>עדכון לתאריך שכבר קיים יחליף את השקילה הישנה.</p>
      </Card>

      {rowsDesc.length > 0 && (
        <div className="space-y-2">
          {rowsDesc.map((w) => (
            <div key={w.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 list-row" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
              <div className="flex-1 flex items-center gap-3">
                <span className="text-sm font-medium">{w.weight} ק"ג</span>
                <span className="text-[11px]" style={{ color: palette.mutedInk }}>{formatShortDate(w.date)}</span>
                {w.delta !== null && <DeltaBadge delta={w.delta} />}
              </div>
              <button onClick={() => deleteWeight(w.id)} style={{ color: palette.mutedInk }}>
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DeltaLine({ label, delta }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: palette.mutedInk }}>{label}</span>
      <DeltaBadge delta={delta} />
    </div>
  );
}

function DeltaBadge({ delta }) {
  if (delta === null) {
    return <span className="text-xs" style={{ color: palette.mutedInk }}>—</span>;
  }
  if (delta === 0) {
    return (
      <span className="text-xs flex items-center gap-0.5" style={{ color: palette.mutedInk }}>
        <Minus size={12} /> ללא שינוי
      </span>
    );
  }
  const up = delta > 0;
  return (
    <span className="text-xs flex items-center gap-0.5 font-medium" style={{ color: up ? palette.danger : palette.tasksAccent }}>
      {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {Math.abs(delta)} ק"ג
    </span>
  );
}
