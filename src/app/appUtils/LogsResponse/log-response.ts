export interface LogResponse {
  logId: number;
  activity: string;
  logType: string;
  timestamp: Date;
  ipAddress: string;
  operatingSystem: string;
  deviceName: string;
  deviceType: string;
  userAgent: string;
}
