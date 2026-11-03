import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key الزامی است" },
        { status: 400 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "پیام‌ها نامعتبر هستند" },
        { status: 400 }
      );
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "تو یک دستیار هوشمند فارسی به نام ChatGol هستی. همیشه به زبان فارسی و با لحن دوستانه و مفید پاسخ بده. پاسخ‌ها را کوتاه و مفید نگه دار مگر اینکه کاربر جزئیات بیشتری بخواهد.",
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI Error:", errorData);
      return NextResponse.json(
        { error: "خطا در ارتباط با OpenAI", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "پاسخی دریافت نشد.";

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}
