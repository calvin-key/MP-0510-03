import { prisma } from "../../lib/prisma";

export const getReviewableEventsService = async (userId: number) => {
    try {
      const now = new Date();
      
      const reviewableEvents = await prisma.event.findMany({
        where: {
          endDate: {
            lt: now
          },
          ticketTypes: {
            some: {
              transactions: {
                some: {
                  userId,
                  status: 'done'
                }
              }
            }
          }
        },
        include: {
          reviews: {
            where: {
              userId
            }
          }
        }
      });
  
      return reviewableEvents;
    } catch (error) {
      throw error;
    }
  };
  