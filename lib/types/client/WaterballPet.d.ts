/**
 * The floating water ball. Renders a fixed-position SVG ball whose inner
 * radial-gradient color follows the agent state while the white outer edge
 * stays constant, softened by a drop shadow and a static ground contact
 * shadow. The animation state is driven by a poll of /api/waterball/status.
 * Click to wave; drag to reposition (the final position is persisted back into
 * the `waterball` settings namespace).
 * @module @linxin666/dsh-waterball/client/WaterballPet
 */
import { type ReactPortal } from 'react';
import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import { NS } from './locales.ts';
/** The pet's mood: one of the CSS state classes. */
export type WaterballMood = 'idle' | 'waiting' | 'jumping' | 'done' | 'failed' | 'stopped' | 'waving' | 'authorizing' | 'questioning';
/** Injected actions handed to the dock entry component. */
export interface WaterballDockFace {
    /** Persist a drag position into the `waterball` settings namespace. */
    persistPosition: (right: number, bottom: number) => void;
}
/** Composed props of the dock entry (runtime + locale + injected). */
export type WaterballDockEntryProps = PropsLocale<typeof NS> & InjectFace<WaterballDockFace>;
/**
 * Dock anchor inside `conversation.input.selector.context`: the selector row
 * mounts in every conversation phase, so the floating pet stays on screen on
 * the new-conversation screen too. The pet portals itself onto document.body.
 */
export declare function WaterballDockEntry(props: WaterballDockEntryProps): ReactPortal;
