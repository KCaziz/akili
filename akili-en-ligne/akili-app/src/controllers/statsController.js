import { prisma } from "../config/prisma.js";

const MONTHS = 12;

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export async function getStats(req, res, next) {
  try {
    const now = new Date();
    const since = new Date(now.getFullYear(), now.getMonth() - (MONTHS - 1), 1);

    const [requests, offers, topViewed, productCount, requestsPending, offersPending, activeAlerts] = await Promise.all([
      prisma.clientRequest.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      prisma.sellOffer.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      prisma.product.findMany({
        orderBy: { views: "desc" },
        take: 5,
        select: { id: true, title: true, city: true, views: true },
      }),
      prisma.product.count(),
      prisma.clientRequest.count({ where: { status: "EN_ATTENTE" } }),
      prisma.sellOffer.count({ where: { status: "EN_ATTENTE" } }),
      prisma.searchAlert.count({ where: { isActive: true } }),
    ]);

    const buckets = new Map();
    for (let i = 0; i < MONTHS; i += 1) {
      const date = new Date(since.getFullYear(), since.getMonth() + i, 1);
      buckets.set(monthKey(date), { month: monthKey(date), requests: 0, offers: 0 });
    }
    for (const { createdAt } of requests) buckets.get(monthKey(createdAt)).requests += 1;
    for (const { createdAt } of offers) buckets.get(monthKey(createdAt)).offers += 1;

    res.json({
      monthly: [...buckets.values()],
      topViewed,
      totals: { products: productCount, requestsPending, offersPending, activeAlerts },
    });
  } catch (err) {
    next(err);
  }
}
