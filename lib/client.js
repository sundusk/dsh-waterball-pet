window.__ModuleLoader__.load({
	id: "@linxin666/dsh-waterball",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_dom = require("react-dom");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_runtime_client = require("@deepseek-ai/dsh-client-runtime/client");
		//#region \0dsh-css:waterball.module.css.mjs
		const css$1 = ".m0Tjba_float{pointer-events:auto;z-index:2147483000;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;touch-action:none;position:fixed}.m0Tjba_ball{z-index:1;cursor:grab;transform-origin:50% 85%;will-change:transform;line-height:0;position:relative}.m0Tjba_ball:active{cursor:grabbing}.m0Tjba_contact{pointer-events:none;z-index:0;background:radial-gradient(#00000029 0%,#0000000a 55%,#0000 78%);border-radius:50%;margin:3px auto 0}@keyframes m0Tjba_dswb-bob{0%,to{transform:translateY(0)scale(1)}50%{transform:translateY(-6px)scale(1.03)}}@keyframes m0Tjba_dswb-tilt{0%,to{transform:rotate(0)}25%{transform:rotate(-4deg)}75%{transform:rotate(4deg)}}@keyframes m0Tjba_dswb-hop{0%,to{transform:translateY(0)}40%,60%{transform:translateY(-13px)}}@keyframes m0Tjba_dswb-rock{0%,to{transform:rotate(0)}25%{transform:rotate(-8deg)}75%{transform:rotate(8deg)}}@keyframes m0Tjba_dswb-droop{0%,to{transform:translateY(0)rotate(0)}50%{transform:translateY(5px)rotate(-7deg)}}@keyframes m0Tjba_dswb-cheer{0%,to{transform:translateY(0)rotate(0)}25%{transform:translateY(-10px)rotate(-4deg)}50%{transform:translateY(-4px)rotate(4deg)}75%{transform:translateY(-8px)rotate(-2deg)}}@keyframes m0Tjba_dswb-stopped{0%,to{transform:translateY(0)scale(1)}50%{transform:translateY(3px)scale(.97)}}.m0Tjba_state-idle{animation:3.2s ease-in-out infinite m0Tjba_dswb-bob}.m0Tjba_state-authorizing{animation:2.2s ease-in-out infinite m0Tjba_dswb-bob}.m0Tjba_state-questioning{animation:1.8s ease-in-out infinite m0Tjba_dswb-tilt}.m0Tjba_state-waiting{animation:2.6s ease-in-out infinite m0Tjba_dswb-tilt}.m0Tjba_state-jumping{animation:.9s ease-in-out infinite m0Tjba_dswb-hop}.m0Tjba_state-waving{animation:.9s ease-in-out infinite m0Tjba_dswb-rock}.m0Tjba_state-failed{animation:4s ease-in-out infinite m0Tjba_dswb-droop}.m0Tjba_state-done{animation:1.2s ease-in-out infinite m0Tjba_dswb-cheer}.m0Tjba_state-stopped{animation:3s ease-in-out infinite m0Tjba_dswb-stopped}@keyframes m0Tjba_dswb-blink{0%,93%,to{transform:scaleY(1)}95%{transform:scaleY(.08)}97%{transform:scaleY(1)}}.m0Tjba_eye{transform-origin:50%;transform-box:fill-box;animation:4.5s infinite m0Tjba_dswb-blink}";
		const tagId$1 = "@linxin666/dsh-waterball/waterball.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@linxin666/dsh-waterball";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var _dsh_css_waterball_module_css_default = {
			"ball": "m0Tjba_ball",
			"contact": "m0Tjba_contact",
			"dswb-blink": "m0Tjba_dswb-blink",
			"dswb-bob": "m0Tjba_dswb-bob",
			"dswb-cheer": "m0Tjba_dswb-cheer",
			"dswb-droop": "m0Tjba_dswb-droop",
			"dswb-hop": "m0Tjba_dswb-hop",
			"dswb-rock": "m0Tjba_dswb-rock",
			"dswb-stopped": "m0Tjba_dswb-stopped",
			"dswb-tilt": "m0Tjba_dswb-tilt",
			"eye": "m0Tjba_eye",
			"float": "m0Tjba_float",
			"state-authorizing": "m0Tjba_state-authorizing",
			"state-done": "m0Tjba_state-done",
			"state-failed": "m0Tjba_state-failed",
			"state-idle": "m0Tjba_state-idle",
			"state-jumping": "m0Tjba_state-jumping",
			"state-questioning": "m0Tjba_state-questioning",
			"state-stopped": "m0Tjba_state-stopped",
			"state-waiting": "m0Tjba_state-waiting",
			"state-waving": "m0Tjba_state-waving"
		};
		//#endregion
		//#region src/client/WaterballPet.tsx
		/**
		* The floating water ball. Renders a fixed-position SVG ball whose inner
		* radial-gradient color follows the agent state while the white outer edge
		* stays constant, softened by a drop shadow and a static ground contact
		* shadow. The animation state is driven by a poll of /api/waterball/status.
		* Click to wave; drag to reposition (the final position is persisted back into
		* the `waterball` settings namespace).
		* @module @linxin666/dsh-waterball/client/WaterballPet
		*/
		const POLL_MS = 700;
		const DEFAULT_SIZE = 120;
		const DEFAULT_INSET = 16;
		const WAVE_MS = 1600;
		const DRAG_MAX = 4e3;
		function clamp(value, max) {
			return Math.max(0, Math.min(max, value));
		}
		/** Per-mood inner gradient colors; the white outer edge never changes. */
		const MOOD_COLORS = {
			idle: {
				center: "#4FB3F7",
				mid: "#8FD4FF"
			},
			authorizing: {
				center: "#FACC15",
				mid: "#FDE68A"
			},
			questioning: {
				center: "#EC4899",
				mid: "#F9A8D4"
			},
			waiting: {
				center: "#34D399",
				mid: "#A7F3D0"
			},
			jumping: {
				center: "#A855F7",
				mid: "#D8B4FE"
			},
			done: {
				center: "#22D3EE",
				mid: "#A5F3FC"
			},
			failed: {
				center: "#F87171",
				mid: "#FCA5A5"
			},
			stopped: {
				center: "#111827",
				mid: "#6B7280"
			},
			waving: {
				center: "#FB923C",
				mid: "#FDBA74"
			}
		};
		/** The ball body: state-colored inner radial gradient + white outer edge + optional colored eyes. */
		function WaterballSvg({ size, mood, eyeColor, showEyes }) {
			const { center, mid } = MOOD_COLORS[mood];
			const eyeFill = eyeColor === "black" ? "#1F2937" : "#FFFFFF";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "0 0 120 120",
				width: size,
				height: size,
				style: {
					display: "block",
					filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.20))"
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("radialGradient", {
						id: "dswb-ball-grad",
						cx: "0.5",
						cy: "0.5",
						r: "0.5",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: center
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
								offset: "55%",
								stopColor: mid
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: "#FFFFFF"
							})
						]
					}) }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						cx: "60",
						cy: "60",
						r: "52",
						fill: "url(#dswb-ball-grad)"
					}),
					showEyes ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
						className: _dsh_css_waterball_module_css_default.eye,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
							cx: "46",
							cy: "60",
							rx: "6",
							ry: "11",
							fill: eyeFill
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
							cx: "74",
							cy: "60",
							rx: "6",
							ry: "11",
							fill: eyeFill
						})]
					}) : null
				]
			});
		}
		/** The floating water ball: body only, driven by the status poll. */
		function WaterballPet({ persistPosition }) {
			const [status, setStatus] = (0, react.useState)(null);
			const [wave, setWave] = (0, react.useState)(false);
			const [dragPos, setDragPos] = (0, react.useState)(null);
			const dragRef = (0, react.useRef)(null);
			const draggedRef = (0, react.useRef)(false);
			(0, react.useEffect)(() => {
				let alive = true;
				const poll = () => {
					fetch("/api/waterball/status").then((res) => res.ok ? res.json() : Promise.reject(new Error(String(res.status)))).then((value) => {
						if (alive) setStatus(value);
					}).catch(() => {});
				};
				poll();
				const timer = window.setInterval(poll, POLL_MS);
				return () => {
					alive = false;
					window.clearInterval(timer);
				};
			}, []);
			const mood = wave ? "waving" : status?.mood === "failed" ? "failed" : status?.mood === "stopped" ? "stopped" : status?.mood === "done" ? "done" : status?.mood === "jumping" ? "jumping" : status?.mood === "waiting" ? "waiting" : status?.mood === "authorizing" ? "authorizing" : status?.mood === "questioning" ? "questioning" : "idle";
			const size = typeof status?.size === "number" ? status.size : DEFAULT_SIZE;
			const eyeColor = status?.eyeColor === "black" ? "black" : "white";
			const showEyes = status?.showEyes ?? true;
			const base = {
				right: status?.right ?? DEFAULT_INSET,
				bottom: status?.bottom ?? DEFAULT_INSET
			};
			const pos = dragPos ?? base;
			const onPointerDown = (e) => {
				e.preventDefault();
				if (e.target instanceof Element && typeof e.target.setPointerCapture === "function") e.target.setPointerCapture(e.pointerId);
				const current = dragPos ?? base;
				dragRef.current = {
					startX: e.clientX,
					startY: e.clientY,
					right: current.right,
					bottom: current.bottom
				};
				draggedRef.current = false;
			};
			const onPointerMove = (e) => {
				const drag = dragRef.current;
				if (drag === null) return;
				const dx = e.clientX - drag.startX;
				const dy = e.clientY - drag.startY;
				if (Math.abs(dx) > 4 || Math.abs(dy) > 4) draggedRef.current = true;
				setDragPos({
					right: clamp(drag.right - dx, DRAG_MAX),
					bottom: clamp(drag.bottom - dy, DRAG_MAX)
				});
			};
			const onPointerUp = () => {
				if (dragRef.current === null) return;
				dragRef.current = null;
				if (dragPos !== null) persistPosition(dragPos.right, dragPos.bottom);
			};
			const onClick = () => {
				if (draggedRef.current) return;
				setWave(true);
				window.setTimeout(() => setWave(false), WAVE_MS);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: _dsh_css_waterball_module_css_default.float,
				style: {
					right: pos.right,
					bottom: pos.bottom
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: `${_dsh_css_waterball_module_css_default.ball} ${_dsh_css_waterball_module_css_default["state-" + mood]}`,
					role: "button",
					"aria-label": "water ball pet",
					onPointerDown,
					onPointerMove,
					onPointerUp,
					onClick,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(WaterballSvg, {
						size,
						mood,
						eyeColor,
						showEyes
					})
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: _dsh_css_waterball_module_css_default.contact,
					style: {
						width: size * .62,
						height: size * .13
					}
				})]
			});
		}
		/**
		* Dock anchor inside `shell.overlay`: the frame-wide overlay is rendered on
		* both the new-conversation and active-session pages, so the floating pet
		* stays on screen everywhere. The pet portals itself onto document.body.
		*/
		function WaterballDockEntry(props) {
			return (0, react_dom.createPortal)(/* @__PURE__ */ (0, react_jsx_runtime.jsx)(WaterballPet, { persistPosition: props.persistPosition }), document.body);
		}
		//#endregion
		//#region \0dsh-css:settings-card.module.css.mjs
		const css = ".KhFzGG_card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:8px;list-style:none;transition:border-color .16s,background .16s;overflow:hidden}.KhFzGG_cardOpen{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-label-dimmed)}.KhFzGG_header{cursor:pointer;text-align:left;width:100%;font:inherit;background:0 0;border:0;align-items:center;gap:8px;padding:10px 14px;transition:background .12s;display:flex}.KhFzGG_header:hover{background:var(--dsw-alias-interactive-bg-hover)}.KhFzGG_header:active{background:var(--dsw-alias-interactive-bg-hover-solid)}.KhFzGG_header:focus-visible{box-shadow:inset 0 0 0 2px var(--dsw-alias-button-info-fill);outline:none}.KhFzGG_headText{flex-direction:column;flex:1;gap:2px;min-width:0;display:flex}.KhFzGG_name{color:var(--dsw-alias-label-primary);font-weight:600}.KhFzGG_description{color:var(--dsw-alias-label-tertiary);font-size:12px}.KhFzGG_pending{color:var(--dsw-alias-state-warn-primary);font-size:12px}.KhFzGG_chevron{color:var(--dsw-alias-label-tertiary);transition:transform .12s}.KhFzGG_chevronOpen{transform:rotate(180deg)}.KhFzGG_body{flex-direction:column;gap:14px;padding:0 14px 14px;display:flex}.KhFzGG_readOnly{color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px}.KhFzGG_footer{justify-content:flex-end;align-items:center;gap:8px;display:flex}.KhFzGG_failed{color:var(--dsw-alias-state-error-primary);margin:0 auto 0 0;font-size:12px}.KhFzGG_discard,.KhFzGG_save{font:inherit;cursor:pointer;border-radius:6px;padding:5px 12px;font-size:13px;transition:color .12s,border-color .12s,background .12s,box-shadow .12s}.KhFzGG_discard{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);background:0 0}.KhFzGG_discard:hover:not(:disabled){color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-label-dimmed)}.KhFzGG_discard:active:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}.KhFzGG_save{border:1px solid var(--dsw-alias-button-info-fill);background:var(--dsw-alias-button-info-fill);color:var(--dsw-alias-label-primary-foreground)}.KhFzGG_save:hover:not(:disabled){border-color:var(--dsw-alias-button-info-hover);background:var(--dsw-alias-button-info-hover)}.KhFzGG_save:active:not(:disabled){filter:brightness(.94)}.KhFzGG_discard:focus-visible:not(:disabled),.KhFzGG_save:focus-visible:not(:disabled){box-shadow:0 0 0 2px var(--dsw-alias-button-info-fill);outline:none}.KhFzGG_discard:disabled,.KhFzGG_save:disabled{opacity:.5;cursor:default}.KhFzGG_field{flex-direction:column;gap:4px;display:flex}.KhFzGG_head{align-items:center;gap:8px;display:flex}.KhFzGG_label{color:var(--dsw-alias-label-primary);font-size:13px;font-weight:500}.KhFzGG_badges{align-items:center;gap:6px;display:flex}.KhFzGG_badge{background:var(--dsw-alias-interactive-bg-hover-accent);color:var(--dsw-alias-state-business-primary);border-radius:999px;padding:1px 6px;font-size:11px}.KhFzGG_reset{color:var(--dsw-alias-state-business-primary);cursor:pointer;background:0 0;border:0;border-radius:3px;padding:0;font-size:11px;transition:color .12s,box-shadow .12s}.KhFzGG_reset:hover:not(:disabled){color:var(--dsw-alias-label-primary-bluish);text-decoration:underline}.KhFzGG_reset:active:not(:disabled){color:var(--dsw-alias-state-business-primary)}.KhFzGG_reset:focus-visible:not(:disabled){box-shadow:0 0 0 2px var(--dsw-alias-button-info-fill);outline:none}.KhFzGG_reset:disabled{opacity:.5;cursor:default}.KhFzGG_input,.KhFzGG_select{border:1px solid var(--dsw-alias-border-l2);font:inherit;color:var(--dsw-alias-label-primary);background:var(--dsw-specific-input-major);border-radius:6px;padding:6px 8px;font-size:13px}.KhFzGG_switch{color:var(--dsw-alias-label-secondary);font:inherit;cursor:pointer;background:0 0;border:0;align-self:flex-start;align-items:center;gap:8px;padding:0;font-size:13px;display:inline-flex}.KhFzGG_switch:disabled{opacity:.6;cursor:default}.KhFzGG_switch:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-button-info-fill);border-radius:999px;outline:none}.KhFzGG_switchTrack,.KhFzGG_switchTrackOn{background:var(--dsw-alias-border-l2);border-radius:999px;align-items:center;width:34px;height:20px;padding:2px;transition:background .12s;display:inline-flex;position:relative}.KhFzGG_switchTrackOn{background:var(--dsw-alias-button-info-fill)}.KhFzGG_switchThumb,.KhFzGG_switchThumbOn{background:var(--dsw-alias-bg-base);border-radius:50%;width:16px;height:16px;transition:transform .12s;display:block;transform:translate(0);box-shadow:0 1px 2px #0003}.KhFzGG_switchThumbOn{transform:translate(14px)}.KhFzGG_switchState{text-align:left;min-width:20px}.KhFzGG_inputInvalid{border:1px solid var(--dsw-alias-state-error-primary);font:inherit;color:var(--dsw-alias-label-primary);border-radius:6px;padding:6px 8px;font-size:13px}.KhFzGG_input:disabled,.KhFzGG_select:disabled{opacity:.6}.KhFzGG_input:focus,.KhFzGG_select:focus{border-color:var(--dsw-alias-button-info-fill);box-shadow:0 0 0 2px var(--dsw-alias-button-info-fill);outline:none}.KhFzGG_inputInvalid:focus{box-shadow:0 0 0 2px var(--dsw-alias-state-error-primary);outline:none}.KhFzGG_hint{color:var(--dsw-alias-label-secondary);margin:0;font-size:12px}.KhFzGG_invalid{color:var(--dsw-alias-state-error-primary);margin:0;font-size:12px}@media (prefers-reduced-motion:reduce){.KhFzGG_card,.KhFzGG_header,.KhFzGG_chevron,.KhFzGG_chevronOpen,.KhFzGG_switchTrack,.KhFzGG_switchTrackOn,.KhFzGG_switchThumb,.KhFzGG_switchThumbOn,.KhFzGG_reset,.KhFzGG_discard,.KhFzGG_save{transition:none}}";
		const tagId = "@linxin666/dsh-waterball/settings-card.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@linxin666/dsh-waterball";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var _dsh_css_settings_card_module_css_default = {
			"badge": "KhFzGG_badge",
			"badges": "KhFzGG_badges",
			"body": "KhFzGG_body",
			"card": "KhFzGG_card",
			"cardOpen": "KhFzGG_cardOpen",
			"chevron": "KhFzGG_chevron",
			"chevronOpen": "KhFzGG_chevronOpen",
			"description": "KhFzGG_description",
			"discard": "KhFzGG_discard",
			"failed": "KhFzGG_failed",
			"field": "KhFzGG_field",
			"footer": "KhFzGG_footer",
			"head": "KhFzGG_head",
			"headText": "KhFzGG_headText",
			"header": "KhFzGG_header",
			"hint": "KhFzGG_hint",
			"input": "KhFzGG_input",
			"inputInvalid": "KhFzGG_inputInvalid",
			"invalid": "KhFzGG_invalid",
			"label": "KhFzGG_label",
			"name": "KhFzGG_name",
			"pending": "KhFzGG_pending",
			"readOnly": "KhFzGG_readOnly",
			"reset": "KhFzGG_reset",
			"save": "KhFzGG_save",
			"select": "KhFzGG_select",
			"switch": "KhFzGG_switch",
			"switchState": "KhFzGG_switchState",
			"switchThumb": "KhFzGG_switchThumb",
			"switchThumbOn": "KhFzGG_switchThumbOn",
			"switchTrack": "KhFzGG_switchTrack",
			"switchTrackOn": "KhFzGG_switchTrackOn"
		};
		//#endregion
		//#region src/client/PluginSettingsCard.tsx
		/**
		* Shared chrome for the plugin settings card: a disclosure header naming the
		* plugin and what its settings govern, the controls inside, and the save that
		* writes them. Renders nothing while the namespace is unavailable — a
		* deployment that does not compose the owning plugin should show no trace of
		* it. Mirrors the official ui-plugin-config PluginCard in a self-contained
		* slice (this package must not depend on a sibling UI package).
		*/
		/**
		* Render one plugin settings card.
		* @param props - the plugin's copy keys, its form state, and its controls.
		* @returns the card, or nothing when the namespace is unavailable.
		*/
		function PluginSettingsCard(props) {
			const [open, setOpen] = (0, react.useState)(false);
			const { state } = props;
			if (!state.available) return null;
			const title = props.t(props.titleKey);
			const blocked = !state.dirty || state.invalid || state.saving;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
				className: _dsh_css_settings_card_module_css_default.card,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: _dsh_css_settings_card_module_css_default.header,
					"aria-expanded": open,
					"aria-label": `${props.t(open ? "settings.collapse" : "settings.expand")}: ${title}`,
					onClick: () => {
						setOpen(!open);
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: _dsh_css_settings_card_module_css_default.headText,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: _dsh_css_settings_card_module_css_default.name,
								children: title
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: _dsh_css_settings_card_module_css_default.description,
								children: props.t(props.descriptionKey)
							})]
						}),
						state.dirty ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: _dsh_css_settings_card_module_css_default.pending,
							children: props.t("settings.unsaved")
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: open ? _dsh_css_settings_card_module_css_default.chevronOpen : _dsh_css_settings_card_module_css_default.chevron,
							children: "▾"
						})
					]
				}), open ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: _dsh_css_settings_card_module_css_default.body,
					children: [
						!state.writable ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: _dsh_css_settings_card_module_css_default.readOnly,
							role: "status",
							children: props.t("settings.readOnly")
						}) : null,
						props.children,
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: _dsh_css_settings_card_module_css_default.footer,
							children: [
								state.failed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: _dsh_css_settings_card_module_css_default.failed,
									role: "status",
									children: props.t("settings.saveFailed")
								}) : null,
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: _dsh_css_settings_card_module_css_default.discard,
									disabled: !state.dirty || state.saving,
									onClick: props.onDiscard,
									children: props.t("settings.discard")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: _dsh_css_settings_card_module_css_default.save,
									disabled: blocked,
									onClick: props.onSave,
									children: props.t(!state.saving ? "settings.save" : "settings.saving")
								})
							]
						})
					]
				}) : null]
			});
		}
		/** A staged value field. `numeric` only hints the keypad: which drafts a field accepts is decided by its spec. */
		function ValueField(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: _dsh_css_settings_card_module_css_default.field,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: _dsh_css_settings_card_module_css_default.head,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
							className: _dsh_css_settings_card_module_css_default.label,
							htmlFor: props.id,
							children: props.label
						}), props.overridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: _dsh_css_settings_card_module_css_default.badges,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: _dsh_css_settings_card_module_css_default.badge,
								children: props.overriddenLabel
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: _dsh_css_settings_card_module_css_default.reset,
								disabled: props.disabled,
								onClick: props.onReset,
								children: props.resetLabel
							})]
						}) : null]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						id: props.id,
						className: props.invalid ? _dsh_css_settings_card_module_css_default.inputInvalid : _dsh_css_settings_card_module_css_default.input,
						type: "text",
						...props.numeric === true ? { inputMode: "numeric" } : {},
						...props.invalid ? { "aria-invalid": true } : {},
						value: props.text,
						placeholder: props.placeholder ?? "",
						disabled: props.disabled,
						onChange: (event) => {
							props.onEdit(event.target.value);
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: props.invalid ? _dsh_css_settings_card_module_css_default.invalid : _dsh_css_settings_card_module_css_default.hint,
						children: props.invalid ? props.invalidLabel : props.hint
					})
				]
			});
		}
		/** A staged boolean field rendered as an accessible on/off switch. */
		function BooleanField(props) {
			const checked = props.text === "true";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: _dsh_css_settings_card_module_css_default.field,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: _dsh_css_settings_card_module_css_default.head,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
							className: _dsh_css_settings_card_module_css_default.label,
							htmlFor: props.id,
							children: props.label
						}), props.overridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: _dsh_css_settings_card_module_css_default.badges,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: _dsh_css_settings_card_module_css_default.badge,
								children: props.overriddenLabel
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: _dsh_css_settings_card_module_css_default.reset,
								disabled: props.disabled,
								onClick: props.onReset,
								children: props.resetLabel
							})]
						}) : null]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						id: props.id,
						type: "button",
						className: _dsh_css_settings_card_module_css_default.switch,
						role: "switch",
						"aria-checked": checked,
						"aria-label": `${props.label}: ${checked ? props.onLabel : props.offLabel}`,
						disabled: props.disabled,
						onClick: () => {
							props.onEdit(checked ? "false" : "true");
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: checked ? _dsh_css_settings_card_module_css_default.switchTrackOn : _dsh_css_settings_card_module_css_default.switchTrack,
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: checked ? _dsh_css_settings_card_module_css_default.switchThumbOn : _dsh_css_settings_card_module_css_default.switchThumb })
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: _dsh_css_settings_card_module_css_default.switchState,
							children: checked ? props.onLabel : props.offLabel
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: _dsh_css_settings_card_module_css_default.hint,
						children: props.hint
					})
				]
			});
		}
		/** A staged fixed-choice field rendered as a select. */
		function SelectField(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: _dsh_css_settings_card_module_css_default.field,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: _dsh_css_settings_card_module_css_default.head,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
							className: _dsh_css_settings_card_module_css_default.label,
							htmlFor: props.id,
							children: props.label
						}), props.overridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: _dsh_css_settings_card_module_css_default.badges,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: _dsh_css_settings_card_module_css_default.badge,
								children: props.overriddenLabel
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: _dsh_css_settings_card_module_css_default.reset,
								disabled: props.disabled,
								onClick: props.onReset,
								children: props.resetLabel
							})]
						}) : null]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
						id: props.id,
						className: props.invalid ? _dsh_css_settings_card_module_css_default.inputInvalid : _dsh_css_settings_card_module_css_default.select,
						value: props.text,
						disabled: props.disabled,
						"aria-invalid": props.invalid || void 0,
						onChange: (event) => {
							props.onEdit(event.target.value);
						},
						children: props.options.map((option) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
							value: option.value,
							children: option.label
						}, option.value))
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: props.invalid ? _dsh_css_settings_card_module_css_default.invalid : _dsh_css_settings_card_module_css_default.hint,
						children: props.invalid ? props.invalidLabel : props.hint
					})
				]
			});
		}
		//#endregion
		//#region src/client/settings-form.ts
		/** A whole-number field. An empty draft clears the field; any other draft that is not a finite number blocks the save. */
		function numberField(field) {
			return {
				field,
				format: (value) => typeof value === "number" ? String(value) : "",
				parse: (text) => {
					const trimmed = text.trim();
					if (trimmed === "") return { kind: "clear" };
					const parsed = Number(trimmed);
					return Number.isFinite(parsed) ? {
						kind: "set",
						value: parsed
					} : void 0;
				}
			};
		}
		/** A boolean field, edited through true/false draft text. */
		function booleanField(field) {
			return {
				field,
				format: (value) => typeof value === "boolean" ? String(value) : "",
				parse: (text) => {
					if (text === "true") return {
						kind: "set",
						value: true
					};
					if (text === "false") return {
						kind: "set",
						value: false
					};
				}
			};
		}
		/** A fixed-choice field, edited through one of the allowed draft values. */
		function choiceField(field, choices) {
			const allowed = new Set(choices);
			return {
				field,
				format: (value) => typeof value === "string" && allowed.has(value) ? value : "",
				parse: (text) => allowed.has(text) ? {
					kind: "set",
					value: text
				} : void 0
			};
		}
		/**
		* Stages one card's edits over one settings namespace and writes them on save.
		*
		* The Host is the only authority on whether a value was accepted — its
		* validators own the constraints no schema can express — so the outcome is
		* read back from the section rather than predicted here. A save that did not
		* land keeps its drafts, so the user can correct them instead of retyping.
		*/
		var CardForm = class {
			scope;
			specs;
			staged = /* @__PURE__ */ new Map();
			listeners = /* @__PURE__ */ new Set();
			saving = false;
			failed = false;
			/** @param scope - the bound settings scope for this card's namespace. */
			constructor(scope, specs) {
				this.scope = scope;
				this.specs = new Map(specs.map((spec) => [spec.field, spec]));
				scope.subscribe(() => {
					this.publish();
				});
			}
			/** Publish a projection of this form, rebuilt whenever the scope or a draft changes. */
			bind(project) {
				const store = (0, _deepseek_ai_dsh_client_runtime_client.createSnapshotStore)(project());
				this.listeners.add(() => {
					store.set(project());
				});
				return store;
			}
			/** Read the card-level state: what the Host serves, and what a save would do. */
			shell() {
				const snapshot = this.scope.getSnapshot();
				const plan = this.plan();
				return {
					available: snapshot.status === "ready",
					writable: snapshot.writable,
					dirty: plan.length > 0,
					invalid: plan.some((item) => item.run === void 0),
					saving: this.saving,
					failed: this.failed
				};
			}
			/** Read one field's state from the effective section and its staged draft. */
			field(field) {
				const spec = this.specOf(field);
				const staged = this.staged.get(field);
				if (staged === void 0) return {
					text: spec.format(this.sectionValue(field)),
					overridden: this.stored(field),
					invalid: false
				};
				const write = staged.clear ? { kind: "clear" } : spec.parse(staged.text);
				return {
					text: staged.text,
					overridden: write?.kind === "set",
					invalid: write === void 0
				};
			}
			/** The actions the card's slot registration injects. */
			actions() {
				return {
					edit: (field, text) => {
						this.stage(field, {
							text,
							clear: false
						});
					},
					resetField: (field) => {
						this.stage(field, {
							text: this.specOf(field).format(this.baseValue(field)),
							clear: true
						});
					},
					save: () => {
						this.save();
					},
					discard: () => {
						if (this.staged.size === 0 && !this.failed) return;
						this.staged.clear();
						this.failed = false;
						this.publish();
					}
				};
			}
			/**
			* Write every staged edit, then re-seed from what the Host accepted.
			* @returns settlement after every write and the read-back.
			*/
			async save() {
				const plan = this.plan();
				const writes = plan.flatMap((item) => item.run === void 0 ? [] : [item.run]);
				if (plan.length === 0 || this.saving || writes.length !== plan.length) return;
				this.saving = true;
				this.failed = false;
				this.publish();
				let landed = true;
				for (const write of writes) landed = await write() && landed;
				if (landed) this.staged.clear();
				this.saving = false;
				this.failed = !landed;
				this.publish();
			}
			/**
			* Every staged edit a save would write. An entry whose draft is not a value
			* its field accepts carries no write: the form is still dirty, and the save
			* refuses rather than dropping the edit. A staged edit that matches the
			* effective section is not a write at all.
			* @returns the planned writes, in the order the fields were staged.
			*/
			plan() {
				const plan = [];
				for (const [field, staged] of this.staged) {
					const spec = this.specOf(field);
					if (staged.clear) {
						if (this.stored(field)) plan.push({
							field,
							run: () => this.clear(field)
						});
						continue;
					}
					if (staged.text === spec.format(this.sectionValue(field))) continue;
					const write = spec.parse(staged.text);
					if (write === void 0) plan.push({
						field,
						run: void 0
					});
					else if (write.kind === "clear") plan.push({
						field,
						run: () => this.clear(field)
					});
					else plan.push({
						field,
						run: () => this.store(field, write.value)
					});
				}
				return plan;
			}
			async clear(field) {
				await this.scope.unset(field);
				return !this.stored(field);
			}
			async store(field, value) {
				await this.scope.set(field, value);
				return this.userLayer()?.[field] === value;
			}
			stage(field, edit) {
				this.staged.set(field, edit);
				this.failed = false;
				this.publish();
			}
			specOf(field) {
				const spec = this.specs.get(field);
				if (spec === void 0) throw new Error(`settings card has no field ${field}`);
				return spec;
			}
			snapshotOf() {
				return this.scope.getSnapshot();
			}
			sectionValue(field) {
				return this.snapshotOf().value?.[field];
			}
			baseValue(field) {
				return this.snapshotOf().base?.[field];
			}
			userLayer() {
				return this.snapshotOf().user;
			}
			stored(field) {
				const user = this.userLayer();
				return user !== void 0 && Object.hasOwn(user, field);
			}
			publish() {
				for (const listener of this.listeners) listener();
			}
		};
		//#endregion
		//#region src/client/WaterballSettingsCard.tsx
		/** Bridges the `waterball` scope onto the card's staged form. */
		var WaterballSettingsCardController = class {
			form;
			store;
			/** @param scope - the bound settings scope for the `waterball` namespace. */
			constructor(scope) {
				this.form = new CardForm(scope, [
					booleanField("enabled"),
					booleanField("hidden"),
					numberField("size"),
					numberField("right"),
					numberField("bottom"),
					choiceField("eyeColor", ["white", "black"]),
					booleanField("showEyes")
				]);
				this.store = this.form.bind(() => this.projection());
			}
			projection() {
				return {
					...this.form.shell(),
					enabled: this.form.field("enabled"),
					hidden: this.form.field("hidden"),
					size: this.form.field("size"),
					right: this.form.field("right"),
					bottom: this.form.field("bottom"),
					eyeColor: this.form.field("eyeColor"),
					showEyes: this.form.field("showEyes")
				};
			}
			/**
			* Build the face the card's slot registration injects.
			* @returns the card's snapshot and its form actions.
			*/
			inject() {
				return {
					hooks: { waterballSettingsCard: this.store },
					...this.form.actions()
				};
			}
		};
		/**
		* Render the water ball settings card.
		* @param props - locale copy, the card snapshot, and its form actions.
		* @returns the card.
		*/
		function WaterballSettingsCard(props) {
			const { t } = props;
			const state = props.useWaterballSettingsCard((snapshot) => snapshot);
			const disabled = !state.writable;
			const fieldProps = {
				overriddenLabel: t("settings.overridden"),
				resetLabel: t("settings.reset"),
				invalidLabel: t("settings.invalidNumber"),
				disabled
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(PluginSettingsCard, {
				t,
				titleKey: "settings.title",
				descriptionKey: "settings.description",
				state,
				onSave: props.save,
				onDiscard: props.discard,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BooleanField, {
						id: "settings-waterball-enabled",
						label: t("settings.enabled"),
						hint: t("settings.enabledHint"),
						inheritLabel: t("settings.inherit"),
						onLabel: t("settings.on"),
						offLabel: t("settings.off"),
						...fieldProps,
						...state.enabled,
						onEdit: (text) => {
							props.edit("enabled", text);
						},
						onReset: () => {
							props.resetField("enabled");
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BooleanField, {
						id: "settings-waterball-hidden",
						label: t("settings.hidden"),
						hint: t("settings.hiddenHint"),
						inheritLabel: t("settings.inherit"),
						onLabel: t("settings.on"),
						offLabel: t("settings.off"),
						...fieldProps,
						...state.hidden,
						onEdit: (text) => {
							props.edit("hidden", text);
						},
						onReset: () => {
							props.resetField("hidden");
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectField, {
						id: "settings-waterball-eyecolor",
						label: t("settings.eyeColor"),
						hint: t("settings.eyeColorHint"),
						options: [{
							value: "white",
							label: t("settings.eyeWhite")
						}, {
							value: "black",
							label: t("settings.eyeBlack")
						}],
						...fieldProps,
						...state.eyeColor,
						onEdit: (text) => {
							props.edit("eyeColor", text);
						},
						onReset: () => {
							props.resetField("eyeColor");
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BooleanField, {
						id: "settings-waterball-showeyes",
						label: t("settings.showEyes"),
						hint: t("settings.showEyesHint"),
						inheritLabel: t("settings.inherit"),
						onLabel: t("settings.on"),
						offLabel: t("settings.off"),
						...fieldProps,
						...state.showEyes,
						onEdit: (text) => {
							props.edit("showEyes", text);
						},
						onReset: () => {
							props.resetField("showEyes");
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ValueField, {
						id: "settings-waterball-size",
						label: t("settings.size"),
						hint: t("settings.sizeHint"),
						numeric: true,
						...fieldProps,
						...state.size,
						onEdit: (text) => {
							props.edit("size", text);
						},
						onReset: () => {
							props.resetField("size");
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ValueField, {
						id: "settings-waterball-right",
						label: t("settings.right"),
						hint: t("settings.rightHint"),
						numeric: true,
						...fieldProps,
						...state.right,
						onEdit: (text) => {
							props.edit("right", text);
						},
						onReset: () => {
							props.resetField("right");
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ValueField, {
						id: "settings-waterball-bottom",
						label: t("settings.bottom"),
						hint: t("settings.bottomHint"),
						numeric: true,
						...fieldProps,
						...state.bottom,
						onEdit: (text) => {
							props.edit("bottom", text);
						},
						onReset: () => {
							props.resetField("bottom");
						}
					})
				]
			});
		}
		//#endregion
		//#region src/client/locales.ts
		/**
		* dsh-waterball locale dictionaries (zh/en).
		* @module @linxin666/dsh-waterball/client/locales
		*/
		/** Dictionary namespace this package registers. */
		const NS = "waterball";
		/** Chinese copy. */
		const zh = {
			"settings.title": "水球宠物",
			"settings.description": "右下角的水球宠物，内部颜色随 Agent 活动状态变化，外层白色渐变保持不变。",
			"settings.enabled": "启用水球",
			"settings.enabledHint": "关闭后隐藏水球并停止轮询，可在设置里重新启用。",
			"settings.hidden": "隐藏网页水球",
			"settings.hiddenHint": "仅不在网页端显示水球；状态接口仍保持可用（桌面呼吸灯可继续读取）。",
			"settings.size": "大小（px）",
			"settings.sizeHint": "水球渲染宽度，范围 64–400。",
			"settings.eyeColor": "眼睛颜色",
			"settings.eyeColorHint": "选择眼睛的填充颜色：白色或黑色。",
			"settings.eyeWhite": "白色",
			"settings.eyeBlack": "黑色",
			"settings.showEyes": "显示眼睛",
			"settings.showEyesHint": "关闭后水球不再绘制眼睛。",
			"settings.right": "距右侧（px）",
			"settings.rightHint": "距视口右边缘的水平内缩距离。",
			"settings.bottom": "距底部（px）",
			"settings.bottomHint": "距视口底边的垂直内缩距离。",
			"settings.inherit": "继承",
			"settings.on": "开",
			"settings.off": "关",
			"settings.overridden": "已覆盖",
			"settings.reset": "恢复默认",
			"settings.readOnly": "当前部署的设置只读。",
			"settings.expand": "展开设置",
			"settings.collapse": "收起设置",
			"settings.save": "保存",
			"settings.saving": "保存中…",
			"settings.discard": "放弃",
			"settings.unsaved": "未保存",
			"settings.saveFailed": "部署未接受这些值，已保留供你修改。",
			"settings.invalidNumber": "请输入数字，留空则使用默认值。"
		};
		/** English copy. */
		const en = {
			"settings.title": "Water Ball",
			"settings.description": "A floating water ball whose inner color follows the agent activity while the white outer gradient stays unchanged.",
			"settings.enabled": "Enable the water ball",
			"settings.enabledHint": "When off, the water ball hides and polling stops; re-enable it here.",
			"settings.hidden": "Hide the web water ball",
			"settings.hiddenHint": "Hides the ball in the web UI only; the status API stays available (e.g. for the desktop breathing light).",
			"settings.size": "Size (px)",
			"settings.sizeHint": "Rendered width, 64–400.",
			"settings.eyeColor": "Eye color",
			"settings.eyeColorHint": "Pick the eye fill: white or black.",
			"settings.eyeWhite": "White",
			"settings.eyeBlack": "Black",
			"settings.showEyes": "Show eyes",
			"settings.showEyesHint": "When off, the water ball draws no eyes.",
			"settings.right": "Right inset (px)",
			"settings.rightHint": "Horizontal inset from the viewport right edge.",
			"settings.bottom": "Bottom inset (px)",
			"settings.bottomHint": "Vertical inset from the viewport bottom edge.",
			"settings.inherit": "Inherit",
			"settings.on": "On",
			"settings.off": "Off",
			"settings.overridden": "Overridden",
			"settings.reset": "Reset to default",
			"settings.readOnly": "This deployment stores settings read-only.",
			"settings.expand": "Show settings",
			"settings.collapse": "Hide settings",
			"settings.save": "Save",
			"settings.saving": "Saving…",
			"settings.discard": "Discard",
			"settings.unsaved": "Unsaved",
			"settings.saveFailed": "The deployment did not accept these values; they were left for you to correct.",
			"settings.invalidNumber": "Enter a number, or leave blank to use the default."
		};
		//#endregion
		//#region src/client/index.ts
		/** Settings namespace the settings card edits (the host plugin registers it). */
		const WATERBALL_SETTINGS_NS = "waterball";
		/** Required services. */
		const inject = [
			"slots",
			"locale",
			"connection",
			"settingsScope",
			"remote"
		];
		/**
		* Client plugin body: register dictionaries, mount the water ball and its
		* poll loop while the plugin is enabled, and seat the settings card in the
		* settings plugin section.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "waterball: dictionaries");
			const settingsScope = ctx.settingsScope.bind({ namespace: WATERBALL_SETTINGS_NS });
			const enabled = () => {
				const snapshot = settingsScope.getSnapshot();
				return snapshot.status === "ready" ? snapshot.value?.enabled ?? true : snapshot.status === "unavailable";
			};
			const hidden = () => {
				const snapshot = settingsScope.getSnapshot();
				return snapshot.status === "ready" ? snapshot.value?.hidden ?? true : false;
			};
			const persistPosition = (right, bottom) => {
				settingsScope.set("right", Math.round(right));
				settingsScope.set("bottom", Math.round(bottom));
			};
			const card = new WaterballSettingsCardController(settingsScope);
			ctx.slots.inject("settings.plugin.item", () => ctx.slots.register({
				name: "settings.plugin.item",
				key: WATERBALL_SETTINGS_NS,
				locale: NS,
				inject: () => card.inject()
			}, WaterballSettingsCard));
			let disposeUi;
			const syncUi = () => {
				if (enabled() && !hidden() && disposeUi === void 0) disposeUi = ctx.slots.inject("shell.overlay", () => ctx.slots.register({
					name: "shell.overlay",
					id: "waterball",
					order: 110,
					locale: NS,
					inject: () => ({ persistPosition })
				}, WaterballDockEntry));
				else if ((!enabled() || hidden()) && disposeUi !== void 0) {
					disposeUi();
					disposeUi = void 0;
				}
			};
			settingsScope.subscribe(syncUi);
			syncUi();
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map