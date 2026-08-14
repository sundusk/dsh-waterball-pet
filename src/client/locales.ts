/**
 * dsh-waterball locale dictionaries (zh/en).
 * @module @linxin666/dsh-waterball/client/locales
 */

/** Dictionary namespace this package registers. */
export const NS = 'waterball'

/** Chinese copy. */
export const zh = {
  'settings.title': '水球宠物',
  'settings.description': '右下角的天蓝色水球宠物，随 Agent 活动切换状态。',
  'settings.enabled': '启用水球',
  'settings.enabledHint': '关闭后隐藏水球并停止轮询，可在设置里重新启用。',
  'settings.hidden': '隐藏网页水球',
  'settings.hiddenHint': '仅不在网页端显示水球；状态接口仍保持可用（桌面呼吸灯可继续读取）。',
  'settings.size': '大小（px）',
  'settings.sizeHint': '水球渲染宽度，范围 64–400。',
  'settings.right': '距右侧（px）',
  'settings.rightHint': '距视口右边缘的水平内缩距离。',
  'settings.bottom': '距底部（px）',
  'settings.bottomHint': '距视口底边的垂直内缩距离。',
  'settings.inherit': '继承',
  'settings.on': '开',
  'settings.off': '关',
  'settings.overridden': '已覆盖',
  'settings.reset': '恢复默认',
  'settings.readOnly': '当前部署的设置只读。',
  'settings.expand': '展开设置',
  'settings.collapse': '收起设置',
  'settings.save': '保存',
  'settings.saving': '保存中…',
  'settings.discard': '放弃',
  'settings.unsaved': '未保存',
  'settings.saveFailed': '部署未接受这些值，已保留供你修改。',
  'settings.invalidNumber': '请输入数字，留空则使用默认值。',
} as const

/** English copy. */
export const en = {
  'settings.title': 'Water Ball',
  'settings.description': 'A floating sky-blue water ball that reacts to agent activity.',
  'settings.enabled': 'Enable the water ball',
  'settings.enabledHint': 'When off, the water ball hides and polling stops; re-enable it here.',
  'settings.hidden': 'Hide the web water ball',
  'settings.hiddenHint': 'Hides the ball in the web UI only; the status API stays available (e.g. for the desktop breathing light).',
  'settings.size': 'Size (px)',
  'settings.sizeHint': 'Rendered width, 64\u2013400.',
  'settings.right': 'Right inset (px)',
  'settings.rightHint': 'Horizontal inset from the viewport right edge.',
  'settings.bottom': 'Bottom inset (px)',
  'settings.bottomHint': 'Vertical inset from the viewport bottom edge.',
  'settings.inherit': 'Inherit',
  'settings.on': 'On',
  'settings.off': 'Off',
  'settings.overridden': 'Overridden',
  'settings.reset': 'Reset to default',
  'settings.readOnly': 'This deployment stores settings read-only.',
  'settings.expand': 'Show settings',
  'settings.collapse': 'Hide settings',
  'settings.save': 'Save',
  'settings.saving': 'Saving\u2026',
  'settings.discard': 'Discard',
  'settings.unsaved': 'Unsaved',
  'settings.saveFailed': 'The deployment did not accept these values; they were left for you to correct.',
  'settings.invalidNumber': 'Enter a number, or leave blank to use the default.',
} as const

/** Key union for this namespace. */
export type WaterballKey = keyof typeof zh

/** The settings-card slice of the waterball dictionary. */
export type SettingsCardKey = WaterballKey

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** dsh-waterball UI copy. */
    waterball: WaterballKey
  }
}
