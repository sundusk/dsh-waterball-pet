/**
 * dsh-waterball browser half — renders the floating water ball and drives it
 * from the host's same-origin `GET /api/waterball/status` endpoint, gated by
 * the `waterball` settings namespace `enabled` master switch. It also seats a
 * plugin configuration card directly in the settings plugin section, on the
 * same level as the built-in Shell / Agent loop / Web search cards and the
 * "Web UI 插件" family group.
 * @module @linxin666/dsh-waterball/client
 */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the settings-surface Context merge (ctx.settingsScope).
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { WaterballDockEntry } from './WaterballPet.tsx'
import { WaterballSettingsCard, WaterballSettingsCardController, type WaterballSettings } from './WaterballSettingsCard.tsx'
import { NS, en, zh } from './locales.ts'

/** Settings namespace the settings card edits (the host plugin registers it). */
const WATERBALL_SETTINGS_NS = 'waterball'

/** Required services. */
export const inject = ['slots', 'locale', 'connection', 'settingsScope', 'remote']

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    /**
     * One plugin's configuration card inside the settings plugin section.
     * Type-only local copy of the slot the official SDK
     * (`dsh-client-ui-settings-plugins`) declares at runtime; kept here so
     * this plugin's typecheck stays self-contained. Registering here puts the
     * card on the same level as the built-in Shell / Agent loop / Web search
     * cards and the "Web UI 插件" family group.
     */
    'settings.plugin.item': { kind: 'list'; scope: 'root'; owner: SettingsPluginItemOwnerProps }
    /** Frame-wide overlay that is rendered on both the new-session and active-session pages. */
    'shell.overlay': { kind: 'list'; scope: 'root'; owner: ShellOverlayOwnerProps }
  }
}

/** Owner share of a plugin card (the settings section supplies nothing). */
export interface SettingsPluginItemOwnerProps {
  /** Marker field: card owner props are intentionally empty. */
  children?: never
}

/** Owner share of the frame-wide overlay (the layout supplies no props). */
export interface ShellOverlayOwnerProps {
  /** Marker field: overlay owner props are intentionally empty. */
  children?: never
}

/**
 * Client plugin body: register dictionaries, mount the water ball and its
 * poll loop while the plugin is enabled, and seat the settings card in the
 * settings plugin section.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'waterball: dictionaries')

  const settingsScope = ctx.settingsScope.bind<WaterballSettings>({ namespace: WATERBALL_SETTINGS_NS })
  const enabled = (): boolean => {
    const snapshot = settingsScope.getSnapshot()
    return snapshot.status === 'ready'
      ? snapshot.value?.enabled ?? true
      : snapshot.status === 'unavailable'
  }
  // 「隐藏」只影响网页端是否渲染水球，不关停 host 的状态监听与 /api/waterball/status
  const hidden = (): boolean => {
    const snapshot = settingsScope.getSnapshot()
    return snapshot.status === 'ready'
      ? snapshot.value?.hidden ?? true
      : false
  }
  const persistPosition = (right: number, bottom: number): void => {
    void settingsScope.set('right', Math.round(right))
    void settingsScope.set('bottom', Math.round(bottom))
  }

  // Plugin configuration card: one staged form over the `waterball` settings
  // namespace, contributed to the settings plugin section at the top level
  // (a sibling of the built-in Shell / Agent loop / Web search cards and the
  // "Web UI 插件" family group card).
  const card = new WaterballSettingsCardController(settingsScope)
  ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
    name: 'settings.plugin.item',
    id: 'waterball-settings',
    order: 150,
    locale: NS,
    inject: () => card.inject(),
  }, WaterballSettingsCard))

  // The dock entry (and its poll loop) lives while the plugin is enabled and
  // not hidden; toggling `enabled` off or `hidden` on removes the ball from
  // the web UI without touching the host-side status route.
  let disposeUi: (() => void) | undefined
  const syncUi = (): void => {
    if (enabled() && !hidden() && disposeUi === undefined) {
      disposeUi = ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay',
        id: 'waterball',
        order: 110,
        locale: NS,
        inject: () => ({ persistPosition }),
      }, WaterballDockEntry))
    } else if ((!enabled() || hidden()) && disposeUi !== undefined) {
      disposeUi()
      disposeUi = undefined
    }
  }
  settingsScope.subscribe(syncUi)
  syncUi()
}
