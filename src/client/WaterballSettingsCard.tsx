/**
 * The water ball settings card: the enable master switch and the rendered
 * size, bound to the `waterball` settings namespace the host plugin registers.
 */

import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { SettingsScope, SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'
import { PluginSettingsCard, ValueField, BooleanField } from './PluginSettingsCard.tsx'
import { CardForm, booleanField, numberField, type CardActions, type CardShell, type FieldState as CardFieldState } from './settings-form.ts'

/** The water ball's settings fields this card edits. */
export interface WaterballSettings {
  /** Master switch for the plugin. */
  enabled?: boolean
  /** Hide the ball in the web UI only; status route stays live. */
  hidden?: boolean
  /** Rendered SVG width in px. */
  size?: number
  /** Horizontal inset from the viewport right edge, px. */
  right?: number
  /** Vertical inset from the viewport bottom edge, px. */
  bottom?: number
}

/** What the water ball settings card renders. */
export interface WaterballSettingsCardState extends CardShell {
  /** Plugin master switch. */
  enabled: CardFieldState
  /** Hide in web UI only. */
  hidden: CardFieldState
  /** Rendered size. */
  size: CardFieldState
  /** Right inset. */
  right: CardFieldState
  /** Bottom inset. */
  bottom: CardFieldState
}

/** The registration-side face the card's slot entry injects. */
export interface WaterballSettingsCardFace extends CardActions {
  hooks: {
    /** Card snapshot bound by the renderer as useWaterballSettingsCard. */
    waterballSettingsCard: SnapshotStore<WaterballSettingsCardState>
  }
}

/** Bridges the `waterball` scope onto the card's staged form. */
export class WaterballSettingsCardController {
  private readonly form: CardForm<WaterballSettings>
  private readonly store: SnapshotStore<WaterballSettingsCardState>

  /** @param scope - the bound settings scope for the `waterball` namespace. */
  constructor(scope: SettingsScope<WaterballSettings>) {
    this.form = new CardForm(scope, [booleanField('enabled'), booleanField('hidden'), numberField('size'), numberField('right'), numberField('bottom')])
    this.store = this.form.bind(() => this.projection())
  }

  private projection(): WaterballSettingsCardState {
    return {
      ...this.form.shell(),
      enabled: this.form.field('enabled'),
      hidden: this.form.field('hidden'),
      size: this.form.field('size'),
      right: this.form.field('right'),
      bottom: this.form.field('bottom'),
    }
  }

  /**
   * Build the face the card's slot registration injects.
   * @returns the card's snapshot and its form actions.
   */
  inject(): WaterballSettingsCardFace {
    return { hooks: { waterballSettingsCard: this.store }, ...this.form.actions() }
  }
}

/** Props the renderer binds for the water ball settings card. */
export type WaterballSettingsCardProps =
  PropsRuntime<'web-ui.plugin.item'>
  & PropsLocale<'waterball'>
  & InjectFace<WaterballSettingsCardFace>

/**
 * Render the water ball settings card.
 * @param props - locale copy, the card snapshot, and its form actions.
 * @returns the card.
 */
export function WaterballSettingsCard(props: WaterballSettingsCardProps) {
  const { t } = props
  const state = props.useWaterballSettingsCard(snapshot => snapshot)
  const disabled = !state.writable
  const fieldProps = {
    overriddenLabel: t('settings.overridden'),
    resetLabel: t('settings.reset'),
    invalidLabel: t('settings.invalidNumber'),
    disabled,
  }
  return (
    <PluginSettingsCard
      t={t}
      titleKey="settings.title"
      descriptionKey="settings.description"
      state={state}
      onSave={props.save}
      onDiscard={props.discard}
    >
      <BooleanField
        id="settings-waterball-enabled"
        label={t('settings.enabled')}
        hint={t('settings.enabledHint')}
        inheritLabel={t('settings.inherit')}
        onLabel={t('settings.on')}
        offLabel={t('settings.off')}
        {...fieldProps}
        {...state.enabled}
        onEdit={(text) => { props.edit('enabled', text) }}
        onReset={() => { props.resetField('enabled') }}
      />
      <BooleanField
        id="settings-waterball-hidden"
        label={t('settings.hidden')}
        hint={t('settings.hiddenHint')}
        inheritLabel={t('settings.inherit')}
        onLabel={t('settings.on')}
        offLabel={t('settings.off')}
        {...fieldProps}
        {...state.hidden}
        onEdit={(text) => { props.edit('hidden', text) }}
        onReset={() => { props.resetField('hidden') }}
      />
      <ValueField
        id="settings-waterball-size"
        label={t('settings.size')}
        hint={t('settings.sizeHint')}
        numeric
        {...fieldProps}
        {...state.size}
        onEdit={(text) => { props.edit('size', text) }}
        onReset={() => { props.resetField('size') }}
      />
      <ValueField
        id="settings-waterball-right"
        label={t('settings.right')}
        hint={t('settings.rightHint')}
        numeric
        {...fieldProps}
        {...state.right}
        onEdit={(text) => { props.edit('right', text) }}
        onReset={() => { props.resetField('right') }}
      />
      <ValueField
        id="settings-waterball-bottom"
        label={t('settings.bottom')}
        hint={t('settings.bottomHint')}
        numeric
        {...fieldProps}
        {...state.bottom}
        onEdit={(text) => { props.edit('bottom', text) }}
        onReset={() => { props.resetField('bottom') }}
      />
    </PluginSettingsCard>
  )
}
