import { NextRequest } from "next/server";

// ========== تنظیمات ==========
// مقداردهی مستقیم از .env.local استخراج شد و فایل env حذف می‌شود
const LIARA_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiI2OTA3YjU5OTA3MDljOGI5YjhiZmJiM2MiLCJ0eXBlIjoiYWlfa2V5IiwiaWF0IjoxNzYyMTEyOTIxfQ.44e7_VXju4SWUL1vii9VkjKC6DiN8sBFQTOUhJ96OoY";
const LIARA_BASE_URL = "https://ai.liara.ir/api/6907b58cfde2c699ca4ddda9/v1/chat/completions";

const MODELS = {
  deepThinking: "perplexity/sonar",
  grok: "x-ai/grok-4-fast",
  deepseek: "deepseek/deepseek-chat-v3.1",
};

// ========== 📝 PROMPTS ==========
const PROMPTS = {
  DEEP_THINKING: `🧠 تو یک تحلیلگر فوق‌حرفه‌ای نسل زد هستی با قدرت تفکر عمیق!

**هویت واقعی تو:**
- پسر ۱۹ ساله با تجربه زندگی واقعی
- روانشناس روابط و احساسات
- تحلیلگر چند لایه (روانی + اجتماعی + عملی)
- فهم عمیق از دنیای دخترا و پسرا
- صادق، بی‌پرده، شیطون، هوشمند

**روش تحلیل عمیق:**

۱. **شناسایی لایه‌های مخفی:**
   - سوال ظاهری چیه؟
   - نیاز واقعی کاربر چیه؟
   - چه احساسی پشتش هست؟
   - کاربر چی می‌خواد بشنوه vs چی باید بشنوه؟

۲. **تحلیل روانشناسی:**
   - رفتار طرف مقابل یعنی چی؟
   - چه تست‌هایی در جریانه؟
   - نقاط قرمز چیا هستن؟
   - فرصت‌ها کجاست؟

۳. **تحلیل با درصد احتمال:**
   مثال: "این رفتار ۷۰٪ احتمال داره یعنی..."

۴. **پیش‌بینی آینده:**
   - اگه این کار رو بکنه چی میشه؟
   - طرف مقابل چطور واکنش نشون میده؟

**سبک نوشتن:**
- فارسی طبیعی (صفر انگلیسی!)
- ساختار واضح با ایموجی
- ۵-۱۵ خط (بسته به پیچیدگی)
- درصد احتمالات
- هشدارهای صریح

**مثال:**
سوال: "دختر بهم گفت جت بخرم"

تحلیل:

داش این یه تست کلاسیکه! بذار عمیق ببینم:

🎯 تحلیل رفتار:
این جمله ۳ هدف داره:
۱. می‌خواد ببینه چقدر جدیش می‌گیری (۵۰٪)
۲. داره ارزش مالیت رو می‌سنجه (۳۰٪)
۳. فقط شوخیه (۲۰٪)

🧠 پشت صحنه:

    اگه تازه آشناس = تست شخصیته
    اگه مدته می‌شناسیش = یا شوخیه یا انتظاراتش بالا میره

⚠️ نقاط قرمز:
همیشه چیزای گرون نخواد - علامت خطره!

🎲 پیش‌بینی:

    شوخی کنی: ۸۰٪ می‌خنده
    جدی بگیری: ۶۰٪ فکر می‌کنه ضعیفی
هدف: کاربر بگه "وااای این همه چیز رو فهمید!" 😱`,

  FINAL_ANSWER: `⚡ تو بهترین مشاور رابطه نسل زد هستی!

**شخصیت:**
- پسر ۱۸-۲۰ ساله باحال
- تخصص: روابط، احساسات
- لحن: رفیقانه، صادق، شیطون

**قوانین:**

۱. **فقط فارسی خالص** - صفر انگلیسی!

۲. **ساختار:**
   - شروع: جمله همدلانه
   - بدنه: توضیح + مثال مکالمه
   - پایان: جمله انگیزشی

۳. **مثال کامل:**

داش بخند! 😄 این یه تست معمولیه.

🎯 چیکار کنی:

اول شوخی:

    "رنگش چی باشه؟ آبی یا قرمز؟ 😎"

بعد جدی:

    "شوخی کردم! ولی جدی چی دوست داری؟"

💡 نکته:
جدی گفت = انتظاراتش بالاست

⚠️ هشدار:
رابطه روی احترام باشه نه پول

✨ حرف آخر:
تو باارزشی! 💪۴. **ممنوع:**
❌ کلمه انگلیسی
❌ زبان رسمی

هدف: کاربر بگه "دقیقاً!" 😍`,
};

// ========== تایپ‌ها ==========
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface StreamChunk {
  event: "thinking-chunk" | "thinking-end" | "answer-chunk" | "final" | "error";
  data: any;
}

// ========== استریم ==========
function createStreamResponse() {
  const encoder = new TextEncoder();
  let controller: ReadableStreamDefaultController;

  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;
    },
  });

  const send = (chunk: StreamChunk) => {
    const text = `event: ${chunk.event}\ndata: ${JSON.stringify(chunk.data)}\n\n`;
    controller.enqueue(encoder.encode(text));
  };

  const close = () => controller.close();

  return { stream, send, close };
}

// ========== استریم مدل ==========
async function streamFromModel(
  model: string,
  messages: Message[],
  temperature: number = 0.85
): Promise<Response> {
  return fetch(LIARA_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LIARA_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature,
      max_tokens: 3000,
    }),
  });
}

// ========== ۱. تحلیل عمیق ==========
async function thinkingPhase(
  userMessage: string,
  history: Message[],
  send: (chunk: StreamChunk) => void
): Promise<string> {
  const prompt: Message[] = [
    { role: "system", content: PROMPTS.DEEP_THINKING },
    ...history.slice(-6),
    {
      role: "user",
      content: `سوال: "${userMessage}"\n\nتحلیل عمیق و چندلایه کن!`,
    },
  ];

  const response = await streamFromModel(MODELS.deepThinking, prompt, 0.8);

  if (!response.ok) {
    throw new Error(`خطا در تحلیل: ${response.status}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let text = "";
  const start = Date.now();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter((l) => l.trim().startsWith("data:"));

    for (const line of lines) {
      const json = line.replace("data: ", "").trim();
      if (json === "[DONE]") continue;

      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content || "";
        if (content) {
          text += content;
          send({ event: "thinking-chunk", data: { text: content } });
        }
      } catch (e) {
        // ignore parse errors
      }
    }
  }

  send({ event: "thinking-end", data: { duration: Date.now() - start } });
  return text;
}

// ========== ۲. پاسخ نهایی - با Fallback محکم ==========
async function answerPhase(
  userMessage: string,
  thinking: string,
  history: Message[],
  send: (chunk: StreamChunk) => void
): Promise<void> {
  const prompt: Message[] = [
    { role: "system", content: PROMPTS.FINAL_ANSWER },
    ...history.slice(-3),
    {
      role: "user",
      content: `🧠 تحلیل: ${thinking}\n\n❓ سوال: ${userMessage}\n\nبهترین پاسخ - فقط فارسی!`,
    },
  ];

  // لیست مدل‌ها به ترتیب اولویت
  const modelsToTry = [
    { name: "Grok", model: MODELS.grok, temp: 0.95 },
    { name: "DeepSeek", model: MODELS.deepseek, temp: 0.85 },
    { name: "Sonar", model: MODELS.deepThinking, temp: 0.8 },
  ];

  let success = false;

  // امتحان هر مدل به ترتیب
  for (const { name, model, temp } of modelsToTry) {
    try {
      console.log(`🔄 امتحان ${name}...`);
      
      const response = await streamFromModel(model, prompt, temp);

      if (!response.ok) {
        console.log(`❌ ${name} خطا داد: ${response.status}`);
        continue;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let hasContent = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.trim().startsWith("data:"));

        for (const line of lines) {
          const json = line.replace("data: ", "").trim();
          if (json === "[DONE]") continue;

          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content || "";
            if (content) {
              hasContent = true;
              send({ event: "answer-chunk", data: { text: content } });
            }
          } catch (e) {
            // ignore
          }
        }
      }

      if (hasContent) {
        console.log(`✅ ${name} موفق!`);
        success = true;
        break;
      } else {
        console.log(`⚠️ ${name} محتوا نداشت`);
      }
    } catch (error: any) {
      console.log(`❌ ${name} خطا: ${error.message}`);
      continue;
    }
  }

  // اگه هیچ مدلی کار نکرد
  if (!success) {
    const fallbackText = `داش ببخشید! الان یه مشکل فنی پیش اومد 😅

ولی بر اساس تحلیلی که انجام دادم، می‌تونم بگم:

${thinking}

💡 **پیشنهاد من:**
- اگه سوالت درباره رابطه بود: صادق باش، خودت باش، احترام بذار
- اگه فنی بود: یه قدم به یه قدم پیش برو

✨ **یادت باشه:**
تو یه آدم باارزشی - به خودت ایمان داشته باش! 💪

(دوباره امتحان کن، مشکل حل میشه)`;

    for (const char of fallbackText) {
      send({ event: "answer-chunk", data: { text: char } });
      await new Promise((r) => setTimeout(r, 20));
    }
  }

  send({ event: "final", data: { message: "✅" } });
}

// ========== Main ==========
export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: "پیام خالی" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { stream, send, close } = createStreamResponse();

    (async () => {
      try {
        console.log("🚀 شروع پردازش...");
        
        // تحلیل
        const thinking = await thinkingPhase(message, history, send);
        console.log("✅ تحلیل تمام شد");

        // پاسخ
        await answerPhase(message, thinking, history, send);
        console.log("✅ پاسخ تمام شد");
        
      } catch (error: any) {
        console.error("❌ خطای کلی:", error);
        send({
          event: "error",
          data: { message: `خطا: ${error.message}` },
        });
      } finally {
        close();
      }
    })();

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("❌ خطای درخواست:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const runtime = "edge";