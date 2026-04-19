import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();
vi.mock("../send.js", () => ({
  sendMessageSlack: (...args: unknown[]) => sendMock(...args),
}));

let deliverReplies: typeof import("./replies.js").deliverReplies;
let resolveSlackThreadTs: typeof import("./replies.js").resolveSlackThreadTs;
let resolveSlackReplyBlocks: typeof import("./replies.js").resolveSlackReplyBlocks;
import { deliverSlackSlashReplies } from "./replies.js";

function baseParams(overrides?: Record<string, unknown>) {
  return {
    replies: [{ text: "hello" }],
    target: "C123",
    token: "xoxb-test",
    runtime: { log: () => {}, error: () => {}, exit: () => {} },
    textLimit: 4000,
    replyToMode: "off" as const,
    ...overrides,
  };
}

describe("deliverReplies identity passthrough", () => {
  beforeAll(async () => {
    ({ deliverReplies, resolveSlackThreadTs, resolveSlackReplyBlocks } = await import("./replies.js"));
  });

  beforeEach(() => {
    sendMock.mockReset();
  });
  it("passes identity to sendMessageSlack for text replies", async () => {
    sendMock.mockResolvedValue({ messageId: "ts-1", channelId: "C123" });
    const identity = { username: "Bot", iconEmoji: ":robot:" };
    await deliverReplies(baseParams({ identity }));

    expect(sendMock).toHaveBeenCalledOnce();
    expect(sendMock.mock.calls[0][2]).toMatchObject({ identity });
  });

  it("passes identity to sendMessageSlack for media replies", async () => {
    sendMock.mockResolvedValue({ messageId: "ts-1", channelId: "C123" });
    const identity = { username: "Bot", iconUrl: "https://example.com/icon.png" };
    await deliverReplies(
      baseParams({
        identity,
        replies: [{ text: "caption", mediaUrls: ["https://example.com/img.png"] }],
      }),
    );

    expect(sendMock).toHaveBeenCalledOnce();
    expect(sendMock.mock.calls[0][2]).toMatchObject({ identity });
  });

  it("omits identity key when not provided", async () => {
    sendMock.mockResolvedValue({ messageId: "ts-1", channelId: "C123" });
    await deliverReplies(baseParams());

    expect(sendMock).toHaveBeenCalledOnce();
    expect(sendMock.mock.calls[0][2]).not.toHaveProperty("identity");
  });

  it("delivers block-only replies through to sendMessageSlack", async () => {
    sendMock.mockResolvedValue({ messageId: "ts-1", channelId: "C123" });
    const blocks = [
      {
        type: "actions",
        elements: [
          {
            type: "button",
            action_id: "openclaw:reply_button",
            text: { type: "plain_text", text: "Option A" },
            value: "reply_1_option_a",
          },
        ],
      },
    ];

    await deliverReplies(
      baseParams({
        replies: [
          {
            text: "",
            channelData: {
              slack: {
                blocks,
              },
            },
          },
        ],
      }),
    );

    expect(sendMock).toHaveBeenCalledOnce();
    expect(sendMock).toHaveBeenCalledWith(
      "C123",
      "",
      expect.objectContaining({
        blocks,
      }),
    );
  });

  it("renders interactive replies into Slack blocks during delivery", async () => {
    sendMock.mockResolvedValue(undefined);

    await deliverReplies(
      baseParams({
        replies: [
          {
            text: "Choose",
            interactive: {
              blocks: [
                { type: "text", text: "Choose" },
                {
                  type: "buttons",
                  buttons: [{ label: "Approve", value: "approve", style: "primary" }],
                },
              ],
            },
          },
        ],
      }),
    );

    expect(sendMock).toHaveBeenCalledOnce();
    expect(sendMock.mock.calls[0]?.[2]).toMatchObject({
      blocks: [
        expect.objectContaining({ type: "section" }),
        expect.objectContaining({
          type: "actions",
          elements: [
            expect.objectContaining({
              action_id: "openclaw:reply_button:1:1",
              style: "primary",
              value: "approve",
            }),
          ],
        }),
      ],
    });
  });

  it("rejects replies when merged Slack blocks exceed the platform limit", async () => {
    sendMock.mockResolvedValue(undefined);

    await expect(
      deliverReplies(
        baseParams({
          replies: [
            {
              text: "Choose",
              channelData: {
                slack: {
                  blocks: Array.from({ length: 50 }, () => ({ type: "divider" })),
                },
              },
              interactive: {
                blocks: [{ type: "buttons", buttons: [{ label: "Retry", value: "retry" }] }],
              },
            },
          ],
        }),
      ),
    ).rejects.toThrow(/Slack blocks cannot exceed 50 items/i);
  });
});

describe("resolveSlackThreadTs fallback classification", () => {
  const threadTs = "1234567890.123456";
  const messageTs = "9999999999.999999";

  it("keeps legacy thread-stickiness for genuine replies when callers omit isThreadReply", () => {
    expect(
      resolveSlackThreadTs({
        replyToMode: "off",
        incomingThreadTs: threadTs,
        messageTs,
        hasReplied: false,
      }),
    ).toBe(threadTs);
  });

  it("respects replyToMode for auto-created top-level thread_ts when callers omit isThreadReply", () => {
    expect(
      resolveSlackThreadTs({
        replyToMode: "off",
        incomingThreadTs: messageTs,
        messageTs,
        hasReplied: false,
      }),
    ).toBeUndefined();

    expect(
      resolveSlackThreadTs({
        replyToMode: "first",
        incomingThreadTs: messageTs,
        messageTs,
        hasReplied: false,
      }),
    ).toBe(messageTs);

    expect(
      resolveSlackThreadTs({
        replyToMode: "batched",
        incomingThreadTs: messageTs,
        messageTs,
        hasReplied: true,
      }),
    ).toBeUndefined();
  });
});

describe("deliverSlackSlashReplies chunking", () => {
  it("keeps a 4205-character reply in a single slash response by default", async () => {
    const respond = vi.fn(async () => undefined);
    const text = "a".repeat(4205);

    await deliverSlackSlashReplies({
      replies: [{ text }],
      respond,
      ephemeral: true,
      textLimit: 8000,
    });

    expect(respond).toHaveBeenCalledTimes(1);
    expect(respond).toHaveBeenCalledWith({
      text,
      response_type: "ephemeral",
    });
  });
});

describe("resolveSlackReplyBlocks", () => {
  it("returns undefined when no blocks or interactive present", () => {
    expect(resolveSlackReplyBlocks({ text: "hello" })).toBeUndefined();
  });

  it("returns channelData.slack.blocks when present", () => {
    const blocks = [{ type: "divider" }];
    const result = resolveSlackReplyBlocks({
      text: "hi",
      channelData: { slack: { blocks } },
    });
    expect(result).toEqual(blocks);
  });

  it("renders interactive blocks from [[slack_buttons:]] directives", () => {
    const result = resolveSlackReplyBlocks({
      text: "Choose:",
      interactive: {
        blocks: [
          { type: "text", text: "Choose:" },
          {
            type: "buttons",
            buttons: [
              { label: "Approve", value: "approve" },
              { label: "Reject", value: "reject" },
            ],
          },
        ],
      },
    });
    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
    expect(result![0]).toMatchObject({ type: "section" });
    expect(result![1]).toMatchObject({ type: "actions" });
  });

  it("merges channelData.slack.blocks and interactive blocks", () => {
    const existing = [{ type: "divider" }];
    const result = resolveSlackReplyBlocks({
      text: "hi",
      channelData: { slack: { blocks: existing } },
      interactive: {
        blocks: [{ type: "buttons", buttons: [{ label: "Go", value: "go" }] }],
      },
    });
    expect(result).toBeDefined();
    expect(result!.length).toBeGreaterThan(1);
    expect(result![0]).toMatchObject({ type: "divider" });
    expect(result![result!.length - 1]).toMatchObject({ type: "actions" });
  });
});

describe("deliverReplies interactive blocks", () => {
  beforeEach(() => {
    sendMock.mockReset();
    sendMock.mockResolvedValue({ messageId: "ts-1", channelId: "C123" });
  });

  it("delivers interactive reply blocks (from [[slack_buttons:]] directive) to sendMessageSlack", async () => {
    await deliverReplies(
      baseParams({
        replies: [
          {
            text: "Choose an action",
            interactive: {
              blocks: [
                { type: "text", text: "Choose an action" },
                {
                  type: "buttons",
                  buttons: [
                    { label: "Approve", value: "approve" },
                    { label: "Reject", value: "reject" },
                  ],
                },
              ],
            },
          },
        ],
      }),
    );

    expect(sendMock).toHaveBeenCalledOnce();
    expect(sendMock).toHaveBeenCalledWith(
      "C123",
      "Choose an action",
      expect.objectContaining({
        blocks: expect.arrayContaining([
          expect.objectContaining({ type: "section" }),
          expect.objectContaining({ type: "actions" }),
        ]),
      }),
    );
  });

  it("skips delivery when interactive blocks are empty and text is empty", async () => {
    await deliverReplies(
      baseParams({
        replies: [
          {
            text: "",
            interactive: { blocks: [] },
          },
        ],
      }),
    );
    expect(sendMock).not.toHaveBeenCalled();
  });
});
