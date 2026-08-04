export type AIRAMessageType = "notice" | "report" | "answer" | "chat";

export interface AIRAMessage {
  id: string;
  sender: "user" | "aira";
  text: string;
  timestamp: Date;
  type?: AIRAMessageType;
}

export interface AIRAChatResponse {
  response: string;
}

export interface AIRADefeatResponse {
  diagnosis: string;
}

export interface AIRADailyReportResponse {
  report: string;
}
