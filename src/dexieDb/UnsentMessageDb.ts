import { IUmsgType } from "@/types/unsentMessageType";
import Dexie, { Table } from "dexie";

export class UnSentMessageDexie extends Dexie {
  unsentmessages!: Table<IUmsgType>;

  constructor() {
    super("unsentMessageDatabase");
    this.version(1).stores({
      unsentmessages: "++id, room, text, uuid , userId , partnerId"
    });
  }
}

export const UnsentMessageDb = new UnSentMessageDexie();
