import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();
vi.mock("../send.js", () => ({
  sendMessageSlack: (...args: unknown[]) => sendMock(...args),
}));

import { deliverReplies, deliverSlackSlashReplies, resolveSlackReplyBlocks } from "./replies.js";

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
