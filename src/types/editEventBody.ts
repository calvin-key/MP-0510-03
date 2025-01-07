interface EditEventBody {
  name: string;
  description: string;
  address: string;
  specificLocation: string;
  locationId: number;
  startDate: string;
  endDate: string;
  eventCategories: number[]; // Array of category IDs
  ticketTypes: {
    ticketType: string;
    price: number;
    availableSeats: number;
  }[];
  bankAccount?: string;
}
