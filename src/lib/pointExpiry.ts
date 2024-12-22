import { scheduleJob } from "node-schedule";
import { prisma } from "./prisma";

const expirePoints = async () => {
  try {
    const now = new Date();

    const expiredPoints = await prisma.point.findMany({
      where: {
        expiredAt: { lte: now },
      },
      include: {
        user: true,
      },
    });

    for (const point of expiredPoints) {
      await prisma.$transaction(async (tx) => {
        await tx.point.delete({
          where: {
            id: point.id,
          },
        });

        await tx.user.update({
          where: {
            id: point.userId,
          },
          data: {
            pointsBalance: {
              decrement: point.points,
            },
          },
        });
      });
    }

    console.log(`${expiredPoints.length} expired points have been removed.`);
  } catch (error) {
    console.error("Error in expirePoints:", error);
  }
};
scheduleJob("0 0 * * *", expirePoints);

expirePoints().catch(console.error);

export { expirePoints };
