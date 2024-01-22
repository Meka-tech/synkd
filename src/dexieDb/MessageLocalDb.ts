import Dexie, { Table } from "dexie";
import { ImsgType } from "../types/messageType";

export class MySubClassedDexie extends Dexie {
  messages!: Table<ImsgType>;

  constructor() {
    super("myDatabase");
    this.version(2).stores({
      messages:
        "++_id, text, user , partner , room ,readStatus, createdAt , updatedAt " // Primary key and indexed props
    });
  }
}

export const MessageDb = new MySubClassedDexie();
