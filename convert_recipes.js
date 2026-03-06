const recipes = [
  {
    id: 1,
    name: '蛋炒饭',
    category: 'staple',
    categoryName: '主食',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    description: '简单快手的家常主食，粒粒分明，香气扑鼻。',
    time: '15分钟',
    difficulty: '简单',
    ingredients: ['米饭 2碗', '鸡蛋 2个', '葱花 适量', '盐 适量', '食用油 适量'],
    steps: [
      '将鸡蛋打散，米饭用筷子拨散备用',
      '锅中倒油烧热，倒入蛋液快速翻炒成小块盛出',
      '锅中再加少许油，倒入米饭中火翻炒',
      '加入炒好的鸡蛋，加盐调味',
      '撒上葱花翻炒均匀即可出锅'
    ]
  },
  {
    id: 2,
    name: '阳春面',
    category: 'staple',
    categoryName: '主食',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    description: '清淡鲜美的传统面食，汤清味鲜，面条爽滑。',
    time: '10分钟',
    difficulty: '简单',
    ingredients: ['细面条 1份', '葱花 适量', '生抽 2勺', '猪油 1勺', '盐 适量'],
    steps: [
      '碗中放入生抽、猪油、盐和葱花',
      '用开水冲入碗中调成汤底',
      '面条放入开水中煮熟',
      '将面条捞入汤碗中即可'
    ]
  },
  {
    id: 3,
    name: '清炒时蔬',
    category: 'vegetable',
    categoryName: '素菜',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
    description: '保留蔬菜原味的健康做法，清脆爽口。',
    time: '10分钟',
    difficulty: '简单',
    ingredients: ['时令蔬菜 300g', '蒜末 适量', '盐 适量', '食用油 适量'],
    steps: [
      '蔬菜洗净切段，蒜切末备用',
      '锅中倒油烧热，爆香蒜末',
      '倒入蔬菜大火快炒',
      '加盐调味，炒至断生即可'
    ]
  },
  {
    id: 4,
    name: '蒜蓉西兰花',
    category: 'vegetable',
    categoryName: '素菜',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400',
    description: '营养丰富的健康素菜，蒜香浓郁。',
    time: '12分钟',
    difficulty: '简单',
    ingredients: ['西兰花 1颗', '蒜末 4瓣', '盐 适量', '蚝油 1勺', '食用油 适量'],
    steps: [
      '西兰花切小朵，焯水后捞出沥干',
      '锅中倒油烧热，爆香蒜末',
      '倒入西兰花翻炒均匀',
      '加蚝油、盐调味即可出锅'
    ]
  },
  {
    id: 5,
    name: '红烧肉',
    category: 'meat',
    categoryName: '荤菜',
    image: 'https://images.unsplash.com/photo-1623595119708-26b1f7300075?w=400',
    description: '经典家常菜，肥而不腻，入口即化。',
    time: '60分钟',
    difficulty: '中等',
    ingredients: ['五花肉 500g', '冰糖 30g', '生抽 3勺', '老抽 1勺', '料酒 2勺', '八角 2个', '桂皮 1小块', '姜片 5片'],
    steps: [
      '五花肉切块，冷水下锅焯水后捞出',
      '锅中放少许油，加冰糖炒出糖色',
      '放入五花肉翻炒上色',
      '加入料酒、生抽、老抽、八角、桂皮、姜片',
      '加开水没过肉，大火烧开后转小火炖45分钟',
      '大火收汁即可'
    ]
  },
  {
    id: 6,
    name: '糖醋排骨',
    category: 'meat',
    categoryName: '荤菜',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
    description: '酸甜可口，外酥里嫩的经典菜肴。',
    time: '40分钟',
    difficulty: '中等',
    ingredients: ['排骨 500g', '白糖 3勺', '醋 4勺', '生抽 2勺', '料酒 1勺', '番茄酱 2勺'],
    steps: [
      '排骨切段，焯水后洗净备用',
      '锅中倒油，放入排骨煎至金黄',
      '加入白糖、醋、生抽、料酒、番茄酱',
      '加适量清水没过排骨，大火烧开后转小火焖煮30分钟',
      '大火收汁至浓稠即可'
    ]
  }
];

const fs = require('fs');
fs.writeFileSync('recipes.json', JSON.stringify(recipes, null, 2));
console.log('Exported', recipes.length, 'recipes');
