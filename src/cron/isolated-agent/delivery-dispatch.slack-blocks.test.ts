/**
 * Tests that [[slack_buttons:...]] directives are compiled into interactive
 * blocks before cron direct delivery.
 *
 * Bug: dispatchCronDelivery's deliverViaDirect path passed raw payloads
 * straight to deliverOutboundPayloads without running normalizeReplyPayload /
 * compileSlackInteractiveReplies, so [[slack_buttons:...]] directives leaked
 * as literal text instead of being converted into Slack interactive blocks.
 *
 * Fix: deliverViaDirect now normalizes payloads (including Slack directives)
 * via normalizeReplyPayload before handing them to deliverOutboundPayloads.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// --- Module mocks (must be hoisted before imports) ---

vi.mock("../../config/sessions.js", () => ({
  resolveAgentMainSessionKey: vi.fn(({ agentId }: { agentId: string }) => `agent:${agentId}:main`),
  resolveMainSessionKey: vi.fn(() => "global"),
}));

vi.mock("../../agents/subagent-registry.js", () => ({
  countActiveDescendantRuns: vi.fn().mockReturnValue(0),
}));

vi.mock("../../infra/outbound/deliver.js", () => ({
  deliverOutboundPayloads: vi.fn().mockResolvedValue([{ ok: true }]),
}));

vi.mock("../../infra/outbound/identity.js", () => ({
  resolveAgentOutboundIdentity: vi.fn().mockReturnValue({}),
}));

vi.mock("../../infra/outbound/session-context.js", () => ({
  buildOutboundSessionContext: vi.fn().mockReturnValue({ key: "agent:main", agentId: "main" }),
}));

vi.mock("../../cli/outbound-send-deps.js", () => ({
  createOutboundSendDeps: vi.fn().mockReturnValue({}),
}));

vi.mock("../../logger.js", () => ({
  logWarn: vi.fn(),
  logError: vi.fn(),
}));

vi.mock("../../infra/system-events.js", () => ({
  enqueueSystemEvent: vi.fn(),
}));

vi.mock("./subagent-followup.js", () => ({
  expectsSubagentFollowup: vi.fn().mockReturnValue(false),
  isLikelyInterimCronMessage: vi.fn().mockReturnValue(false),
  readDescendantSubagentFallbackReply: vi.fn().mockResolvedValue(undefined),
  waitForDescendantSubagentSummary: vi.fn().mockResolvedValue(undefined),
}));

import { slackOutbound } from "../../../test/channel-outbounds.js";
// Import after mocks
import type { OpenClawConfig } from "../../config/config.js";
import { deliverOutboundPayloads } from "../../infra/outbound/deliver.js";
import { setActivePluginRegistry } from "../../plugins/runtime.js";
import { createOutboundTestPlugin, createTestRegistry } from "../../test-utils/channel-plugins.js";
import {
  dispatchCronDelivery,
  resetCompletedDirectCronDeliveriesForTests,
} from "./delivery-dispatch.js";
import type { DeliveryTargetResolution } from "./delivery-target.js";
import type { RunCronAgentTurnResult } from "./run.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const emptyRegistry = createTestRegistry([]);
const slackRegistry = createTestRegistry([
  {
    pluginId: "slack",
    source: "test",
    plugin: createOutboundTestPlugin({
      id: "slack",
      outbound: slackOutbound,
      messaging: {
        enableInteractiveReplies: ({ cfg }) =>
          (cfg.channels?.slack as { capabilities?: { interactiveReplies?: boolean } } | undefined)
            ?.capabilities?.interactiveReplies === true,
      },
    }),
  },
]);

const slackCfg: OpenClawConfig = {
  channels: {
    slack: {
      capabilities: { interactiveReplies: true },
    },
  },
} as OpenClawConfig;

function makeResolvedDelivery(
  overrides: Partial<Extract<DeliveryTargetResolution, { ok: true }>> = {},
): Extract<DeliveryTargetResolution, { ok: true }> {
  return {
    ok: true,
    channel: "slack",
    to: "C0123456789",
    accountId: "default",
    threadId: undefined,
    mode: "explicit",
    ...overrides,
  };
}

function makeWithRunSession() {
  return (
    result: Omit<RunCronAgentTurnResult, "sessionId" | "sessionKey">,
  ): RunCronAgentTurnResult => ({
    ...result,
    sessionId: "test-session-id",
    sessionKey: "test-session-key",
  });
}

function makeParams(overrides: {
  deliveryPayloads?: Array<{ text?: string; [key: string]: unknown }>;
  synthesizedText?: string;
  deliveryPayloadHasStructuredContent?: boolean;
  resolvedDelivery?: Extract<DeliveryTargetResolution, { ok: true }>;
}) {
  return {
    cfg: slackCfg,
    cfgWithAgentDefaults: slackCfg,
    deps: {} as never,
    job: {
      id: "test-job",
      name: "Quiz Job",
      sessionTarget: "isolated",
      deleteAfterRun: false,
      payload: { kind: "agentTurn", message: "run quiz" },
    } as never,
    agentId: "main",
    agentSessionKey: "agent:main",
    runSessionId: "run-slack-1",
    runStartedAt: Date.now(),
    runEndedAt: Date.now(),
    timeoutMs: 30_000,
    resolvedDelivery: overrides.resolvedDelivery ?? makeResolvedDelivery(),
    deliveryRequested: true,
    skipHeartbeatDelivery: false,
    deliveryBestEffort: false,
    deliveryPayloadHasStructuredContent: overrides.deliveryPayloadHasStructuredContent ?? false,
    deliveryPayloads: (overrides.deliveryPayloads ?? []) as never,
    synthesizedText: overrides.synthesizedText ?? "",
    summary: overrides.synthesizedText ?? "",
    outputText: overrides.synthesizedText ?? "",
    telemetry: undefined,
    abortSignal: undefined,
    isAborted: () => false,
    abortReason: () => "aborted",
    withRunSession: makeWithRunSession(),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("dispatchCronDelivery — Slack block parsing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setActivePluginRegistry(slackRegistry);
    resetCompletedDirectCronDeliveriesForTests();
    vi.mocked(deliverOutboundPayloads).mockResolvedValue([{ ok: true }]);
  });

  afterEach(() => {
    setActivePluginRegistry(emptyRegistry);
  });

  it("compiles [[slack_buttons:]] directives into interactive blocks before direct delivery", async () => {
    // deliveryPayloadHasStructuredContent=true forces the direct-delivery path
    const params = makeParams({
      deliveryPayloadHasStructuredContent: true,
      deliveryPayloads: [{ text: "Pick one [[slack_buttons: Yes:yes | No:no]]" }],
    });

    const state = await dispatchCronDelivery(params);

    expect(state.delivered).toBe(true);
    expect(deliverOutboundPayloads).toHaveBeenCalledTimes(1);

    const call = vi.mocked(deliverOutboundPayloads).mock.calls[0]![0];
    expect(call.channel).toBe("slack");

    // The raw [[slack_buttons:...]] directive must NOT be in the delivered payloads.
    const deliveredPayloads = call.payloads as Array<{ text?: string; interactive?: unknown }>;
    for (const payload of deliveredPayloads) {
      expect(payload.text).not.toMatch(/\[\[slack_buttons:/);
    }

    // The compiled blocks must be present.
    expect(deliveredPayloads[0]).toMatchObject({
      interactive: {
        blocks: expect.arrayContaining([expect.objectContaining({ type: "buttons" })]),
      },
    });
  });

  it("compiles [[slack_buttons:]] directives in the text-delivery (synthesized) path", async () => {
    // deliveryPayloadHasStructuredContent=false forces the text-delivery path,
    // which calls finalizeTextDelivery → deliverViaDirect.
    const buttonText = "Vote [[slack_buttons: Option A:a | Option B:b]]";
    const params = makeParams({
      deliveryPayloadHasStructuredContent: false,
      deliveryPayloads: [],
      synthesizedText: buttonText,
    });

    const state = await dispatchCronDelivery(params);

    expect(state.delivered).toBe(true);
    expect(deliverOutboundPayloads).toHaveBeenCalledTimes(1);

    const call = vi.mocked(deliverOutboundPayloads).mock.calls[0]![0];
    const deliveredPayloads = call.payloads as Array<{ text?: string; interactive?: unknown }>;
    for (const payload of deliveredPayloads) {
      expect(payload.text).not.toMatch(/\[\[slack_buttons:/);
    }
    expect(deliveredPayloads[0]).toMatchObject({
      interactive: {
        blocks: expect.arrayContaining([expect.objectContaining({ type: "buttons" })]),
      },
    });
  });

  it("passes through plain-text Slack payloads without modification", async () => {
    const params = makeParams({
      deliveryPayloadHasStructuredContent: true,
      deliveryPayloads: [{ text: "Here is your quiz result: 7/10." }],
    });

    await dispatchCronDelivery(params);

    const call = vi.mocked(deliverOutboundPayloads).mock.calls[0]![0];
    const deliveredPayloads = call.payloads as Array<{ text?: string }>;
    expect(deliveredPayloads[0]?.text).toBe("Here is your quiz result: 7/10.");
  });
});
