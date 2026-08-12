/**
 * No-Sudo Guard — blocks privilege escalation attempts.
 *
 * Blocks any bash tool call that tries to run `sudo`, `doas`, or `su`
 * (word-boundary matched, so `pseudo`, `sudoers` files, etc. pass through).
 * The interactive shell has no passwordless access, so such calls always
 * fail anyway; this turns them into an immediate, instructive block instead
 * of a wasted tool call. Complements the AGENTS.md privilege-escalation rule
 * with structural enforcement.
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const ESCALATION_PATTERN = /\b(sudo|doas|su)\b/;

function blockReason(): { block: true; reason: string } {
	return {
		block: true,
		reason:
			"No-sudo guard: privilege escalation is not available in this shell. Provide the command for the user to run manually instead.",
	};
}

export default function (pi: ExtensionAPI): void {
	pi.on("tool_call", async (event) => {
		if (event.toolName !== "bash") return;
		const command = typeof event.input?.command === "string" ? event.input.command : "";
		if (ESCALATION_PATTERN.test(command)) return blockReason();
	});
}
