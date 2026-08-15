/**
 * The floating water ball. Renders a fixed-position SVG ball whose inner
 * radial-gradient color follows the agent state while the white outer edge
 * stays constant, softened by a drop shadow and a static ground contact
 * shadow. The animation state is driven by a poll of /api/waterball/status.
 * Click to wave; drag to reposition (the final position is persisted back into
 * the `waterball` settings namespace).
 * @module @linxin666/dsh-waterball/client/WaterballPet
 */

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactElement, type ReactPortal } from 'react'
import { createPortal } from 'react-dom'
import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { NS } from './locales.ts'
import css from './waterball.module.css'

/** The pet's mood: one of the CSS state classes. */
export type WaterballMood = 'idle' | 'waiting' | 'jumping' | 'done' | 'failed' | 'stopped' | 'waving' | 'authorizing' | 'questioning'

/** The host status payload the browser polls. */
interface StatusView {
  ok: boolean
  mood: WaterballMood
  enabled?: boolean
  size?: number
  right?: number
  bottom?: number
  eyeColor?: 'white' | 'black'
  showEyes?: boolean
}

const POLL_MS = 700
const DEFAULT_SIZE = 120
const DEFAULT_INSET = 16
const WAVE_MS = 1600
const DRAG_MAX = 4000

function clamp(value: number, max: number): number {
  return Math.max(0, Math.min(max, value))
}

/** Per-mood inner gradient colors; the white outer edge never changes. */
const MOOD_COLORS: Record<WaterballMood, { center: string; mid: string }> = {
  idle: { center: '#4FB3F7', mid: '#8FD4FF' },
  authorizing: { center: '#FACC15', mid: '#FDE68A' },
  questioning: { center: '#EC4899', mid: '#F9A8D4' },
  waiting: { center: '#34D399', mid: '#A7F3D0' },
  jumping: { center: '#A855F7', mid: '#D8B4FE' },
  done: { center: '#22D3EE', mid: '#A5F3FC' },
  failed: { center: '#F87171', mid: '#FCA5A5' },
  stopped: { center: '#111827', mid: '#6B7280' },
  waving: { center: '#FB923C', mid: '#FDBA74' },
}

/** The ball body: state-colored inner radial gradient + white outer edge + optional colored eyes. */
function WaterballSvg({ size, mood, eyeColor, showEyes }: { size: number; mood: WaterballMood; eyeColor: 'white' | 'black'; showEyes: boolean }): ReactElement {
  const { center, mid } = MOOD_COLORS[mood]
  const eyeFill = eyeColor === 'black' ? '#1F2937' : '#FFFFFF'
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width={size} height={size} style={{ display: 'block', filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.20))' }}>
      <defs>
        <radialGradient id="dswb-ball-grad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={center} />
          <stop offset="55%" stopColor={mid} />
          <stop offset="100%" stopColor="#FFFFFF" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="52" fill="url(#dswb-ball-grad)" />
      {showEyes
        ? (
          <g className={css.eye}>
            <ellipse cx="46" cy="60" rx="6" ry="11" fill={eyeFill} />
            <ellipse cx="74" cy="60" rx="6" ry="11" fill={eyeFill} />
          </g>
        )
        : null}
    </svg>
  )
}

/** Injected actions handed to the dock entry component. */
export interface WaterballDockFace {
  /** Persist a drag position into the `waterball` settings namespace. */
  persistPosition: (right: number, bottom: number) => void
}

/** The floating water ball: body only, driven by the status poll. */
function WaterballPet({ persistPosition }: WaterballDockFace) {
  const [status, setStatus] = useState<StatusView | null>(null)
  const [wave, setWave] = useState(false)
  const [dragPos, setDragPos] = useState<{ right: number; bottom: number } | null>(null)
  const dragRef = useRef<{ startX: number; startY: number; right: number; bottom: number } | null>(null)
  const draggedRef = useRef(false)

  useEffect(() => {
    let alive = true
    const poll = (): void => {
      fetch('/api/waterball/status')
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
        .then((value: StatusView) => {
          if (alive) setStatus(value)
        })
        .catch(() => {
          // Transport error: keep the last known mood.
        })
    }
    poll()
    const timer = window.setInterval(poll, POLL_MS)
    return () => {
      alive = false
      window.clearInterval(timer)
    }
  }, [])

  const mood: WaterballMood = wave
    ? 'waving'
    : status?.mood === 'failed' ? 'failed'
    : status?.mood === 'stopped' ? 'stopped'
    : status?.mood === 'done' ? 'done'
    : status?.mood === 'jumping' ? 'jumping'
    : status?.mood === 'waiting' ? 'waiting'
    : status?.mood === 'authorizing' ? 'authorizing'
    : status?.mood === 'questioning' ? 'questioning'
    : 'idle'

  const size = typeof status?.size === 'number' ? status.size : DEFAULT_SIZE
  const eyeColor: 'white' | 'black' = status?.eyeColor === 'black' ? 'black' : 'white'
  const showEyes = status?.showEyes ?? true
  const base = { right: status?.right ?? DEFAULT_INSET, bottom: status?.bottom ?? DEFAULT_INSET }
  const pos = dragPos ?? base

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>): void => {
    e.preventDefault()
    if (e.target instanceof Element && typeof e.target.setPointerCapture === 'function') {
      e.target.setPointerCapture(e.pointerId)
    }
    const current = dragPos ?? base
    dragRef.current = { startX: e.clientX, startY: e.clientY, right: current.right, bottom: current.bottom }
    draggedRef.current = false
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>): void => {
    const drag = dragRef.current
    if (drag === null) return
    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) draggedRef.current = true
    setDragPos({ right: clamp(drag.right - dx, DRAG_MAX), bottom: clamp(drag.bottom - dy, DRAG_MAX) })
  }
  const onPointerUp = (): void => {
    if (dragRef.current === null) return
    dragRef.current = null
    if (dragPos !== null) persistPosition(dragPos.right, dragPos.bottom)
  }
  const onClick = (): void => {
    if (draggedRef.current) return
    setWave(true)
    window.setTimeout(() => setWave(false), WAVE_MS)
  }

  return (
    <div className={css.float} style={{ right: pos.right, bottom: pos.bottom }}>
      <div
        className={`${css.ball} ${css['state-' + mood]}`}
        role="button"
        aria-label="water ball pet"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={onClick}
      >
        <WaterballSvg size={size} mood={mood} eyeColor={eyeColor} showEyes={showEyes} />
      </div>
      <div className={css.contact} style={{ width: size * 0.62, height: size * 0.13 }} />
    </div>
  )
}

/** Composed props of the dock entry (runtime + locale + injected). */
export type WaterballDockEntryProps =
  PropsLocale<typeof NS>
  & InjectFace<WaterballDockFace>

/**
 * Dock anchor inside `conversation.input.selector.context`: the selector row
 * mounts in every conversation phase, so the floating pet stays on screen on
 * the new-conversation screen too. The pet portals itself onto document.body.
 */
export function WaterballDockEntry(props: WaterballDockEntryProps): ReactPortal {
  return createPortal(<WaterballPet persistPosition={props.persistPosition} />, document.body)
}
