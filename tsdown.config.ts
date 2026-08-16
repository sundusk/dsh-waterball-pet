/**
 * Standalone tsdown config for the dsh-moodball-web plugin.
 *
 * Uses the standalone shared client-bundle preset (shared/tsdown.client.ts):
 * the node half builds from src/index.ts (ESM, cordis + dsh-settings external),
 * the browser half builds the closure-factory artifact from
 * src/client/index.ts, and CSS modules inline with hashed class maps.
 */
import { clientBundle } from './shared/tsdown.client.ts'

export default clientBundle('@linxin666/dsh-moodball-web', ['src/index.ts'], {
  libExternal: ['@deepseek-ai/dsh-settings'],
})
