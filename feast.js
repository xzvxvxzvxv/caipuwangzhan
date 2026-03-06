var currentMenu = [];
var selectedRecipes = [];
var currentFilter = 'all';
var isCustomMode = false;

// 从Supabase获取数据
let recipes = [];
let isSupabaseLoaded = false;

// 检查必要文件是否存在
function checkRequiredFiles() {
  return new Promise((resolve, reject) => {
    const requiredImage = '15429A82CAD745CA703D193AC6956342.jpeg';
    
    fetch(requiredImage, {
      method: 'HEAD'
    })
    .then(response => {
      if (response.ok) {
        console.log('必要文件检查通过：', requiredImage);
        resolve(true);
      } else {
        console.error('必要文件不存在：', requiredImage);
        // 不影响功能，继续执行
        resolve(true);
      }
    })
    .catch(error => {
      console.error('文件检查失败：', error);
      // 不影响功能，继续执行
      resolve(true);
    });
  });
}

// 从Supabase加载数据
async function loadDataFromSupabase() {
  try {
    const dbRecipes = await supabaseClient.getRecipes();
    if (dbRecipes && dbRecipes.length > 0) {
      recipes = dbRecipes;
      isSupabaseLoaded = true;
      console.log('从Supabase加载了', recipes.length, '道菜谱');
    } else {
      console.log('使用本地备份数据');
    }
  } catch (error) {
    console.error('Supabase加载失败：', error);
  }
}

// 初始化函数
async function initApp() {
  try {
    await checkRequiredFiles();
    await loadDataFromSupabase();
    console.log('程序初始化中...');
    // 继续执行应用初始化
    initializeApp();
  } catch (error) {
    console.error('初始化失败：', error);
    // 显示错误消息
    const container = document.querySelector('.container');
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 50px; background: white; border-radius: 16px; margin: 20px auto; max-width: 600px;">
          <h2 style="color: #e74c3c; margin-bottom: 20px;">❌ 程序启动失败</h2>
          <p style="font-size: 1.1rem; margin-bottom: 15px;">初始化失败，请刷新页面重试</p>
          <p style="color: #5d6d7e; margin-bottom: 30px;">错误信息：${error.message}</p>
          <button onclick="location.reload()" style="padding: 12px 24px; background: #e67e22; color: white; border: none; border-radius: 50px; font-size: 1rem; cursor: pointer;">
            重新加载
          </button>
        </div>
      `;
    }
  }
}

// 默认System Prompt
const defaultSystemPrompt = `你是一位拥有25年中餐全菜系研发与家宴落地经验的国家级中式烹调高级技师，深耕川粤鲁苏闽浙湘徽八大菜系，精通大众聚餐级家常菜的标准化落地，专精单人家用厨房的极限多线程并行操作、全流程风险管控与食材零浪费规划，累计完成超1200场4-12人家宴的全流程闭环执行，熟知家用厨房设备的极限利用与单人操作的体能合理分配。

【输出风格强制规范】
全程保持极致专业、极简精准、逻辑闭环、全数据量化、强执行导向，严禁使用任何亲昵称呼、师徒式话术、冗余修饰、情绪化表达、网络热梗；所有内容均为可100%落地的标准化厨房操作规范，语言直接严谨，完全对标工业级厨房操作手册。
格式铁则：所有JSON内容必须严格符合RFC 8259标准，无语法错误、无多余尾逗号、无注释、无换行异常，所有字符串统一使用英文双引号，数值与单位格式完全统一，确保程序100%可解析，无任何兼容问题。

【核心任务】
针对用户提供的12道吃席菜单，输出以下两部分内容：

**第一步：全菜食材汇总清单**
【输出规则】
1. 仅输出JSON格式，无文字说明、无markdown代码块标记；
2. 食材按以下6大类别严格分类，不得新增、删减、调换类别顺序；
3. 每类食材内部按用量从大到小排序；
4. 所有用量必须带单位（g/ml/个/根/瓣/片/把等），不得出现"适量"；
5. 备注字段必填，标注处理方式（如：切片/切丝/切末/整根/去皮等）。

JSON结构：
{
  "蔬菜类": [{"name": "食材名", "amount": "精确用量带单位", "note": "处理方式"}],
  "肉禽类": [{"name": "食材名", "amount": "精确用量带单位", "note": "处理方式"}],
  "水产蛋类": [{"name": "食材名", "amount": "精确用量带单位", "note": "处理方式"}],
  "菌菇豆制品类": [{"name": "食材名", "amount": "精确用量带单位", "note": "处理方式"}],
  "调味干货类": [{"name": "食材名", "amount": "精确用量带单位", "note": "处理方式"}],
  "主食及其他": [{"name": "食材名", "amount": "精确用量带单位", "note": "处理方式"}]
}

**第二步：每道菜时间拆解**
【输出规则】
1. 先按以下固定JSON结构输出12道菜的全量时间拆解，分类固定为dishes数组，每道菜必须包含固定9个字段，不得新增、删减、调换字段顺序；时间单位统一为「分钟」，不得混用小时/分钟格式；parallelPotential仅可输出「极高/高/中/低」4个固定等级，对应标准为：极高=被动时间≥90分钟，高=被动时间30-89分钟，中=被动时间10-29分钟，低=无被动时间。
2. JSON输出完成后，用不超过200字的精简文字，输出时间规划核心要点，覆盖长时任务前置、设备错峰、主动操作零冲突、体能分配4个核心模块，无冗余内容。

JSON结构：
{
  "dishes": [
    {
      "name": "菜名",
      "prepTime": "准备时间（分钟）",
      "activeTime": "主动操作时间（分钟）",
      "passiveTime": "被动等待时间（分钟）",
      "totalTime": "总耗时（分钟）",
      "parallelPotential": "极高/高/中/低",
      "parallelNote": "并行操作建议",
      "keyPoints": "关键操作要点",
      "equipment": "所需设备"
    }
  ]
}

**第三步：全流程时间轴规划**
【输出规则】
1. 按以下固定JSON结构输出，timeline数组每个节点包含固定5个字段，不得新增、删减、调换字段顺序；
2. 时间轴从T-0（第0分钟）开始，覆盖从备菜到最后一道菜出锅的全流程；
3. 每个时间节点必须标注具体分钟数，格式为"T-XX"；
4. 同一时间点可并行多个任务，用tasks数组列出；
5. 每个任务必须标注设备占用情况和操作要点。

JSON结构：
{
  "timeline": [
    {
      "time": "T-XX（第XX分钟）",
      "tasks": [
        {
          "dish": "菜名",
          "action": "具体操作",
          "equipment": "占用设备",
          "duration": "持续时间（分钟）",
          "notes": "操作要点/风险提示"
        }
      ]
    }
  ]
}

【食材量化与标准化铁则】
1. 所有食材必须精确到克(g)或毫升(ml)，不得使用"适量"、"少许"、"若干"等模糊表述；
2. 葱姜蒜等辅料按整道菜总量计算，不得按单份估算；
3. 干货（木耳、香菇等）按泡发前干重计算；
4. 液体调料统一用ml，固体调料统一用g；
5. 食材处理方式必须具体到刀法规格（如：切片厚度、丝粗细、末细碎程度）。

【时间计算铁则】
1. 准备时间：包含洗菜、切配、腌制、预处理等所有主动操作；
2. 主动操作时间：烹饪过程中需要人持续操作的时间；
3. 被动等待时间：炖煮、腌制、发酵等无需人看守的时间；
4. 总时间 = 准备时间 + 主动操作时间 + 被动等待时间（按实际并行情况计算）；
5. 并行潜力评估必须基于单人操作的可行性，不得假设有多人协助。

【设备与空间铁则】
1. 家用厨房默认配置：单灶台（2-4眼）、单烤箱、电饭煲、微波炉、常用锅具；
2. 所有设备使用必须标注占用时长，不得出现设备冲突；
3. 台面空间按标准厨房计算，不得假设有超大操作台；
4. 冰箱/冰柜使用必须标注预冷/冷冻时间。

【风险管控铁则】
1. 每道菜必须标注关键风险点（如：油温控制、时间敏感操作、易糊易焦环节）；
2. 时间轴必须包含缓冲时间（建议总时间的10%作为应急缓冲）；
3. 必须标注可提前准备的环节（如：提前腌制、提前焯水）；
4. 必须标注可并行的任务组合（如：A菜炖煮时可进行B菜准备）。`;

// 原始初始化函数
function initializeApp() {
  // 初始化应用逻辑
  console.log('应用初始化完成');
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 获取当前System Prompt（从localStorage或默认值）
function getSystemPrompt() {
  return localStorage.getItem('feastSystemPrompt') || defaultSystemPrompt;
}

// 保存System Prompt到localStorage
function saveSystemPrompt(prompt) {
  localStorage.setItem('feastSystemPrompt', prompt);
}

// 重置为默认System Prompt
function resetSystemPrompt() {
  localStorage.removeItem('feastSystemPrompt');
  return defaultSystemPrompt;
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateMenu() {
  const meatRecipes = shuffleArray(recipes.filter(r => r.category === 'meat'));
  const vegetableRecipes = shuffleArray(recipes.filter(r => r.category === 'vegetable'));
  const soupRecipes = shuffleArray(recipes.filter(r => r.category === 'soup'));
  const stapleRecipes = shuffleArray(recipes.filter(r => r.category === 'staple'));

  const menu = [
    ...meatRecipes.slice(0, 5),
    ...vegetableRecipes.slice(0, 4),
    ...soupRecipes.slice(0, 2),
    ...stapleRecipes.slice(0, 1)
  ];

  currentMenu = shuffleArray(menu);
  renderMenu();
  updateStats();
  document.getElementById('exportBtn').disabled = false;
  document.getElementById('aiBtn').disabled = false;
}

function renderMenu() {
  const container = document.getElementById('menuPreview');

  container.innerHTML = `
    <div class="menu-grid">
      ${currentMenu.map((recipe, index) => `
        <div class="menu-card ${recipe.category}" onclick="showRecipeDetail(${recipe.id})">
          <span class="card-number">${index + 1}</span>
          <div class="card-icon">${categoryIcons[recipe.category]}</div>
          <h3>${recipe.name}</h3>
          <span class="card-category ${recipe.category}">${recipe.categoryName}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function updateStats() {
  const stats = {
    meat: currentMenu.filter(r => r.category === 'meat').length,
    vegetable: currentMenu.filter(r => r.category === 'vegetable').length,
    soup: currentMenu.filter(r => r.category === 'soup').length,
    staple: currentMenu.filter(r => r.category === 'staple').length
  };

  document.getElementById('meatCount').textContent = stats.meat;
  document.getElementById('vegetableCount').textContent = stats.vegetable;
  document.getElementById('soupCount').textContent = stats.soup;
  document.getElementById('stapleCount').textContent = stats.staple;
  document.getElementById('menuStats').style.display = 'flex';
}

function showRecipeDetail(id) {
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return;

  const modal = document.getElementById('recipeModal');
  const modalBody = document.getElementById('modalBody');

  modalBody.innerHTML = `
    <div class="modal-image" style="background-image: url('${recipe.image}')"></div>
    <span class="modal-category card-category ${recipe.category}">${recipe.categoryName}</span>
    <h2>${recipe.name}</h2>
    <p style="color: #666; margin-bottom: 20px;">${recipe.description}</p>

    <div class="modal-section">
      <h3>🥗 食材准备</h3>
      <ul>
        ${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}
      </ul>
    </div>

    <div class="modal-section">
      <h3>👨‍🍳 制作步骤</h3>
      <ol>
        ${recipe.steps.map(s => `<li>${s}</li>`).join('')}
      </ol>
    </div>

    <div style="display: flex; gap: 20px; color: #888; font-size: 0.9rem;">
      <span>⏱ 用时：${recipe.time}</span>
      <span>📊 难度：${recipe.difficulty}</span>
    </div>
  `;

  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('recipeModal').classList.remove('active');
}

function getAIContent() {
  const aiContent = document.getElementById('aiContent');
  const streamEl = aiContent.querySelector('.ai-stream');
  if (streamEl && streamEl.innerHTML.trim()) {
    return convertToPDFStyles(streamEl.innerHTML);
  }
  return null;
}

function convertToPDFStyles(html) {
  return html
    .replace(/class="ingredient-table-container"/g, 'style="margin-bottom: 30px;"')
    .replace(/class="table-title"/g, 'style="color: #8e44ad; font-size: 18px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #e8d5f0;"')
    .replace(/class="ingredient-category"/g, 'style="background: white; border-radius: 8px; margin-bottom: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08);"')
    .replace(/class="category-header"/g, 'style="display: flex; align-items: center; padding: 10px 14px; border-bottom: 1px solid #f0f0f0; background: #fafafa;"')
    .replace(/class="category-icon"/g, 'style="font-size: 18px; margin-right: 8px;"')
    .replace(/class="category-name"/g, 'style="font-weight: 600; color: #333; font-size: 14px; flex: 1;"')
    .replace(/class="category-count"/g, 'style="font-size: 12px; color: #888; background: #f0f0f0; padding: 3px 8px; border-radius: 10px;"')
    .replace(/class="ingredient-table"/g, 'style="width: 100%; border-collapse: collapse;"')
    .replace(/<th/g, '<th style="background: #f8f8f8; padding: 8px 10px; text-align: left; font-size: 12px; color: #666; font-weight: 600; border-bottom: 1px solid #e0e0e0;"')
    .replace(/<td/g, '<td style="padding: 8px 10px; font-size: 12px; color: #333; border-bottom: 1px solid #f0f0f0;"');
}

function generatePDFContent() {
  const container = document.createElement('div');
  container.style.cssText = 'width: 800px; padding: 40px; background: white; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;';

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let html = `
    <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #f5576c; padding-bottom: 20px;">
      <h1 style="color: #f5576c; font-size: 32px; margin: 0 0 10px 0;">🎊 吃席菜单</h1>
      <p style="color: #888; font-size: 14px; margin: 0;">${today}</p>
    </div>
  `;

  const aiContent = getAIContent();
  if (aiContent) {
    html += `
      <div style="margin-bottom: 40px;">
        <div style="background: linear-gradient(135deg, #f8f4ff 0%, #fff 100%); border: 2px solid #9b59b6; border-radius: 12px; padding: 25px; margin-bottom: 20px;">
          <h2 style="color: #8e44ad; font-size: 22px; margin: 0 0 20px 0; padding-bottom: 15px; border-bottom: 2px solid #e8d5f0;">
            🤖 AI 智能烹饪规划
          </h2>
          <div style="color: #333; font-size: 13px; line-height: 1.8;">
            ${aiContent}
          </div>
        </div>
      </div>

      <div style="margin: 40px 0; text-align: center;">
        <div style="display: inline-block; padding: 15px 40px; background: linear-gradient(90deg, #f5576c, #9b59b6); border-radius: 30px;">
          <span style="color: white; font-size: 16px; font-weight: 600;">━━━━━ 食谱详情 ━━━━━</span>
        </div>
      </div>
    `;
  }

  const categories = [
    { key: 'meat', name: '荤菜', icon: '🍖' },
    { key: 'vegetable', name: '素菜', icon: '🥬' },
    { key: 'soup', name: '汤', icon: '🍲' },
    { key: 'staple', name: '主食', icon: '🍚' }
  ];

  categories.forEach(cat => {
    const items = currentMenu.filter(r => r.category === cat.key);
    if (items.length === 0) return;

    html += `<div style="margin-bottom: 30px;">`;
    html += `<h2 style="color: #333; font-size: 20px; border-left: 4px solid #f5576c; padding-left: 10px; margin-bottom: 20px;">${cat.icon} ${cat.name}</h2>`;

    items.forEach((item, index) => {
      html += `
        <div style="margin-bottom: 25px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
          <h3 style="color: #333; font-size: 18px; margin: 0 0 10px 0;">${index + 1}. ${item.name}</h3>
          <p style="color: #666; font-size: 13px; margin: 0 0 10px 0; line-height: 1.5;">${item.description}</p>

          <div style="margin-bottom: 10px;">
            <p style="font-weight: bold; color: #555; font-size: 13px; margin: 0 0 5px 0;">🥗 食材：</p>
            <p style="color: #666; font-size: 12px; margin: 0; line-height: 1.6;">${item.ingredients.join('、')}</p>
          </div>

          <div>
            <p style="font-weight: bold; color: #555; font-size: 13px; margin: 0 0 5px 0;">👨‍🍳 步骤：</p>
            <ol style="color: #666; font-size: 12px; margin: 0; padding-left: 20px; line-height: 1.8;">
              ${item.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
          </div>

          <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ddd;">
            <span style="color: #999; font-size: 11px;">⏱ ${item.time} | 📊 ${item.difficulty}</span>
          </div>
        </div>
      `;
    });

    html += `</div>`;
  });

  html += `
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
      <p style="color: #aaa; font-size: 12px;">由 吃席菜单生成器 生成</p>
    </div>
  `;

  container.innerHTML = html;
  document.body.appendChild(container);
  return container;
}

async function exportPDF() {
  if (currentMenu.length === 0) return;

  const exportBtn = document.getElementById('exportBtn');
  const originalText = exportBtn.innerHTML;
  exportBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">生成中...</span>';
  exportBtn.disabled = true;

  let pdfContainer = null;

  try {
    const { jsPDF } = window.jspdf;

    pdfContainer = generatePDFContent();

    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(pdfContainer, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      windowWidth: 800,
      width: 800
    });

    const imgData = canvas.toDataURL('image/png');

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    doc.save(`chi-xi-menu-${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('PDF export failed:', error);
    alert('PDF导出失败，请重试');
  } finally {
    exportBtn.innerHTML = originalText;
    exportBtn.disabled = false;
    if (pdfContainer) {
      document.body.removeChild(pdfContainer);
    }
  }
}

document.getElementById('generateBtn').addEventListener('click', generateMenu);
document.getElementById('exportBtn').addEventListener('click', exportPDF);
document.getElementById('aiBtn').addEventListener('click', analyzeWithAI);
document.getElementById('aiClose').addEventListener('click', closeAIResult);
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('recipeModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeAIResult();
  }
});

document.getElementById('randomMode').addEventListener('click', () => toggleMode('random'));
document.getElementById('customMode').addEventListener('click', () => toggleMode('custom'));
document.getElementById('confirmSelection').addEventListener('click', confirmSelection);
document.getElementById('clearSelection').addEventListener('click', clearSelection);

// 设置按钮事件
document.getElementById('settingsBtn').addEventListener('click', openSettingsModal);
document.getElementById('settingsModalClose').addEventListener('click', closeSettingsModal);
document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
document.getElementById('resetSettingsBtn').addEventListener('click', resetSettings);
document.getElementById('settingsModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    closeSettingsModal();
  }
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => filterByCategory(btn.dataset.filter));
});

// 打开设置模态框
function openSettingsModal() {
  const modal = document.getElementById('settingsModal');
  const textarea = document.getElementById('systemPromptInput');
  textarea.value = getSystemPrompt();
  modal.classList.add('active');
}

// 关闭设置模态框
function closeSettingsModal() {
  const modal = document.getElementById('settingsModal');
  modal.classList.remove('active');
}

// 保存设置
function saveSettings() {
  const textarea = document.getElementById('systemPromptInput');
  const newPrompt = textarea.value.trim();
  
  if (!newPrompt) {
    alert('提示词不能为空！');
    return;
  }
  
  saveSystemPrompt(newPrompt);
  alert('设置已保存！下次AI分析时将使用新的提示词。');
  closeSettingsModal();
}

// 重置设置
function resetSettings() {
  if (confirm('确定要恢复默认提示词吗？这将覆盖您当前的自定义设置。')) {
    const defaultPrompt = resetSystemPrompt();
    document.getElementById('systemPromptInput').value = defaultPrompt;
    alert('已恢复默认设置！');
  }
}

function buildAIPrompt() {
  let menuInfo = '以下是我需要制作的12道菜：\n\n';

  currentMenu.forEach((recipe, index) => {
    menuInfo += `【第${index + 1}道】${recipe.name}（${recipe.categoryName}）\n`;
    menuInfo += `用时：${recipe.time}，难度：${recipe.difficulty}\n`;
    menuInfo += `食材：${recipe.ingredients.join('、')}\n`;
    menuInfo += `步骤：\n`;
    recipe.steps.forEach((step, i) => {
      menuInfo += `  ${i + 1}. ${step}\n`;
    });
    menuInfo += '\n';
  });

  // 使用用户自定义或默认的System Prompt
  const systemPrompt = getSystemPrompt();

  return `${systemPrompt}\n\n${menuInfo}`;
}

async function analyzeWithAI() {
  if (currentMenu.length === 0) return;

  const aiBtn = document.getElementById('aiBtn');
  const aiResult = document.getElementById('aiResult');
  const aiContent = document.getElementById('aiContent');

  aiBtn.disabled = true;
  aiBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">分析中...</span>';
  aiResult.style.display = 'block';
  aiContent.innerHTML = `
    <div class="ai-loading">
      <div class="ai-spinner"></div>
      <p>AI 正在分析最优烹饪方案...</p>
      <p class="ai-tip">预计需要 30-60 秒，请耐心等待</p>
    </div>
  `;

  aiResult.scrollIntoView({ behavior: 'smooth', block: 'start' });

  try {
    const prompt = buildAIPrompt();

    const response = await fetch('https://api-inference.modelscope.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ms-d2c12a44-8862-49e8-9f0e-a4c722ed109d'
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3.2',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        stream: true,
        extra_body: {
          enable_thinking: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    let thinkingContent = '';
    let isThinking = true;

    aiContent.innerHTML = '<div class="ai-stream"></div>';
    const streamEl = aiContent.querySelector('.ai-stream');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta;

            if (delta) {
              if (delta.reasoning_content) {
                thinkingContent += delta.reasoning_content;
              }
              if (delta.content) {
                if (isThinking && thinkingContent) {
                  fullContent += '\n\n---\n\n**📋 烹饪规划方案**\n\n';
                  isThinking = false;
                }
                fullContent += delta.content;
              }
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }

      streamEl.innerHTML = formatAIResponse(fullContent);
      streamEl.scrollTop = streamEl.scrollHeight;
    }

    if (!fullContent) {
      throw new Error('AI 未返回有效内容');
    }

    setTimeout(() => {
      exportPDF();
    }, 500);

  } catch (error) {
    console.error('AI analysis failed:', error);
    aiContent.innerHTML = `
      <div class="ai-error">
        <p>❌ AI 分析失败</p>
        <p class="error-detail">${error.message}</p>
        <button class="retry-btn" onclick="analyzeWithAI()">重试</button>
      </div>
    `;
  } finally {
    aiBtn.disabled = false;
    aiBtn.innerHTML = '<span class="btn-icon">🤖</span><span class="btn-text">AI时间规划</span>';
  }
}

function formatAIResponse(text) {
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/g;
  let ingredientTable = '';
  let timeCards = '';
  let timelineHTML = '';
  let textWithoutJson = text;

  const matches = [...text.matchAll(jsonRegex)];

  matches.forEach(match => {
    try {
      // 清理JSON字符串，移除多余的冒号和空格
      let jsonStr = match[1].replace(/"amount":\s*:/g, '"amount":');
      const jsonData = JSON.parse(jsonStr);
      if (jsonData.dishes) {
        timeCards = renderTimeCards(jsonData);
      } else if (jsonData.timeline) {
        timelineHTML = renderTimeline(jsonData);
      } else {
        ingredientTable = renderIngredientTable(jsonData);
      }
      textWithoutJson = textWithoutJson.replace(match[0], '').trim();
    } catch (e) {
      console.error('JSON parse error:', e);
      // 尝试直接解析整个文本，看是否是纯JSON
      try {
        let jsonStr = text.replace(/```json|```/g, '').trim();
        jsonStr = jsonStr.replace(/"amount":\s*:/g, '"amount":');
        const jsonData = JSON.parse(jsonStr);
        if (!jsonData.dishes && !jsonData.timeline) {
          ingredientTable = renderIngredientTable(jsonData);
          textWithoutJson = '';
        }
      } catch (e2) {
        console.error('Direct JSON parse error:', e2);
      }
    }
  });

  // 如果没有找到JSON，但文本看起来像JSON，尝试直接解析
  if (!ingredientTable && !timeCards && !timelineHTML) {
    try {
      let jsonStr = text.replace(/```json|```/g, '').trim();
      
      // 增强的JSON清理逻辑
      jsonStr = jsonStr
        .replace(/"amount":\s*:/g, '"amount":')
        .replace(/"note":\s*:/g, '"note":')
        .replace(/\s+/g, ' ')
        .trim();
      
      // 尝试找到完整的JSON对象
      const jsonStart = jsonStr.indexOf('{');
      const jsonEnd = jsonStr.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        jsonStr = jsonStr.substring(jsonStart, jsonEnd + 1);
      }
      
      // 修复字符串中的引号问题
      jsonStr = jsonStr.replace(/"([^"]*)"([^":,}\]]*)"([^"]*)":/g, (match, p1, p2, p3) => {
        if (p2.includes('"') || p3.includes('"')) {
          return `"${p1}${p2}${p3}":`;
        }
        return match;
      });
      
      const jsonData = JSON.parse(jsonStr);
      if (!jsonData.dishes && !jsonData.timeline) {
        ingredientTable = renderIngredientTable(jsonData);
        textWithoutJson = '';
      }
    } catch (e) {
      console.error('Final JSON parse error:', e);
      console.log('Attempting to extract and fix JSON...');
      
      // 尝试提取并修复JSON
      try {
        let jsonStr = text.replace(/```json|```/g, '').trim();
        
        // 找到第一个 { 和最后一个 }
        const start = jsonStr.indexOf('{');
        const end = jsonStr.lastIndexOf('}');
        
        if (start !== -1 && end !== -1) {
          jsonStr = jsonStr.substring(start, end + 1);
          
          // 逐字符解析，修复字符串
          let fixed = '';
          let inString = false;
          let escapeNext = false;
          
          for (let i = 0; i < jsonStr.length; i++) {
            const char = jsonStr[i];
            
            if (escapeNext) {
              fixed += char;
              escapeNext = false;
              continue;
            }
            
            if (char === '\\') {
              fixed += char;
              escapeNext = true;
              continue;
            }
            
            if (char === '"') {
              inString = !inString;
              fixed += char;
              continue;
            }
            
            // 如果在字符串内，保留所有字符
            if (inString) {
              fixed += char;
            } else {
              // 不在字符串内，只保留JSON结构字符
              if ('{},:[]'.includes(char) || /\s/.test(char) || /[\w\-]/.test(char)) {
                fixed += char;
              }
            }
          }
          
          const jsonData = JSON.parse(fixed);
          if (!jsonData.dishes && !jsonData.timeline) {
            ingredientTable = renderIngredientTable(jsonData);
            textWithoutJson = '';
          }
        }
      } catch (e2) {
        console.error('Simplified JSON parse error:', e2);
        console.log('Failed to parse JSON, displaying as text');
      }
    }
  }

  let formattedText = textWithoutJson
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^## (.*$)/gim, '<h3>$1</h3>')
    .replace(/^# (.*$)/gim, '<h2>$1</h2>')
    .replace(/^[-•] (.*$)/gim, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li><span class="num">$1.</span> $2</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/<li>/g, '</p><ul><li>')
    .replace(/<\/li>/g, '</li></ul><p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p><br>/g, '<p>')
    .replace(/<br><\/p>/g, '</p>');

  return ingredientTable + timeCards + timelineHTML + formattedText;
}

function renderTimeCards(data) {
  if (!data.dishes || data.dishes.length === 0) return '';

  const potentialColors = {
    '极高': '#26de81',
    '高': '#45aaf2',
    '中': '#fdcb6e',
    '低': '#ff6b6b'
  };

  let cardsHTML = '<div class="time-cards-container">';
  cardsHTML += '<h3 class="table-title">⏱️ 每道菜时间拆解</h3>';
  cardsHTML += '<div class="time-cards-grid">';

  data.dishes.forEach((dish, index) => {
    const potentialColor = potentialColors[dish.parallelPotential] || '#9b59b6';

    cardsHTML += `
      <div class="time-card">
        <div class="time-card-header">
          <span class="dish-number">${index + 1}</span>
          <h4 class="dish-name">${dish.name}</h4>
        </div>
        <div class="time-card-body">
          <div class="time-row">
            <span class="time-label">🥘 准备时间</span>
            <span class="time-value">${dish.prepTime}</span>
          </div>
          <div class="time-row">
            <span class="time-label">🔥 主动操作</span>
            <span class="time-value">${dish.activeTime}</span>
          </div>
          <div class="time-row">
            <span class="time-label">⏳ 被动等待</span>
            <span class="time-value">${dish.passiveTime}</span>
          </div>
          <div class="time-row total">
            <span class="time-label">📊 总耗时</span>
            <span class="time-value total-time">${dish.totalTime}</span>
          </div>
        </div>
        <div class="time-card-footer" style="background: linear-gradient(90deg, ${potentialColor}20, transparent); border-left: 3px solid ${potentialColor};">
          <span class="parallel-label">并行潜力：</span>
          <span class="parallel-value" style="color: ${potentialColor};">${dish.parallelPotential}</span>
          <p class="parallel-note">${dish.parallelNote}</p>
        </div>
      </div>
    `;
  });

  cardsHTML += '</div></div>';
  return cardsHTML;
}

function renderTimeline(data) {
  if (!data.timeline || data.timeline.length === 0) return '';

  let timelineHTML = '<div class="timeline-container">';
  timelineHTML += '<h3 class="table-title">🕐 180分钟详细时间轴</h3>';
  timelineHTML += '<div class="timeline-wrapper">';

  data.timeline.forEach((item, index) => {
    const isEven = index % 2 === 0;

    timelineHTML += `
      <div class="timeline-item ${isEven ? 'timeline-left' : 'timeline-right'}">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-time">${item.timeRange}</div>
          <div class="timeline-tasks">
            <div class="timeline-task active-task">
              <span class="task-icon">🔥</span>
              <span class="task-label">主动任务</span>
              <span class="task-text">${item.activeTask}</span>
            </div>
            ${item.passiveTask && item.passiveTask !== '无' ? `
            <div class="timeline-task passive-task">
              <span class="task-icon">⏳</span>
              <span class="task-label">后台任务</span>
              <span class="task-text">${item.passiveTask}</span>
            </div>
            ` : ''}
            ${item.helperTask ? `
            <div class="timeline-task helper-task">
              <span class="task-icon">🧹</span>
              <span class="task-label">辅助任务</span>
              <span class="task-text">${item.helperTask}</span>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  });

  timelineHTML += '</div></div>';
  return timelineHTML;
}

function renderIngredientTable(data) {
  const categoryIcons = {
    '蔬菜类': '🥬',
    '肉禽类': '🍖',
    '水产蛋类': '🦐',
    '菌菇豆制品类': '🍄',
    '调味干货类': '🧂',
    '主食及其他': '🍚'
  };

  const categoryColors = {
    '蔬菜类': '#26de81',
    '肉禽类': '#ff6b6b',
    '水产蛋类': '#45aaf2',
    '菌菇豆制品类': '#a29bfe',
    '调味干货类': '#fdcb6e',
    '主食及其他': '#ff9f43'
  };

  let tableHTML = '<div class="ingredient-table-container">';
  tableHTML += '<h3 class="table-title">📋 全菜食材汇总清单</h3>';

  Object.entries(data).forEach(([category, items]) => {
    if (!items || items.length === 0) return;

    const icon = categoryIcons[category] || '📦';
    const color = categoryColors[category] || '#9b59b6';

    tableHTML += `
      <div class="ingredient-category" data-category="${category}" style="border-left: 4px solid ${color};">
        <div class="category-header" style="background: linear-gradient(90deg, ${color}15, transparent);">
          <span class="category-icon">${icon}</span>
          <span class="category-name">${category}</span>
          <span class="category-count">${items.length}种</span>
        </div>
        <table class="ingredient-table">
          <thead>
            <tr>
              <th style="width: 40%;">食材名称</th>
              <th style="width: 30%;">用量</th>
              <th style="width: 30%;">备注</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td><strong>${item.name}</strong></td>
                <td>${item.amount}</td>
                <td>${item.note || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  });

  tableHTML += '</div>';
  return tableHTML;
}

function closeAIResult() {
  document.getElementById('aiResult').style.display = 'none';
}

function toggleMode(mode) {
  isCustomMode = mode === 'custom';
  const randomModeBtn = document.getElementById('randomMode');
  const customModeBtn = document.getElementById('customMode');
  const customSelector = document.getElementById('customSelector');
  const menuPreview = document.getElementById('menuPreview');
  const menuStats = document.getElementById('menuStats');
  const generateBtn = document.getElementById('generateBtn');

  if (isCustomMode) {
    randomModeBtn.classList.remove('active');
    customModeBtn.classList.add('active');
    customSelector.style.display = 'block';
    menuPreview.style.display = 'none';
    menuStats.style.display = 'none';
    generateBtn.style.display = 'none';
    renderAvailableRecipes();
    renderSelectedList();
  } else {
    randomModeBtn.classList.add('active');
    customModeBtn.classList.remove('active');
    customSelector.style.display = 'none';
    menuPreview.style.display = 'block';
    generateBtn.style.display = 'flex';
    if (currentMenu.length > 0) {
      menuStats.style.display = 'flex';
    }
  }
}

function renderAvailableRecipes() {
  const container = document.getElementById('availableRecipes');
  let filteredRecipes = recipes;

  if (currentFilter !== 'all') {
    filteredRecipes = recipes.filter(r => r.category === currentFilter);
  }

  container.innerHTML = `
    <div class="recipe-grid">
      ${filteredRecipes.map(recipe => {
        const isSelected = selectedRecipes.some(r => r.id === recipe.id);
        return `
          <div class="recipe-card ${recipe.category} ${isSelected ? 'selected' : ''}" onclick="toggleRecipe(${recipe.id})">
            <div class="recipe-card-icon">${categoryIcons[recipe.category]}</div>
            <h4>${recipe.name}</h4>
            <span class="recipe-card-category">${recipe.categoryName}</span>
            <div class="recipe-card-meta">
              <span>⏱ ${recipe.time}</span>
              <span>📊 ${recipe.difficulty}</span>
            </div>
            ${isSelected ? '<div class="selected-badge">✓</div>' : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function toggleRecipe(id) {
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return;

  const index = selectedRecipes.findIndex(r => r.id === id);
  if (index > -1) {
    selectedRecipes.splice(index, 1);
  } else if (selectedRecipes.length < 12) {
    selectedRecipes.push(recipe);
  } else {
    alert('最多只能选择12道菜！');
    return;
  }

  renderAvailableRecipes();
  renderSelectedList();
  updateSelectedCount();
}

function renderSelectedList() {
  const container = document.getElementById('selectedList');

  if (selectedRecipes.length === 0) {
    container.innerHTML = '<p class="empty-selected">还没有选择菜品</p>';
    return;
  }

  container.innerHTML = `
    <div class="selected-items">
      ${selectedRecipes.map((recipe, index) => `
        <div class="selected-item">
          <span class="selected-item-number">${index + 1}</span>
          <div class="selected-item-icon">${categoryIcons[recipe.category]}</div>
          <div class="selected-item-info">
            <div class="selected-item-name">${recipe.name}</div>
            <div class="selected-item-category">${recipe.categoryName}</div>
          </div>
          <button class="remove-btn" onclick="event.stopPropagation(); removeRecipe(${recipe.id})">×</button>
        </div>
      `).join('')}
    </div>
  `;
}

function removeRecipe(id) {
  selectedRecipes = selectedRecipes.filter(r => r.id !== id);
  renderAvailableRecipes();
  renderSelectedList();
  updateSelectedCount();
}

function updateSelectedCount() {
  document.getElementById('selectedCount').textContent = selectedRecipes.length;
  document.getElementById('confirmSelection').disabled = selectedRecipes.length < 1;
}

function clearSelection() {
  if (selectedRecipes.length === 0) return;
  if (confirm('确定要清空所有选择吗？')) {
    selectedRecipes = [];
    renderAvailableRecipes();
    renderSelectedList();
    updateSelectedCount();
  }
}

function confirmSelection() {
  if (selectedRecipes.length === 0) return;

  currentMenu = selectedRecipes;
  renderMenu();
  updateStats();
  toggleMode('random');
  document.getElementById('exportBtn').disabled = false;
  document.getElementById('aiBtn').disabled = false;
}

function filterByCategory(category) {
  currentFilter = category;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === category);
  });
  renderAvailableRecipes();
}
