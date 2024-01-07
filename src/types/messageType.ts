import { IUserType } from "./userType";

export interface ImsgType {
  text: string;
  user: IUserType;
  partner: IUserType;
  room: string;
  readStatus:boolean;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}
