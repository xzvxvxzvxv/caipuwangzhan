-- 创建菜谱表
CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_name TEXT,
  image TEXT,
  description TEXT,
  time TEXT,
  difficulty TEXT,
  ingredients JSONB DEFAULT '[]'::jsonb,
  steps JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建香料表
CREATE TABLE IF NOT EXISTS spices (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  usage TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建菜谱-香料关联表
CREATE TABLE IF NOT EXISTS recipe_spices (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  spice_id INTEGER REFERENCES spices(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建更新记录表
CREATE TABLE IF NOT EXISTS update_history (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  recipe_name TEXT,
  category TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_name ON recipes(name);
CREATE INDEX IF NOT EXISTS idx_spices_category ON spices(category);
CREATE INDEX IF NOT EXISTS idx_update_history_timestamp ON update_history(timestamp DESC);

-- 启用RLS (Row Level Security)
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE spices ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_spices ENABLE ROW LEVEL SECURITY;
ALTER TABLE update_history ENABLE ROW LEVEL SECURITY;

-- 创建允许匿名访问的策略
CREATE POLICY "Allow anonymous read access" ON recipes FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON recipes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON recipes FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete" ON recipes FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read access" ON spices FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON spices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON spices FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete" ON spices FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read access" ON recipe_spices FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON recipe_spices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous delete" ON recipe_spices FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read access" ON update_history FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON update_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous delete" ON update_history FOR DELETE USING (true);
