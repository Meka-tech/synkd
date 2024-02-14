import Dexie, { Table } from "dexie";
import { ImsgType } from "../types/messageType";

export class MySubClassedDexie extends Dexie {
  messages!: Table<ImsgType>;

  constructor() {
    super("messageDatabase");
    this.version(2).stores({
      messages:
        "++_id, text, user , partner , room ,readStatus, createdAt , updatedAt " // Primary key and indexed props
    });

    this.messages = this.table("messages");
  }
}

export const MessageDb = new MySubClassedDexie();

// Add a hook to periodically clean up expired documents
MessageDb.on("populate", async () => {
  const expirationTime = Date.now() - 7 * 24 * 60 * 60 * 1000; // One week ago
  await MessageDb.messages.where("updatedAt").below(expirationTime).delete();
});
