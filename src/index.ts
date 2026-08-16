/**
 * dsh-moodball-web host half — tracks agent activity and serves the current mood
 * over a same-origin JSON route, plus registers the `waterball` settings
 * namespace (`enabled` master switch + `size`). Install via
 * `dsh plugin --profile web add link:<repo>/packages/dsh-moodball-web`.
 * @module @linxin666/dsh-moodball-web
 */

import { Context } from '@deepseek-ai/cordis'
import { installSettingsSection, settingsNamespace } from '@deepseek-ai/dsh-settings'
import type {} from '@deepseek-ai/dsh-host-webserver'
import type { WebRoute } from '@deepseek-ai/dsh-host-webserver'
import type { Session } from '@deepseek-ai/dsh-session'
import type { IncomingMessage, ServerResponse } from 'node:http'
import z from 'schemastery'

/** Stable cordis plugin name (matches cordis.patch.yml insert id). */
export const name = 'moodball-web'

/** Services required before the water ball can mount its surfaces. */
export const inject = ['webServer']

/** Settings namespace of the water ball capability (the browser half spells the same value). */
export const WATERBALL_SETTINGS_NAMESPACE = 'waterball'

/** Bounds of the size field, in px (the rendered SVG width). */
export const WATERBALL_SIZE_MIN = 64
export const WATERBALL_SIZE_MAX = 400

/** Bounds of the right/bottom viewport insets, in px. */
export const WATERBALL_INSET_MAX = 2000

/** Default insets from the viewport bottom-right corner, in px. */
export const WATERBALL_DEFAULT_INSET = 16

/** The water ball's settings-namespace section. */
export interface WaterballSettingsSection {
  /** Master switch for the plugin (browser half + host routes). */
  enabled?: boolean
  /** Hide the ball in the web UI only; the status route and mood tracking stay live. */
  hidden?: boolean
  /** Rendered SVG width in px. */
  size?: number
  /** Horizontal inset from the viewport right edge, px. */
  right?: number
  /** Vertical inset from the viewport bottom edge, px. */
  bottom?: number
  /** Eye fill color, normalized to 'white' | 'black' by the status route. */
  eyeColor?: string
  /** Whether the eyes are drawn at all. */
  showEyes?: boolean
}

/** The mood the browser half renders (one of the CSS state classes). */
export type WaterballMood = 'idle' | 'waiting' | 'jumping' | 'done' | 'failed' | 'stopped' | 'waving' | 'authorizing' | 'questioning'

/** Settings section schema. */
export const WATERBALL_SETTINGS_SCHEMA = z.object({
  enabled: z.boolean().default(true),
  // 发布版面向「只要桌面呼吸灯」的用户：初始默认隐藏网页球，
  // 网页设置里可随时打开（hidden 不影响 /api/waterball/status）。
  hidden: z.boolean().default(true),
  size: z.number().step(1).min(WATERBALL_SIZE_MIN).max(WATERBALL_SIZE_MAX).default(120),
  right: z.number().step(1).min(0).max(WATERBALL_INSET_MAX).default(WATERBALL_DEFAULT_INSET),
  bottom: z.number().step(1).min(0).max(WATERBALL_INSET_MAX).default(WATERBALL_DEFAULT_INSET),
  // eyeColor 以字符串保存（设置表单用下拉框约束为 white/black），
  // 状态路由里再归一化为字面量类型。
  eyeColor: z.string().default('white'),
  showEyes: z.boolean().default(true),
})

/** Write one JSON response. */
function json(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

/**
 * Register the water ball service surfaces and the `waterball` settings
 * namespace. The status route is registered only while the plugin is enabled;
 * toggling the setting off removes it until re-enabled.
 * @param ctx - host root context.
 */
export function apply(ctx: Context): void {
  let mood: WaterballMood = 'idle'
  let holdUntil = 0
  // ask_user_question 挂起中：选项框弹出期间锁定 questioning，防止
  // activity 追踪器的 tool phase 把它覆盖回 jumping。
  let questionActive = false
  let current: () => WaterballSettingsSection = () => ({ enabled: true, size: 120 })

  // A transient mood (done / failed / stopped) holds for `ms` before reverting
  // to idle, so the colored reaction is visible instead of being swallowed by
  // the immediately following `activity/status` idle phase.
  const setTransient = (next: WaterballMood, ms: number): void => {
    mood = next
    holdUntil = Date.now() + ms
    setTimeout(() => {
      if (mood === next) mood = 'idle'
    }, ms)
  }

  const section = (): { enabled: boolean; hidden: boolean; size: number; right: number; bottom: number; eyeColor: 'white' | 'black'; showEyes: boolean } => {
    const s = current()
    const clampInset = (value: number): number =>
      Math.round(Math.min(WATERBALL_INSET_MAX, Math.max(0, value)))
    return {
      enabled: s.enabled ?? true,
      hidden: s.hidden ?? true,
      size: Math.round(Math.min(WATERBALL_SIZE_MAX, Math.max(WATERBALL_SIZE_MIN, s.size ?? 120))),
      right: clampInset(s.right ?? WATERBALL_DEFAULT_INSET),
      bottom: clampInset(s.bottom ?? WATERBALL_DEFAULT_INSET),
      eyeColor: s.eyeColor === 'black' ? 'black' : 'white',
      showEyes: s.showEyes ?? true,
    }
  }

  // Track the activity tracker's `activity/status` session events (phases:
  // idle / waiting / thinking / tool / done) and the turn lifecycle, folding
  // them into a mood. Transient moods (done / failed / stopped) hold briefly
  // so their reaction color is visible before the next idle phase.
  ctx.on('session/event', (_session: Session, event: { type: string; data?: unknown }) => {
    if (!section().enabled) return
    // The optional activity tracker publishes `activity/status`, but the
    // standard DSH session stream is always present. Use both so the green
    // thinking color does not depend on an extra activity plugin being loaded.
    if (event.type === 'turn/start' || event.type === 'step/start' || event.type === 'assistant/chunk') {
      mood = 'waiting'
      holdUntil = 0
    } else if (event.type === 'tool/call') {
      // ask_user_question 是普通工具调用：选项框弹出 → 粉色 questioning，
      // 与普通工具（紫色 jumping）区分开。
      const call = (event.data ?? {}) as { name?: string }
      if (call.name === 'ask_user_question') {
        questionActive = true
        mood = 'questioning'
        holdUntil = 0
      } else {
        mood = 'jumping'
        holdUntil = 0
      }
    } else if (event.type === 'tool/result') {
      const result = (event.data ?? {}) as { error?: { code?: string } }
      if (questionActive) {
        // 选项框关闭：用户点了选项 → 回 waiting；用户取消/关闭弹窗 → 短暂 stopped
        questionActive = false
        if (result.error !== undefined) setTransient('stopped', 1500)
        else {
          mood = 'waiting'
          holdUntil = 0
        }
      } else {
        mood = 'waiting'
        holdUntil = 0
      }
    } else if (event.type === 'approval/asked') {
      // 授权等待：用户尚未批准工具调用 → 黄色（authorizing）
      mood = 'authorizing'
      holdUntil = 0
    } else if (event.type === 'approval/decided') {
      // 授权已决定：批准 → 等后续工具事件；拒绝/取消/不可用 → 视为失败
      const payload = (event.data ?? {}) as { result?: string }
      if (payload.result === 'allowed-once') {
        mood = 'waiting'
        holdUntil = 0
      } else if (payload.result === 'rejected' || payload.result === 'cancelled' || payload.result === 'unavailable') {
        setTransient('failed', 3000)
      }
    } else if (event.type === 'activity/status') {
      const payload = (event.data ?? {}) as { phase?: string }
      if (payload.phase === undefined) return
      switch (payload.phase) {
        case 'waiting':
        case 'thinking':
          mood = 'waiting'
          holdUntil = 0
          break
        case 'tool':
          // 提问挂起中：选项框未关闭，保持 questioning，不被 tool phase 覆盖
          if (questionActive) return
          mood = 'jumping'
          holdUntil = 0
          break
        case 'done':
          setTransient('done', 2500)
          break
        case 'idle':
          if (Date.now() < holdUntil) return
          mood = 'idle'
          break
        default:
          break
      }
    } else if (event.type === 'turn/end') {
      questionActive = false
      const payload = (event.data ?? {}) as { reason?: { kind?: string } }
      const kind = payload.reason?.kind
      if (kind === 'error') setTransient('failed', 3000)
      else if (kind === 'completed') setTransient('done', 2500)
      else if (kind !== undefined) setTransient('stopped', 3000)
    }
  })

  const statusRoute: WebRoute = {
    kind: 'exact',
    path: '/api/waterball/status',
    handler: (req: IncomingMessage, res: ServerResponse): void => {
      if (req.method !== 'GET') {
        json(res, 405, { ok: false, error: 'method-not-allowed' })
        return
      }
      const s = section()
      json(res, 200, { ok: true, mood, enabled: s.enabled, hidden: s.hidden, size: s.size, right: s.right, bottom: s.bottom, eyeColor: s.eyeColor, showEyes: s.showEyes })
    },
  }

  let disposeRoute: (() => void) | undefined
  const syncRoutes = (): void => {
    if (disposeRoute === undefined && section().enabled) {
      disposeRoute = ctx.effect(() => ctx.webServer.register(statusRoute), 'moodball-web: status route')
    } else if (disposeRoute !== undefined && !section().enabled) {
      disposeRoute()
      disposeRoute = undefined
    }
  }

  installSettingsSection(ctx, settingsNamespace(WATERBALL_SETTINGS_NAMESPACE), WATERBALL_SETTINGS_SCHEMA, {
    enabled: true,
    hidden: true,
    size: 120,
    right: WATERBALL_DEFAULT_INSET,
    bottom: WATERBALL_DEFAULT_INSET,
    eyeColor: 'white',
    showEyes: true,
  }, {
    setSource: (source) => { current = source },
    onChange: () => {
      if (!section().enabled) mood = 'idle'
      syncRoutes()
    },
  })
  syncRoutes()
}
