/**
 * Mode Extension — /plan and /ask, mutually exclusive.
 *
 * /plan [file.md]  — read-only, writes allowed only on the plan file
 * /plan off        — exit any mode
 * /ask             — read-only, nothing can be created or modified
 * /ask off         — exit any mode
 * --plan / --ask   — start in that mode (--ask wins)
 *
 * Only one mode is ever active, so state and indicators never desync.
 * Entering/exiting a mode swaps the active tool set: plan keeps write/edit
 * (guarded to the plan file only), ask keeps none. The active mode is also
 * announced in the system prompt so the agent behaves accordingly. Switching
 * modes rebuilds the system prompt once (one provider cache miss).
 */
import { resolve } from "node:path";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { isSafeCommand } from "./lib/safe-bash.ts";

type Mode = "off" | "plan" | "ask";

const PLAN_TOOLS = ["read", "bash", "grep", "find", "ls", "write", "edit"];
const ASK_TOOLS = ["read", "bash", "grep", "find", "ls"];

const STATUS: Record<Mode, (planFile: string) => string | undefined> = {
	plan: (f) => `⏸ plan (writes: ${f})`,
	ask: () => "💬 ask (read-only)",
	off: () => undefined,
};

const MESSAGE: Record<Mode, (planFile: string) => string> = {
	plan: (f) => `Plan mode ON — only ${f} is writable`,
	ask: () => "Ask mode ON — read-only, cannot create or modify anything",
	off: () => "Mode OFF — full tool access restored",
};

const PROMPT: Record<Mode, (planFile: string) => string> = {
	plan: (f) => `Mode: plan — read-only except ${f}; write your plan to ${f} and do not modify code.`,
	ask: () => "Mode: ask — read-only; answer questions only, make no changes.",
	off: () => "",
};

export default function (pi: ExtensionAPI): void {
	let mode: Mode = "off";
	let planFile = "PLAN.md";
	let toolsBeforeMode: string[] | undefined;

	function applyStatus(ctx: ExtensionContext): void {
		const status = STATUS[mode](planFile);
		ctx.ui.setStatus("mode", status ? ctx.ui.theme.fg(mode === "plan" ? "warning" : "accent", status) : undefined);
	}

	function setMode(ctx: ExtensionContext, next: Mode): void {
		if (next === mode) return;
		if (next === "off") {
			pi.setActiveTools(toolsBeforeMode ?? pi.getAllTools().map((t) => t.name));
			toolsBeforeMode = undefined;
		} else {
			if (mode === "off") toolsBeforeMode = pi.getActiveTools();
			pi.setActiveTools(next === "plan" ? PLAN_TOOLS : ASK_TOOLS);
		}
		mode = next;
		applyStatus(ctx);
		ctx.ui.notify(MESSAGE[next](planFile), next === "off" ? "success" : "info");
	}

	pi.registerCommand("plan", {
		description: "Toggle plan mode (read-only; writes only to the plan .md file)",
		handler: async (args, ctx) => {
			const arg = args?.trim();
			if (arg === "off") setMode(ctx, "off");
			else if (arg) {
				planFile = arg;
				setMode(ctx, "plan");
			} else setMode(ctx, mode === "plan" ? "off" : "plan");
		},
	});

	pi.registerCommand("ask", {
		description: "Toggle read-only chat mode (can read, but cannot create or modify anything)",
		handler: async (args, ctx) => setMode(ctx, args?.trim() === "off" || mode === "ask" ? "off" : "ask"),
	});

	pi.registerFlag("plan", {
		description: "Start in plan mode (read-only; writes only to the plan .md file)",
		type: "boolean",
		default: false,
	});

	pi.registerFlag("ask", {
		description: "Start in read-only chat mode (can read, but cannot create or modify anything)",
		type: "boolean",
		default: false,
	});

	pi.on("session_start", (_event, ctx) => {
		mode = pi.getFlag("ask") ? "ask" : pi.getFlag("plan") ? "plan" : "off";
		if (mode !== "off") {
			toolsBeforeMode = pi.getActiveTools();
			pi.setActiveTools(mode === "plan" ? PLAN_TOOLS : ASK_TOOLS);
		}
		applyStatus(ctx);
	});

	pi.on("before_agent_start", (event) => {
		if (mode === "off") return;
		return { systemPrompt: `${event.systemPrompt}\n\n${PROMPT[mode](planFile)}` };
	});

	pi.on("tool_call", (event, ctx) => {
		if (mode === "off") return;

		if (event.toolName === "bash") {
			const command = (event.input as { command?: string }).command ?? "";
			if (!isSafeCommand(command)) {
				return { block: true, reason: "Read-only mode: command blocked (not read-only)" };
			}
		}

		if (event.toolName === "write" || event.toolName === "edit") {
			const path = (event.input as { path?: string }).path;
			const isPlanFile = mode === "plan" && path !== undefined && resolve(ctx.cwd, planFile) === resolve(ctx.cwd, path);
			if (!isPlanFile) {
				return { block: true, reason: mode === "plan" ? `Plan mode: only ${planFile} is writable` : "Ask mode: cannot create or modify anything" };
			}
		}
	});
}
