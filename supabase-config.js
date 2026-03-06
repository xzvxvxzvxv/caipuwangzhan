const SUPABASE_URL = 'https://omalyxuefbljvqbmyubo.supabase.co';
const SUPABASE_KEY = 'sb_secret_Ib6AP91CFIjCppvxSjdl-A_2QSVlrcV';

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
