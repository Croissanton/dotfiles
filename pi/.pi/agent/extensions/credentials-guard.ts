/**
 * Credentials Guard — always-on, no mode needed.
 *
 * Blocks any tool call (read / write / edit / grep / find / ls / bash) that
 * touches credential files: .env*, .ssh/, auth.json, *.pem|key|p12|pfx,
 * credentials*, secrets.*. Complements the AGENTS.md credentials rule with
 * structural enforcement.
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const CREDENTIAL_PATTERNS = [
	/\.env(\.|$)/, // .env, .env.local, ...
	/(^|\/)\.ssh(\/|$)/, // ~/.ssh/...
	/auth\.json$/,
	/\.(pem|key|p12|pfx)$/,
	/credentials($|\.)/, // credentials, credentials.json, ~/.aws/credentials
	/secret(s)?\.(json|ya?ml|txt)$/,
];

function touchesCredentials(text: string): boolean {
	return CREDENTIAL_PATTERNS.some((p) => p.test(text));
}

function blockReason(): { block: true; reason: string } {
	return { block: true, reason: "Credentials guard: refusing to touch credential files" };
}

export default function (pi: ExtensionAPI): void {
	pi.on("tool_call", async (event) => {
		const name = event.toolName;
		const input = (event.input ?? {}) as Record<string, unknown>;

		if (name === "read" || name === "write" || name === "edit") {
			const path = typeof input.path === "string" ? input.path : "";
			if (touchesCredentials(path)) return blockReason();
		} else if (name === "bash") {
			const command = typeof input.command === "string" ? input.command : "";
			if (touchesCredentials(command)) return blockReason();
		} else if (name === "grep" || name === "find" || name === "ls") {
			if (touchesCredentials(JSON.stringify(input))) return blockReason();
		}
	});
}
