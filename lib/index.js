import { installSettingsSection, settingsNamespace } from "@deepseek-ai/dsh-settings";
import z from "schemastery";
//#region src/index.ts
/** Stable cordis plugin name (matches cordis.patch.yml insert id). */
const name = "waterball";
/** Services required before the water ball can mount its surfaces. */
const inject = ["webServer"];
/** Settings namespace of the water ball capability (the browser half spells the same value). */
const WATERBALL_SETTINGS_NAMESPACE = "waterball";
/** Bounds of the size field, in px (the rendered SVG width). */
const WATERBALL_SIZE_MIN = 64;
const WATERBALL_SIZE_MAX = 400;
/** Bounds of the right/bottom viewport insets, in px. */
const WATERBALL_INSET_MAX = 2e3;
/** Default insets from the viewport bottom-right corner, in px. */
const WATERBALL_DEFAULT_INSET = 16;
/** Settings section schema. */
const WATERBALL_SETTINGS_SCHEMA = z.object({
	enabled: z.boolean().default(true),
	hidden: z.boolean().default(true),
	size: z.number().step(1).min(64).max(400).default(120),
	right: z.number().step(1).min(0).max(WATERBALL_INSET_MAX).default(16),
	bottom: z.number().step(1).min(0).max(WATERBALL_INSET_MAX).default(16),
	eyeColor: z.string().default("white"),
	showEyes: z.boolean().default(true)
});
/** Write one JSON response. */
function json(res, status, body) {
	res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
	res.end(JSON.stringify(body));
}
/**
* Register the water ball service surfaces and the `waterball` settings
* namespace. The status route is registered only while the plugin is enabled;
* toggling the setting off removes it until re-enabled.
* @param ctx - host root context.
*/
function apply(ctx) {
	let mood = "idle";
	let holdUntil = 0;
	let questionActive = false;
	let current = () => ({
		enabled: true,
		size: 120
	});
	const setTransient = (next, ms) => {
		mood = next;
		holdUntil = Date.now() + ms;
		setTimeout(() => {
			if (mood === next) mood = "idle";
		}, ms);
	};
	const section = () => {
		const s = current();
		const clampInset = (value) => Math.round(Math.min(WATERBALL_INSET_MAX, Math.max(0, value)));
		return {
			enabled: s.enabled ?? true,
			hidden: s.hidden ?? true,
			size: Math.round(Math.min(400, Math.max(64, s.size ?? 120))),
			right: clampInset(s.right ?? 16),
			bottom: clampInset(s.bottom ?? 16),
			eyeColor: s.eyeColor === "black" ? "black" : "white",
			showEyes: s.showEyes ?? true
		};
	};
	ctx.on("session/event", (_session, event) => {
		if (!section().enabled) return;
		if (event.type === "turn/start" || event.type === "step/start" || event.type === "assistant/chunk") {
			mood = "waiting";
			holdUntil = 0;
		} else if (event.type === "tool/call") {
			if ((event.data ?? {}).name === "ask_user_question") {
				questionActive = true;
				mood = "questioning";
				holdUntil = 0;
			} else {
				mood = "jumping";
				holdUntil = 0;
			}
		} else if (event.type === "tool/result") {
			const result = event.data ?? {};
			if (questionActive) {
				questionActive = false;
				if (result.error !== void 0) setTransient("stopped", 1500);
				else {
					mood = "waiting";
					holdUntil = 0;
				}
			} else {
				mood = "waiting";
				holdUntil = 0;
			}
		} else if (event.type === "approval/asked") {
			mood = "authorizing";
			holdUntil = 0;
		} else if (event.type === "approval/decided") {
			const payload = event.data ?? {};
			if (payload.result === "allowed-once") {
				mood = "waiting";
				holdUntil = 0;
			} else if (payload.result === "rejected" || payload.result === "cancelled" || payload.result === "unavailable") setTransient("failed", 3e3);
		} else if (event.type === "activity/status") {
			const payload = event.data ?? {};
			if (payload.phase === void 0) return;
			switch (payload.phase) {
				case "waiting":
				case "thinking":
					mood = "waiting";
					holdUntil = 0;
					break;
				case "tool":
					if (questionActive) return;
					mood = "jumping";
					holdUntil = 0;
					break;
				case "done":
					setTransient("done", 2500);
					break;
				case "idle":
					if (Date.now() < holdUntil) return;
					mood = "idle";
			}
		} else if (event.type === "turn/end") {
			questionActive = false;
			const kind = (event.data ?? {}).reason?.kind;
			if (kind === "error") setTransient("failed", 3e3);
			else if (kind === "completed") setTransient("done", 2500);
			else if (kind !== void 0) setTransient("stopped", 3e3);
		}
	});
	const statusRoute = {
		kind: "exact",
		path: "/api/waterball/status",
		handler: (req, res) => {
			if (req.method !== "GET") {
				json(res, 405, {
					ok: false,
					error: "method-not-allowed"
				});
				return;
			}
			const s = section();
			json(res, 200, {
				ok: true,
				mood,
				enabled: s.enabled,
				hidden: s.hidden,
				size: s.size,
				right: s.right,
				bottom: s.bottom,
				eyeColor: s.eyeColor,
				showEyes: s.showEyes
			});
		}
	};
	let disposeRoute;
	const syncRoutes = () => {
		if (disposeRoute === void 0 && section().enabled) disposeRoute = ctx.effect(() => ctx.webServer.register(statusRoute), "waterball: status route");
		else if (disposeRoute !== void 0 && !section().enabled) {
			disposeRoute();
			disposeRoute = void 0;
		}
	};
	installSettingsSection(ctx, settingsNamespace(WATERBALL_SETTINGS_NAMESPACE), WATERBALL_SETTINGS_SCHEMA, {
		enabled: true,
		hidden: true,
		size: 120,
		right: 16,
		bottom: 16,
		eyeColor: "white",
		showEyes: true
	}, {
		setSource: (source) => {
			current = source;
		},
		onChange: () => {
			if (!section().enabled) mood = "idle";
			syncRoutes();
		}
	});
	syncRoutes();
}
//#endregion
export { WATERBALL_DEFAULT_INSET, WATERBALL_INSET_MAX, WATERBALL_SETTINGS_NAMESPACE, WATERBALL_SETTINGS_SCHEMA, WATERBALL_SIZE_MAX, WATERBALL_SIZE_MIN, apply, inject, name };
