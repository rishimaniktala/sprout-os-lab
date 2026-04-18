
CREATE TABLE public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  model TEXT,
  status TEXT,
  current_task TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  agent TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.metrics (
  mrr INTEGER,
  users INTEGER,
  runway INTEGER,
  ai_spend INTEGER
);

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read agents" ON public.agents FOR SELECT USING (true);
CREATE POLICY "Public write agents" ON public.agents FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Public write tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read metrics" ON public.metrics FOR SELECT USING (true);
CREATE POLICY "Public write metrics" ON public.metrics FOR ALL USING (true) WITH CHECK (true);
