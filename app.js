let currentCategory = 'all';
let currentSearch = '';

function getDailyRecommend() {
  const today = new Date();
  const dateString = today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

  const stapleRecipes = recipes.filter(r => r.category === 'staple');
  const vegetableRecipes = recipes.filter(r => r.category === 'vegetable');
  const meatRecipes = recipes.filter(r => r.category === 'meat');
  const soupRecipes = recipes.filter(r => r.category === 'soup');

  const recommended = [
    stapleRecipes[dayOfYear % stapleRecipes.length],
    vegetableRecipes[dayOfYear % vegetableRecipes.length],
    meatRecipes[dayOfYear % meatRecipes.length],
    soupRecipes[dayOfYear % soupRecipes.length]
  ];

  return { date: dateString, recipes: recommended };
}

function renderDailyRecommend() {
  const { date, recipes: recommended } = getDailyRecommend();
  const container = document.getElementById('dailyRecommend');
  const dateEl = document.getElementById('recommendDate');

  dateEl.textContent = date;

  container.innerHTML = recommended.map(recipe => `
    <div class="recommend-card ${recipe.category}" onclick="showRecipeDetail(${recipe.id})">
      <span class="category-tag">${recipe.categoryName}</span>
      <h3>${recipe.name}</h3>
      <p>${recipe.description}</p>
    </div>
  `).join('');
}

function searchRecipes(searchText, category) {
  if (!searchText && category === 'all') {
    return recipes;
  }

  const searchLower = searchText.toLowerCase();
  
  return recipes.filter(recipe => {
    const matchCategory = category === 'all' || recipe.category === category;
    
    if (!searchText) {
      return matchCategory;
    }

    const matchName = recipe.name.toLowerCase().includes(searchLower);
    const matchDescription = recipe.description.toLowerCase().includes(searchLower);
    const matchIngredients = recipe.ingredients.some(ing => ing.toLowerCase().includes(searchLower));
    
    return matchCategory && (matchName || matchDescription || matchIngredients);
  });
}

function renderRecipeList(category = null, search = null) {
  if (category !== null) currentCategory = category;
  if (search !== null) currentSearch = search;
  
  const container = document.getElementById('recipeList');

  if (currentCategory === 'spice') {
    renderSpiceTable(container);
    return;
  }

  const filteredRecipes = searchRecipes(currentSearch, currentCategory);

  if (filteredRecipes.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>未找到匹配的菜谱</h3>
        <p>试试其他关键词或分类</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredRecipes.map(recipe => `
    <div class="recipe-card" onclick="showRecipeDetail(${recipe.id})">
      <div class="card-content">
        <span class="card-category ${recipe.category}">${recipe.categoryName}</span>
        <h3>${recipe.name}</h3>
        <p class="card-desc">${recipe.description}</p>
        <div class="card-info">
          <span>⏱ ${recipe.time}</span>
          <span>📊 ${recipe.difficulty}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function renderSpiceTable(container) {
  let html = '<div class="spice-container">';

  spiceCategories.forEach(cat => {
    html += `
      <div class="spice-category">
        <div class="spice-category-header">
          <h3>${cat.name}</h3>
          <p>${cat.description}</p>
        </div>
        <div class="spice-table-wrapper">
          <table class="spice-table">
            <thead>
              <tr>
                <th style="width: 12%">名称</th>
                <th style="width: 13%">别名</th>
                <th style="width: 20%">核心用途</th>
                <th style="width: 25%">风味效果</th>
                <th style="width: 18%">适配场景</th>
                <th style="width: 12%">使用要点</th>
              </tr>
            </thead>
            <tbody>
              ${cat.spices.map(spice => `
                <tr>
                  <td><strong>${spice.name}</strong></td>
                  <td>${spice.alias || '-'}</td>
                  <td>${spice.purpose}</td>
                  <td>${spice.flavor}</td>
                  <td>${spice.usage}</td>
                  <td>${spice.tips}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

function showRecipeDetail(id) {
  window.location.href = `recipe.html?id=${id}`;
}

function initCategoryNav() {
  const buttons = document.querySelectorAll('.category-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderRecipeList(btn.dataset.category);
    });
  });
}

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  let searchTimeout;

  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      renderRecipeList(null, e.target.value);
    }, 200);
  });
}

function init() {
  renderDailyRecommend();
  renderRecipeList();
  initCategoryNav();
  initSearch();
}

init();
