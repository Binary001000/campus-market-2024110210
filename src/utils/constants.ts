export const ITEM_TYPES = {
  TRADE: 'trade',
  LOST_FOUND: 'lostFound',
  GROUP_BUY: 'groupBuy',
  ERRAND: 'errand',
} as const

export type ItemType = (typeof ITEM_TYPES)[keyof typeof ITEM_TYPES]

export const TRADE_CATEGORIES = [
  '电子产品',
  '教材书籍',
  '生活用品',
  '服饰鞋包',
  '运动器材',
  '其他',
] as const

export const TRADE_CONDITIONS = ['全新', '几乎全新', '良好', '一般', '有瑕疵'] as const

export const LOST_FOUND_TYPES = [
  { value: 'lost', label: '寻物启事' },
  { value: 'found', label: '失物招领' },
] as const

export const GROUP_BUY_TYPES = ['餐饮美食', '学习资料', '运动健身', '生活拼单', '其他'] as const

export const ERRAND_TASK_TYPES = ['代取快递', '代买餐食', '代送文件', '代排队', '其他'] as const

export const ITEM_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  COMPLETED: 'completed',
} as const

export const CAMPUSES = ['主校区', '东校区', '西校区', '北校区', '南校区'] as const

export const COLLEGES = [
  '计算机学院',
  '数学学院',
  '物理学院',
  '化学学院',
  '外国语学院',
  '经管学院',
  '文学院',
  '法学院',
  '艺术学院',
  '体育学院',
] as const

export const API_BASE = '/api'

export const PAGE_SIZE = 10
