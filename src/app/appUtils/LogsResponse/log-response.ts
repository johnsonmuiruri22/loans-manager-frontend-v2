export interface LogResponse {
  logId: number;
  username: string;
  activity: string;
  logType: string;
  timestamp: Date;
  ipAddress: string;
  operatingSystem: string;
  deviceName: string;
  deviceType: string;
  userAgent: string;
}
