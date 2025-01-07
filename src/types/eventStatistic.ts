export interface EventStatistics {
  totalRevenue: number;
  totalTicketsSold: number;
  totalAttendance: number;
  monthlyData: {
    month: string;
    revenue: number;
    tickets: number;
    attendance: number;
  }[];
  eventBreakdown: {
    eventId: number;
    eventName: string;
    revenue: number;
    ticketsSold: number;
  }[];
}
