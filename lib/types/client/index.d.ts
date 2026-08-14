/**
 * dsh-waterball browser half — renders the floating water ball and drives it
 * from the host's same-origin `GET /api/waterball/status` endpoint, gated by
 * the `waterball` settings namespace `enabled` master switch. It also seats a
 * plugin configuration card in the Web UI plugin group (settings page).
 * @module @linxin666/dsh-waterball/client
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
/** Required services. */
export declare const inject: string[];
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface SlotMap {
        /**
         * The child slot the Web UI plugin group declares; this card registers
         * into the group instead of the top-level `settings.plugin.item` list.
         */
        'web-ui.plugin.item': {
            kind: 'list';
            scope: 'root';
            owner: SettingsPluginItemOwnerProps;
        };
        /** Frame-wide overlay that is rendered on both the new-session and active-session pages. */
        'shell.overlay': {
            kind: 'list';
            scope: 'root';
            owner: ShellOverlayOwnerProps;
        };
    }
}
/** Owner share of a plugin card (the group card supplies nothing). */
export interface SettingsPluginItemOwnerProps {
    /** Marker field: card owner props are intentionally empty. */
    children?: never;
}
/** Owner share of the frame-wide overlay (the layout supplies no props). */
export interface ShellOverlayOwnerProps {
    /** Marker field: overlay owner props are intentionally empty. */
    children?: never;
}
/**
 * Client plugin body: register dictionaries, mount the water ball and its
 * poll loop while the plugin is enabled, and seat the settings card in the
 * Web UI plugin group.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
