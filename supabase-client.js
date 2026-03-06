// Supabase 客户端配置
const SUPABASE_URL = 'https://omalyxuefbljvqbmyubo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_trmGgQm01NF2j2ME2BUOzA_nAtex8HR';

// 导入 Supabase 客户端库
// 在 HTML 中添加: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>

let supabaseClient = null;

// 初始化 Supabase 客户端
function initSupabase() {
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase 客户端已初始化');
    return true;
  }
  console.error('Supabase 库未加载');
  return false;
}

// 从数据库获取所有菜谱
async function getAllRecipes() {
  if (!supabaseClient) {
    console.error('Supabase 客户端未初始化');
    return [];
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('recipes')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('获取菜谱失败:', error);
      return [];
    }
    
    // 转换 JSONB 字段
    return data.map(recipe => ({
      ...recipe,
      ingredients: typeof recipe.ingredients === 'string' 
        ? JSON.parse(recipe.ingredients) 
        : recipe.ingredients,
      steps: typeof recipe.steps === 'string' 
        ? JSON.parse(recipe.steps) 
        : recipe.steps
    }));
  } catch (err) {
    console.error('获取菜谱出错:', err);
    return [];
  }
}

// 根据分类获取菜谱
async function getRecipesByCategory(category) {
  if (!supabaseClient) {
    console.error('Supabase 客户端未初始化');
    return [];
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('recipes')
      .select('*')
      .eq('category', category)
      .order('id', { ascending: true });
    
    if (error) {
      console.error('获取分类菜谱失败:', error);
      return [];
    }
    
    return data.map(recipe => ({
      ...recipe,
      ingredients: typeof recipe.ingredients === 'string' 
        ? JSON.parse(recipe.ingredients) 
        : recipe.ingredients,
      steps: typeof recipe.steps === 'string' 
        ? JSON.parse(recipe.steps) 
        : recipe.steps
    }));
  } catch (err) {
    console.error('获取分类菜谱出错:', err);
    return [];
  }
}

// 添加新菜谱
async function addRecipe(recipe) {
  if (!supabaseClient) {
    console.error('Supabase 客户端未初始化');
    return null;
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('recipes')
      .insert([{
        name: recipe.name,
        category: recipe.category,
        category_name: recipe.categoryName,
        image: recipe.image,
        description: recipe.description,
        time: recipe.time,
        difficulty: recipe.difficulty,
        ingredients: recipe.ingredients,
        steps: recipe.steps
      }])
      .select();
    
    if (error) {
      console.error('添加菜谱失败:', error);
      return null;
    }
    
    // 添加到更新记录
    await addUpdateHistory(data[0].id, recipe.name, recipe.category);
    
    return data[0];
  } catch (err) {
    console.error('添加菜谱出错:', err);
    return null;
  }
}

// 更新菜谱
async function updateRecipe(id, updates) {
  if (!supabaseClient) {
    console.error('Supabase 客户端未初始化');
    return null;
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('recipes')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('更新菜谱失败:', error);
      return null;
    }
    
    return data[0];
  } catch (err) {
    console.error('更新菜谱出错:', err);
    return null;
  }
}

// 删除菜谱
async function deleteRecipe(id) {
  if (!supabaseClient) {
    console.error('Supabase 客户端未初始化');
    return false;
  }
  
  try {
    const { error } = await supabaseClient
      .from('recipes')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('删除菜谱失败:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('删除菜谱出错:', err);
    return false;
  }
}

// 获取所有香料
async function getAllSpices() {
  if (!supabaseClient) {
    console.error('Supabase 客户端未初始化');
    return [];
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('spices')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('获取香料失败:', error);
      return [];
    }
    
    return data;
  } catch (err) {
    console.error('获取香料出错:', err);
    return [];
  }
}

// 添加香料
async function addSpice(spice) {
  if (!supabaseClient) {
    console.error('Supabase 客户端未初始化');
    return null;
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('spices')
      .insert([spice])
      .select();
    
    if (error) {
      console.error('添加香料失败:', error);
      return null;
    }
    
    return data[0];
  } catch (err) {
    console.error('添加香料出错:', err);
    return null;
  }
}

// 获取更新记录
async function getUpdateHistory(limit = 50) {
  if (!supabaseClient) {
    console.error('Supabase 客户端未初始化');
    return [];
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('update_history')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('获取更新记录失败:', error);
      return [];
    }
    
    return data;
  } catch (err) {
    console.error('获取更新记录出错:', err);
    return [];
  }
}

// 添加更新记录
async function addUpdateHistory(recipeId, recipeName, category) {
  if (!supabaseClient) {
    console.error('Supabase 客户端未初始化');
    return null;
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('update_history')
      .insert([{
        recipe_id: recipeId,
        recipe_name: recipeName,
        category: category
      }])
      .select();
    
    if (error) {
      console.error('添加更新记录失败:', error);
      return null;
    }
    
    return data[0];
  } catch (err) {
    console.error('添加更新记录出错:', err);
    return null;
  }
}

// 批量导入菜谱（用于初始数据导入）
async function batchImportRecipes(recipesArray) {
  if (!supabaseClient) {
    console.error('Supabase 客户端未初始化');
    return { success: 0, failed: 0 };
  }
  
  let success = 0;
  let failed = 0;
  
  for (const recipe of recipesArray) {
    try {
      const { error } = await supabaseClient
        .from('recipes')
        .insert([{
          id: recipe.id,
          name: recipe.name,
          category: recipe.category,
          category_name: recipe.categoryName,
          image: recipe.image,
          description: recipe.description,
          time: recipe.time,
          difficulty: recipe.difficulty,
          ingredients: recipe.ingredients,
          steps: recipe.steps
        }]);
      
      if (error) {
        console.error(`导入菜谱 "${recipe.name}" 失败:`, error);
        failed++;
      } else {
        success++;
      }
    } catch (err) {
      console.error(`导入菜谱 "${recipe.name}" 出错:`, err);
      failed++;
    }
  }
  
  console.log(`批量导入完成: 成功 ${success} 条, 失败 ${failed} 条`);
  return { success, failed };
}

// 检查数据库连接
async function checkConnection() {
  if (!supabaseClient) {
    return false;
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('recipes')
      .select('count')
      .limit(1);
    
    return !error;
  } catch (err) {
    return false;
  }
}

// 导出函数供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initSupabase,
    getAllRecipes,
    getRecipesByCategory,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getAllSpices,
    addSpice,
    getUpdateHistory,
    addUpdateHistory,
    batchImportRecipes,
    checkConnection
  };
}
