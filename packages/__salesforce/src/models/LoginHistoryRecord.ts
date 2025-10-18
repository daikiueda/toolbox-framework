export type LoginHistoryRecord = {
  Id: string;
  LoginTime: string;
  Status: string;
  Browser: string | null;
  Platform: string | null;
  SourceIp: string | null;
};
