// 类型定义文件
export interface CanvasVersion {
  id: string;
  name: string;
  data: string;              // Fabric.js JSON
  canvasSize?: CanvasSize;   // 当前画布尺寸
  thumbnail?: string;        // Base64
  createdAt: number;
  updatedAt: number;
}

export interface HighlightConfig {
  text: string;
  type: 'marker' | 'underline' | 'box';
  color: string;
  fontSize?: number;
  fontFamily?: string;
  left?: number;
  top?: number;
  angle?: number;
  scaleX?: number;
  scaleY?: number;
}

export interface FontConfig {
  name: string;
  family: string;
  weight: number[];
  preview: string;  // 预览文字
  loaded?: boolean; // 是否已加载
  customUrl?: string; // 🆕 自定义字体 CDN URL
  cssPath?: string; // 🆕 npm 包的 CSS 路径（相对于 node_modules）
}

export const HIGHLIGHT_COLORS = [
  '#FFEB3B', // 黄色
  '#4CAF50', // 绿色
  '#2196F3', // 蓝色
  '#E91E63', // 粉色
  '#FF5722', // 橙色
];

export const LOCAL_OR_SYSTEM_FONTS = [
  'Noto Sans Arabic',
  'Noto Sans SC',
  'Noto Serif SC',
  'ZCOOL KuaiLe',
  'Georgia',
  'Playfair Display',
  'Merriweather',
  'Lora',
  'Roboto',
  'Arial, sans-serif',
] as const;

// 精选字体（中文 + 英文）- 按使用频率和热度排序
export const FONTS: FontConfig[] = [
  { name: 'Noto Sans Arabic', family: 'Noto Sans Arabic', weight: [400, 700], preview: 'تصميم' },
  { name: 'Noto Sans', family: 'Noto Sans SC', weight: [400, 700], preview: 'Design' },
  { name: 'Noto Serif', family: 'Noto Serif SC', weight: [400, 700], preview: 'Design' },
  { name: 'Georgia', family: 'Georgia', weight: [400, 700], preview: 'Design' },
  { name: 'Playfair', family: 'Playfair Display', weight: [400, 700], preview: 'Design' },
  { name: 'Merriweather', family: 'Merriweather', weight: [400, 700], preview: 'Design' },
  { name: 'Lora', family: 'Lora', weight: [400, 700], preview: 'Design' },
  { name: 'Roboto', family: 'Roboto', weight: [400, 700], preview: 'Design' },
];

// 画布尺寸配置
export interface CanvasSize {
  name: string;
  width: number;
  height: number;
  ratio: string;
}

export const CANVAS_RATIOS = {
  '3:4': [
    { name: '720×960', width: 720, height: 960, ratio: '3:4' },
    { name: '768×1024', width: 768, height: 1024, ratio: '3:4' },
    { name: '960×1280', width: 960, height: 1280, ratio: '3:4' },
    { name: '1080×1440', width: 1080, height: 1440, ratio: '3:4' },
  ],
  '1:1': [
    { name: '720×720', width: 720, height: 720, ratio: '1:1' },
    { name: '960×960', width: 960, height: 960, ratio: '1:1' },
    { name: '1080×1080', width: 1080, height: 1080, ratio: '1:1' },
  ],
  '4:3': [
    { name: '960×720', width: 960, height: 720, ratio: '4:3' },
    { name: '1024×768', width: 1024, height: 768, ratio: '4:3' },
    { name: '1280×960', width: 1280, height: 960, ratio: '4:3' },
    { name: '1440×1080', width: 1440, height: 1080, ratio: '4:3' },
  ],
  '16:9': [
    { name: '1280×720', width: 1280, height: 720, ratio: '16:9' },
    { name: '1920×1080', width: 1920, height: 1080, ratio: '16:9' },
    { name: '2560×1440', width: 2560, height: 1440, ratio: '16:9' },
  ],
  '21:9': [
    { name: '1680×720', width: 1680, height: 720, ratio: '21:9' },
    { name: '2100×900', width: 2100, height: 900, ratio: '21:9' },
    { name: '2560×1080', width: 2560, height: 1080, ratio: '21:9' },
    { name: '3440×1440', width: 3440, height: 1440, ratio: '21:9' },
    { name: '5120×2160', width: 5120, height: 2160, ratio: '21:9' },
  ],
  '9:16': [
    { name: '720×1280', width: 720, height: 1280, ratio: '9:16' },
    { name: '1080×1920', width: 1080, height: 1920, ratio: '9:16' },
    { name: '1440×2560', width: 1440, height: 2560, ratio: '9:16' },
  ],
};

// 默认画布尺寸（960×1280, 3:4）
export const DEFAULT_CANVAS_SIZE = CANVAS_RATIOS['3:4'][2];
export const CANVAS_WIDTH = DEFAULT_CANVAS_SIZE.width;
export const CANVAS_HEIGHT = DEFAULT_CANVAS_SIZE.height;

// 颜色系统
export const COLORS = {
  primary: '#FF2442',
  background: '#F7F8FA',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
  },
  icon: {
    default: '#6B7280',
    hover: '#1F2937',
    active: '#FF2442',
    disabled: '#9CA3AF',
  }
};
