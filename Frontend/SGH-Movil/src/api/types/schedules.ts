export interface ScheduleHistory {
  id: number;
  executedBy: string;
  executedAt: string; // ISO string
  status: 'RUNNING' | 'SUCCESS' | 'FAILED';
  totalGenerated: number;
  message: string;
  periodStart: string;
  periodEnd: string;
  dryRun: boolean;
  force: boolean;
  params: string;
}
