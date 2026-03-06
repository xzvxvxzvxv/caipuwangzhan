// Supabase配置（实际项目中应使用环境变量）
const SUPABASE_URL = 'https://omalyxuefbljvqbmyubo.supabase.co';
const SUPABASE_KEY = 'sb_secret_Ib6AP91CFIjCppvxSjdl-A_2QSVlrcV';

// 开发环境下的配置
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  console.log('使用本地开发配置');
}

// 生产环境下的配置（示例）
if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
  console.log('使用生产环境配置');
}

const supabaseClient = {
  async getRecipes() {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/recipes?select=*&order=id.asc`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch recipes');
      return await response.json();
    } catch (error) {
      console.error('Supabase fetch error:', error);
      return null;
    }
  },

  async getSpices() {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/spices?select=*&order=id.asc`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch spices');
      return await response.json();
    } catch (error) {
      console.error('Supabase fetch error:', error);
      return null;
    }
  },

  async getRecipeById(id) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/recipes?id=eq.${id}`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return data[0] || null;
    } catch (error) {
      console.error('Supabase fetch error:', error);
      return null;
    }
  },

  async getRecipesByCategory(category) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/recipes?category=eq.${category}&select=*`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Supabase fetch error:', error);
      return null;
    }
  },

  async searchRecipes(keyword) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/recipes?name=ilike.*${keyword}*&select=*`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Supabase fetch error:', error);
      return null;
    }
  }
};
