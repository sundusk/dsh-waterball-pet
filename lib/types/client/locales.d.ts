/**
 * dsh-waterball locale dictionaries (zh/en).
 * @module @linxin666/dsh-waterball/client/locales
 */
/** Dictionary namespace this package registers. */
export declare const NS = "waterball";
/** Chinese copy. */
export declare const zh: {
    readonly 'settings.title': "水球宠物";
    readonly 'settings.description': "右下角的天蓝色水球宠物，随 Agent 活动切换状态。";
    readonly 'settings.enabled': "启用水球";
    readonly 'settings.enabledHint': "关闭后隐藏水球并停止轮询，可在设置里重新启用。";
    readonly 'settings.size': "大小（px）";
    readonly 'settings.sizeHint': "水球渲染宽度，范围 64–400。";
    readonly 'settings.right': "距右侧（px）";
    readonly 'settings.rightHint': "距视口右边缘的水平内缩距离。";
    readonly 'settings.bottom': "距底部（px）";
    readonly 'settings.bottomHint': "距视口底边的垂直内缩距离。";
    readonly 'settings.inherit': "继承";
    readonly 'settings.on': "开";
    readonly 'settings.off': "关";
    readonly 'settings.overridden': "已覆盖";
    readonly 'settings.reset': "恢复默认";
    readonly 'settings.readOnly': "当前部署的设置只读。";
    readonly 'settings.expand': "展开设置";
    readonly 'settings.collapse': "收起设置";
    readonly 'settings.save': "保存";
    readonly 'settings.saving': "保存中…";
    readonly 'settings.discard': "放弃";
    readonly 'settings.unsaved': "未保存";
    readonly 'settings.saveFailed': "部署未接受这些值，已保留供你修改。";
    readonly 'settings.invalidNumber': "请输入数字，留空则使用默认值。";
};
/** English copy. */
export declare const en: {
    readonly 'settings.title': "Water Ball";
    readonly 'settings.description': "A floating sky-blue water ball that reacts to agent activity.";
    readonly 'settings.enabled': "Enable the water ball";
    readonly 'settings.enabledHint': "When off, the water ball hides and polling stops; re-enable it here.";
    readonly 'settings.size': "Size (px)";
    readonly 'settings.sizeHint': "Rendered width, 64–400.";
    readonly 'settings.right': "Right inset (px)";
    readonly 'settings.rightHint': "Horizontal inset from the viewport right edge.";
    readonly 'settings.bottom': "Bottom inset (px)";
    readonly 'settings.bottomHint': "Vertical inset from the viewport bottom edge.";
    readonly 'settings.inherit': "Inherit";
    readonly 'settings.on': "On";
    readonly 'settings.off': "Off";
    readonly 'settings.overridden': "Overridden";
    readonly 'settings.reset': "Reset to default";
    readonly 'settings.readOnly': "This deployment stores settings read-only.";
    readonly 'settings.expand': "Show settings";
    readonly 'settings.collapse': "Hide settings";
    readonly 'settings.save': "Save";
    readonly 'settings.saving': "Saving…";
    readonly 'settings.discard': "Discard";
    readonly 'settings.unsaved': "Unsaved";
    readonly 'settings.saveFailed': "The deployment did not accept these values; they were left for you to correct.";
    readonly 'settings.invalidNumber': "Enter a number, or leave blank to use the default.";
};
/** Key union for this namespace. */
export type WaterballKey = keyof typeof zh;
/** The settings-card slice of the waterball dictionary. */
export type SettingsCardKey = WaterballKey;
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** dsh-waterball UI copy. */
        waterball: WaterballKey;
    }
}
