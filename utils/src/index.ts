import { EventEmitter as EE } from "events";

import Queue from "bull";
import StrictEventEmitter from "strict-event-emitter-types";
import { setQueues } from "bull-board";
import { MessageType } from "mirai-ts";
import { config } from "@mirai-bot/config";

export type Target = {
  id?: number;
  group?: number;
  temp?: number;
};

export function extractTarget(
  msg: MessageType.ChatMessage,
  explicit = true
): Target {
  switch (msg.type) {
    case "GroupMessage":
      return {
        id: explicit ? msg.sender.id : undefined,
        group: msg.sender.group.id,
      };
    case "TempMessage":
      return {
        id: msg.sender.id,
        temp: msg.sender.group.id,
      };
  }
  return {
    id: msg.sender.id,
  };
}

export const queue = <T = any>(name: string) => {
  const queue = new Queue<T>(name, {
    redis: config.redis,
  });
  setQueues(queue);
  return queue;
};

export type EventEmitter<T> = StrictEventEmitter<EE, T>;
export type EventEmitterClass<T> = { new (): StrictEventEmitter<EE, T> };

export * from "./async";
export * from "./proxy";
export * from "./storage";
export * from "./serialization";
