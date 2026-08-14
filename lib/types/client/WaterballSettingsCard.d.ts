/**
 * The water ball settings card: the enable master switch and the rendered
 * size, bound to the `waterball` settings namespace the host plugin registers.
 */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { SettingsScope, SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import { type CardActions, type CardShell, type FieldState as CardFieldState } from './settings-form.ts';
/** The water ball's settings fields this card edits. */
export interface WaterballSettings {
    /** Master switch for the plugin. */
    enabled?: boolean;
    /** Hide the ball in the web UI only; status route stays live. */
    hidden?: boolean;
    /** Rendered SVG width in px. */
    size?: number;
    /** Horizontal inset from the viewport right edge, px. */
    right?: number;
    /** Vertical inset from the viewport bottom edge, px. */
    bottom?: number;
}
/** What the water ball settings card renders. */
export interface WaterballSettingsCardState extends CardShell {
    /** Plugin master switch. */
    enabled: CardFieldState;
    /** Hide in web UI only. */
    hidden: CardFieldState;
    /** Rendered size. */
    size: CardFieldState;
    /** Right inset. */
    right: CardFieldState;
    /** Bottom inset. */
    bottom: CardFieldState;
}
/** The registration-side face the card's slot entry injects. */
export interface WaterballSettingsCardFace extends CardActions {
    hooks: {
        /** Card snapshot bound by the renderer as useWaterballSettingsCard. */
        waterballSettingsCard: SnapshotStore<WaterballSettingsCardState>;
    };
}
/** Bridges the `waterball` scope onto the card's staged form. */
export declare class WaterballSettingsCardController {
    private readonly form;
    private readonly store;
    /** @param scope - the bound settings scope for the `waterball` namespace. */
    constructor(scope: SettingsScope<WaterballSettings>);
    private projection;
    /**
     * Build the face the card's slot registration injects.
     * @returns the card's snapshot and its form actions.
     */
    inject(): WaterballSettingsCardFace;
}
/** Props the renderer binds for the water ball settings card. */
export type WaterballSettingsCardProps = PropsRuntime<'web-ui.plugin.item'> & PropsLocale<'waterball'> & InjectFace<WaterballSettingsCardFace>;
/**
 * Render the water ball settings card.
 * @param props - locale copy, the card snapshot, and its form actions.
 * @returns the card.
 */
export declare function WaterballSettingsCard(props: WaterballSettingsCardProps): import("react").JSX.Element;
