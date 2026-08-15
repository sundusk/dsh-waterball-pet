/**
 * dsh-waterball browser half — renders the floating water ball and drives it
 * from the host's same-origin `GET /api/waterball/status` endpoint, gated by
 * the `waterball` settings namespace `enabled` master switch. It also seats a
 * plugin configuration card directly in the settings plugin section, on the
 * same level as the built-in Shell / Agent loop / Web search cards and the
 * "Web UI 插件" family group.
 * @module @linxin666/dsh-waterball/client
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
/** Required services. */
export declare const inject: string[];
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
        'settings.plugin.item': {
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
/** Owner share of a plugin card (the settings section supplies nothing). */
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
 * settings plugin section.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
