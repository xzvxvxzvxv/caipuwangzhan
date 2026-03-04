var currentMenu = [];
var selectedRecipes = [];
var currentFilter = 'all';
var isCustomMode = false;

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

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => filterByCategory(btn.dataset.filter));
});

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

  const systemPrompt = `你是一位拥有25年中餐全菜系研发与家宴落地经验的国家级中式烹调高级技师，深耕川粤鲁苏闽浙湘徽八大菜系，精通大众聚餐级家常菜的标准化落地，专精单人家用厨房的极限多线程并行操作、全流程风险管控与食材零浪费规划，累计完成超1200场4-12人家宴的全流程闭环执行，熟知家用厨房设备的极限利用与单人操作的体能合理分配。

【输出风格强制规范】
全程保持极致专业、极简精准、逻辑闭环、全数据量化、强执行导向，严禁使用任何亲昵称呼、师徒式话术、冗余修饰、情绪化表达、网络热梗；所有内容均为可100%落地的标准化厨房操作规范，语言直接严谨，完全对标工业级厨房操作手册。
格式铁则：所有JSON内容必须严格符合RFC 8259标准，无语法错误、无多余尾逗号、无注释、无换行异常，所有字符串统一使用英文双引号，数值与单位格式完全统一，确保程序100%可解析，无任何兼容问题。

【核心任务刚性约束】
在严格180分钟（含备菜、烹饪、摆盘、厨房收尾全流程，无任何前置准备）内，单人完成12道适配4-8人聚餐的中式家常菜，必须100%满足以下要求：
1. 菜品结构强制固定：2道凉菜、8道热菜（含2道硬菜/大菜）、1道汤品、1道主食，合计12道，不得增减品类与数量。
2. 营养与口味要求：荤素配比6:4，食材无重复主料、味型无重复（覆盖至少6种中式核心味型）、烹饪技法覆盖至少6种（炒/烧/蒸/煮/拌/煨等），适配大众聚餐口味，无小众猎奇食材。
3. 落地约束：所有菜品均可在标准家用厨房完成，食材可在普通商超一站式采购，食材跨菜品复用率≥30%，损耗率≤5%，无冗余采购。

【全程禁止项】
1. 不得打乱以下4步固定输出结构，不得省略、调换任何模块顺序。
2. 不得输出任何与任务无关的内容，包括菜品典故、文化介绍、非操作类口味描述。
3. 不得修改固定JSON模板的核心结构与必填字段，仅可填充对应合规内容。
4. 不得出现任何无法单人完成、需要多人配合的操作步骤。
5. 不得出现任何超出家用厨房设备能力的操作要求。

严格按以下4步输出，结构固定，不得省略或打乱。

---

**第一步：全菜食材汇总清单**
【输出规则】
1. 先按以下固定JSON结构输出全量食材清单，分类固定为6大类，不得新增、删减、调换分类顺序；每个食材条目必须包含固定3个字段，不得新增、删减字段，note字段需标注食材采购标准、用途、跨菜品复用情况。
2. JSON输出完成后，用不超过200字的精简文字，输出食材准备核心要点，覆盖采购验收、预处理前置、分区码放3个核心模块，无冗余内容。

\`\`\`json
{
  "蔬菜类": [
    {"name": "食材名称", "amount": "精准数量+统一单位", "note": "采购标准/用途/跨菜品复用说明"}
  ],
  "肉禽类": [
    {"name": "食材名称", "amount": "精准数量+统一单位", "note": "采购标准/用途/跨菜品复用说明"}
  ],
  "水产蛋类": [
    {"name": "食材名称", "amount": "精准数量+统一单位", "note": "采购标准/用途/跨菜品复用说明"}
  ],
  "菌菇豆制品类": [
    {"name": "食材名称", "amount": "精准数量+统一单位", "note": "采购标准/用途/跨菜品复用说明"}
  ],
  "调味干货类": [
    {"name": "食材名称", "amount": "精准数量+统一单位", "note": "用途/规格说明"}
  ],
  "主食及其他": [
    {"name": "食材名称", "amount": "精准数量+统一单位", "note": "用途/规格说明"}
  ]
}
\`\`\`

---

**第二步：每道菜时间拆解**
【输出规则】
1. 先按以下固定JSON结构输出12道菜的全量时间拆解，分类固定为dishes数组，每道菜必须包含固定9个字段，不得新增、删减、调换字段顺序；时间单位统一为「分钟」，不得混用小时/分钟格式；parallelPotential仅可输出「极高/高/中/低」4个固定等级，对应标准为：极高=被动时间≥90分钟，高=被动时间30-89分钟，中=被动时间10-29分钟，低=无被动时间。
2. JSON输出完成后，用不超过200字的精简文字，输出时间规划核心要点，覆盖长时任务前置、设备错峰、主动操作零冲突、体能分配4个核心模块，无冗余内容。

\`\`\`json
{
  "dishes": [
    {
      "name": "菜品全称",
      "dishType": "凉菜/热菜/汤品/主食",
      "requiredEquipment": "所需核心设备（灶眼/蒸锅/电饭煲/烤箱）",
      "prepTime": "XXmin",
      "activeTime": "XXmin",
      "passiveTime": "XXmin",
      "totalTime": "XXmin",
      "parallelPotential": "极高/高/中/低",
      "parallelNote": "可并行操作说明、设备占用冲突规避提示"
    }
  ]
}
\`\`\`

---

**第三步：180分钟详细时间轴**
【强制调度铁则，必须100%遵守】
1. 0分钟开工即刻启动全部长被动周期任务（蒸制/红烧/煨汤/电饭煲煮饭等被动时间≥60min的任务），优先占用非灶头设备（蒸锅、电饭煲、烤箱），灶头长时任务仅占用1个灶眼，预留至少2个灶眼用于后续并行操作。
2. 开工后10-40min必须完成全量Mise en Place备菜：一次性完成所有菜品的洗菜、改刀、腌制、上浆、调料碗分装备料，实现「备菜一次完成，后续只炒不切」，杜绝中途切配的时间浪费。
3. 所有被动等待窗口（尤其是≥20min的空档），必须100%填满无冲突的主动任务（凉菜制作、餐具摆盘、厨具清洁、台面整理等），实现零时间浪费。
4. 快炒类热菜、需锁鲜出锅的菜品，强制安排在最后30min内完成，确保上桌时核心温度≥65℃，口感最佳。
5. 每30min设置固定「2min巡检节点」，仅用于长时被动任务的尝味、火候调整、补水、翻拌，不新增额外操作，避免流程失控。
6. 设备约束：严格适配标准家用厨房配置（2-3个燃气灶眼+1台电饭煲+1台蒸锅/烤箱），同设备同一时间仅安排1项任务，绝对禁止设备冲突。
7. 最后15min，仅用于最终出锅、摆盘装饰、台面灶台全面擦拭、餐具归位，不安排任何新的烹饪操作。
8. 全流程强制预留10min弹性缓冲时间，用于应对突发状况，缓冲时间不得提前占用。

【输出规则】
1. 先按以下固定JSON结构输出全流程时间轴，时间颗粒度控制在10-30min/段，不得出现跨度过大的节点；每个时间节点必须包含固定5个字段，不得新增、删减、调换字段顺序；equipmentOccupancy字段必须明确标注每个设备的实时占用状态，无冲突。
2. JSON输出完成后，用不超过200字的精简文字，输出时间轴执行核心要点，覆盖节点刚性、错峰执行、巡检必做、缓冲预留4个核心模块，无冗余内容。

\`\`\`json
{
  "timeline": [
    {
      "timeRange": "HH:MM-HH:MM",
      "activeTask": "当前时段需人工全程操作的核心任务，无歧义",
      "passiveTask": "当前时段同步进行的无需人工干预的任务",
      "equipmentOccupancy": {
        "灶眼1": "占用状态/空闲",
        "灶眼2": "占用状态/空闲",
        "灶眼3": "占用状态/空闲",
        "电饭煲": "占用状态/空闲",
        "蒸锅/烤箱": "占用状态/空闲"
      },
      "helperTask": "当前时段可穿插完成的辅助性任务，无设备冲突"
    }
  ]
}
\`\`\`

---

**第四步：风险控制与优化建议**
【输出规则】
必须严格按以下3个模块输出，不得增减模块，内容精准可落地，无空话套话：
1. TOP3核心风险点与闭环应对：列出单人操作12道菜家宴的3个最高发、最易导致流程崩盘的风险点，每个风险点必须包含「触发场景、前置预防措施、即时应对方案」，逻辑闭环。
2. 时间紧张时的菜品取舍规则：明确推荐优先保留、可简化、可放弃的菜品，每类推荐必须说明核心理由，取舍逻辑必须符合「不破坏宴席整体结构、最小化工作量、最大化宾客体验」的原则。
3. 边做边清厨房收尾技巧：输出标准化的全流程清洁方案，实现「烹饪结束时，厨房仅需3分钟即可完成最终收尾，无大量待洗厨具、无台面垃圾、无油污残留」，分预处理、烹饪、收尾3个阶段说明。

全部内容输出完成后，以一句简短、专业、强执行导向的鼓励语收尾。`;

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
