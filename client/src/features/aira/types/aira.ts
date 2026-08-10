export type AIRAMessageType = "notice" | "report" | "answer" | "chat";

export interface AIRAPendingAction {
  action_type: string;
  action_args: Record<string, any>;
  summary: string;
}

export interface AIRAMessage {
  id: string;
  sender: "user" | "aira";
  text: string;
  timestamp: Date;
  type?: AIRAMessageType;
  mood?: string;
  pendingAction?: AIRAPendingAction;
}

export interface AIRAChatResponse {
  response: string;
  pending_action?: AIRAPendingAction;
}

export interface AIRADefeatResponse {
  diagnosis: string;
}

export interface AIRADailyReportResponse {
  report: string;
}

export interface AIRASystemStatusResponse {
  status: "warning" | "optimal";
  message: string;
}
