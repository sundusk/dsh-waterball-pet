/**
 * dsh-waterball host half — tracks agent activity and serves the current mood
 * over a same-origin JSON route, plus registers the `waterball` settings
 * namespace (`enabled` master switch + `size`). Install via
 * `dsh plugin --profile web add link:<repo>/packages/dsh-waterball`.
 * @module @linxin666/dsh-waterball
 */
import { Context } from '@deepseek-ai/cordis';
import z from 'schemastery';
/** Stable cordis plugin name (matches cordis.patch.yml insert id). */
export declare const name = "waterball";
/** Services required before the water ball can mount its surfaces. */
export declare const inject: string[];
/** Settings namespace of the water ball capability (the browser half spells the same value). */
export declare const WATERBALL_SETTINGS_NAMESPACE = "waterball";
/** Bounds of the size field, in px (the rendered SVG width). */
export declare const WATERBALL_SIZE_MIN = 64;
export declare const WATERBALL_SIZE_MAX = 400;
/** Bounds of the right/bottom viewport insets, in px. */
export declare const WATERBALL_INSET_MAX = 2000;
/** Default insets from the viewport bottom-right corner, in px. */
export declare const WATERBALL_DEFAULT_INSET = 16;
/** The water ball's settings-namespace section. */
export interface WaterballSettingsSection {
    /** Master switch for the plugin (browser half + host routes). */
    enabled?: boolean;
    /** Hide the ball in the web UI only; the status route and mood tracking stay live. */
    hidden?: boolean;
    /** Rendered SVG width in px. */
    size?: number;
    /** Horizontal inset from the viewport right edge, px. */
    right?: number;
    /** Vertical inset from the viewport bottom edge, px. */
    bottom?: number;
    /** Eye fill color, normalized to 'white' | 'black' by the status route. */
    eyeColor?: string;
    /** Whether the eyes are drawn at all. */
    showEyes?: boolean;
}
/** The mood the browser half renders (one of the CSS state classes). */
export type WaterballMood = 'idle' | 'waiting' | 'jumping' | 'done' | 'failed' | 'stopped' | 'waving' | 'authorizing' | 'questioning';
/** Settings section schema. */
export declare const WATERBALL_SETTINGS_SCHEMA: z<Schemastery.ObjectS<{
    enabled: z<boolean, boolean>;
    hidden: z<boolean, boolean>;
    size: z<number, number>;
    right: z<number, number>;
    bottom: z<number, number>;
    eyeColor: z<string, string>;
    showEyes: z<boolean, boolean>;
}>, Schemastery.ObjectT<{
    enabled: z<boolean, boolean>;
    hidden: z<boolean, boolean>;
    size: z<number, number>;
    right: z<number, number>;
    bottom: z<number, number>;
    eyeColor: z<string, string>;
    showEyes: z<boolean, boolean>;
}>>;
/**
 * Register the water ball service surfaces and the `waterball` settings
 * namespace. The status route is registered only while the plugin is enabled;
 * toggling the setting off removes it until re-enabled.
 * @param ctx - host root context.
 */
export declare function apply(ctx: Context): void;
