// Lovable AI dispatch edge function.
// mode: "breakdown" -> returns structured subtasks via tool calling (non-streaming)
// mode: "chat"      -> streams an OS-level founder assistant response

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_DISPATCH = `You are AgentOS Dispatcher, the planning brain for an AI workforce running a startup.
You have these agents available:
- ChatGPT-5 (gpt-5): Strategy, complex decisions, prioritization
- Gemini (gemini-2.5-pro): Research, market scanning, competitor intel
- Claude (claude-sonnet-4-6): Long-form writing, investor memos, narratives
- Llama (llama): Cheap automation, CRM updates, ticket triage
- Perplexity (perplexity): Live web research, fundraising signals
- Cursor Agent (cursor): Engineering, bug triage, PRs

Given a founder's request, break it into 3-6 prioritized subtasks. Pick the cheapest agent that meets the quality bar.
Priority levels: Critical, High, Medium, Low.`;

const SYSTEM_COMMAND = `You are AgentOS Command Center for a startup founder.
You have read access to the company's AI agents, tasks, memory and metrics.
Be direct, strategic, and concise. Respond in markdown. Use bullets and bold sparingly.
When you propose actions, name the agent that should run them.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const body = await req.json();
    const mode: "breakdown" | "chat" = body.mode ?? "chat";

    if (mode === "breakdown") {
      const prompt: string = String(body.prompt ?? "").slice(0, 4000);
      if (!prompt.trim()) {
        return new Response(JSON.stringify({ error: "prompt required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_DISPATCH },
            { role: "user", content: `Founder request: "${prompt}"\n\nReturn 3-6 prioritized subtasks.` },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "emit_subtasks",
                description: "Emit prioritized subtasks for the AI workforce",
                parameters: {
                  type: "object",
                  properties: {
                    subtasks: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string", description: "Short action-oriented title, max 8 words" },
                          description: { type: "string", description: "1-2 sentence description of the task" },
                          priority: { type: "string", enum: ["Critical", "High", "Medium", "Low"] },
                          agent: {
                            type: "string",
                            enum: ["ChatGPT-5", "Gemini", "Claude", "Llama", "Perplexity", "Cursor Agent"],
                          },
                          model: { type: "string", description: "Underlying model identifier" },
                        },
                        required: ["title", "description", "priority", "agent", "model"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["subtasks"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "emit_subtasks" } },
        }),
      });

      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit hit. Please wait and retry." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Add funds in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (!resp.ok) {
        const t = await resp.text();
        console.error("gateway error", resp.status, t);
        return new Response(JSON.stringify({ error: "AI gateway error" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await resp.json();
      const call = data?.choices?.[0]?.message?.tool_calls?.[0];
      const args = call?.function?.arguments ? JSON.parse(call.function.arguments) : { subtasks: [] };
      return new Response(JSON.stringify(args), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // mode === "chat" — stream tokens
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const stream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_COMMAND }, ...messages],
        stream: true,
      }),
    });

    if (stream.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit hit. Please wait and retry." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (stream.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Add funds in Settings → Workspace → Usage." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!stream.ok || !stream.body) {
      const t = await stream.text();
      console.error("gateway stream error", stream.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(stream.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("dispatch error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
