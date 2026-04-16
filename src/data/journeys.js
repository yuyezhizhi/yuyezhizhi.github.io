// 艺术旅程配置 - 按主题串联动画形成叙事体验
export const journeys = [
  {
    id: 'cosmic-odyssey',
    title: '宇宙奥德赛',
    subtitle: '从粒子到黑洞的星际之旅',
    description: '探索宇宙中最神秘的力量，从微观粒子到宏观天体的壮丽旅程',
    icon: '🌌',
    color: 'linear-gradient(135deg, #0c0c1d 0%, #1a0533 50%, #2d1b69 100%)',
    duration: '5-8 分钟',
    artworks: [
      {
        id: 'gravity-particles',
        title: '重力粒子',
        narrative: '旅程开始于最微小的粒子，它们在重力的召唤下开始聚集...',
        duration: 60
      },
      {
        id: 'magnetic-field',
        title: '磁场可视化',
        narrative: '磁场如无形的琴弦，在宇宙中编织着复杂的图案...',
        duration: 60
      }
    ]
  },
  {
    id: 'nature-symphony',
    title: '自然交响曲',
    subtitle: '生命律动的视觉诗篇',
    description: '从细胞分裂到生态系统，感受生命的律动与自然的和谐',
    icon: '🌿',
    color: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    duration: '6-10 分钟',
    artworks: [
      {
        id: 'cell-division',
        title: '细胞分裂',
        narrative: '生命始于一个细胞的分裂，这是自然界最神奇的魔法...',
        duration: 60
      },
      {
        id: 'fractal-tree',
        title: '分形树',
        narrative: '从细胞到植物，分形几何展现着自然的生长密码...',
        duration: 60
      },
      {
        id: 'fish',
        title: '鱼群效果',
        narrative: '生命在水中自由游弋，鱼群展现着群体智能的美妙...',
        duration: 60
      },
      {
        id: 'butterfly',
        title: '蝴蝶网',
        narrative: '蝴蝶翩翩起舞，为这场自然交响曲画上优雅的句号...',
        duration: 60
      }
    ]
  },
  {
    id: 'wave-energy',
    title: '波与能量',
    subtitle: '物理之美的可视化探索',
    description: '从弦波干涉到音频可视化，感受能量在空间中传播的韵律',
    icon: '〰️',
    color: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)',
    duration: '5-8 分钟',
    artworks: [
      {
        id: 'wave-interference',
        title: '弦波干涉',
        narrative: '当两束波相遇，它们创造出美丽的干涉图案...',
        duration: 60
      },
      {
        id: 'rainbow-wave',
        title: '彩虹波浪',
        narrative: '能量如彩虹般流动，展现着光与色的和谐...',
        duration: 60
      },
      {
        id: 'audio-visualizer',
        title: '音乐可视化',
        narrative: '声音也能被看见，音乐在画布上起舞...',
        duration: 60
      },
      {
        id: 'frequency-tower',
        title: '频谱塔林',
        narrative: '频率构筑起一座座塔林，演奏着数字时代的交响乐...',
        duration: 60
      }
    ]
  },
  {
    id: 'meditation-flow',
    title: '冥想之流',
    subtitle: '治愈心灵的交互体验',
    description: '放慢节奏，与这些治愈系作品进行深度互动，寻找内心的宁静',
    icon: '🧘',
    color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    duration: '自由探索',
    artworks: [
      {
        id: 'bubble-pop',
        title: '彩色泡泡',
        narrative: '轻轻点击，让压力随着泡泡一起消散...',
        duration: '自由',
        interactive: true
      },
      {
        id: 'quicksand',
        title: '流沙坍塌',
        narrative: '看着流沙缓缓流动，感受时间的流逝...',
        duration: '自由',
        interactive: true
      },
      {
        id: 'starlight-dance',
        title: '星光舞蹈',
        narrative: '星光跟随你的指尖起舞，你是这场舞蹈的指挥...',
        duration: '自由',
        interactive: true
      },
      {
        id: 'mandala',
        title: '对称曼陀罗',
        narrative: '在旋转对称中找到内心的平衡与宁静...',
        duration: 60
      }
    ]
  },
  {
    id: 'generative-art',
    title: '生成艺术',
    subtitle: '算法与美的碰撞',
    description: '探索代码创造的艺术世界，见证算法如何孕育出独特的美学',
    icon: '🎨',
    color: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
    duration: '5-7 分钟',
    artworks: [
      {
        id: 'noise-terrain',
        title: '噪声地形',
        narrative: '简单的噪声函数，却能生成壮丽的山川地貌...',
        duration: 60
      },
      {
        id: 'cellular-automata',
        title: '细胞自动机',
        narrative: '简单的规则，复杂的涌现——生命游戏的奇妙世界...',
        duration: 60
      },
      {
        id: 'morphing-sphere',
        title: '流动球体',
        narrative: '几何形状在算法的作用下不断变形，展现着数学之美...',
        duration: 60
      },
      {
        id: 'dancer',
        title: '光之舞者',
        narrative: '光与影的抽象舞蹈，是算法创造的最纯粹的艺术...',
        duration: 90
      }
    ]
  }
]
