import type { Request, Response } from "express";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/index.js";
import { datasetRecords } from "../db/schema.js";

const paramsSchema = z.string().uuid();

const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().default(""),
});

export const getDatasetRecords = async (
    req: Request,
    res: Response
) => {
    try {
        const datasetId = paramsSchema.safeParse(req.params.datasetId);
        const query = querySchema.safeParse(req.query);

        if (!datasetId.success || !query.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid dataset ID or pagination parameters",
            });
        }

        const { page, limit, search } = query.data;
        const offset = (page - 1) * limit;
        const searchCondition = search ? sql`AND (
      ${datasetRecords.data}->>'customerName' ILIKE ${`%${search}%`}
      OR ${datasetRecords.data}->>'email' ILIKE ${`%${search}%`}
      OR ${datasetRecords.data}->>'country' ILIKE ${`%${search}%`})` : sql``;

        const condition = eq(datasetRecords.datasetId, datasetId.data);

        const [records, countResult] = await Promise.all([
            db
                .select()
                .from(datasetRecords)
                .where(
                    sql`${condition} ${searchCondition}`
                )
                .limit(limit)
                .offset(offset),

            db
                .select({
                    total: sql<number>`count(*)::int`,
                })
                .from(datasetRecords)
                .where(
                    sql`${condition} ${searchCondition}`
                ),
        ]);

        const totalRecords = countResult[0]?.total ?? 0;

        return res.status(200).json({
            success: true,
            data: records,
            pagination: {
                page,
                limit,
                totalRecords,
                totalPages: Math.ceil(totalRecords / limit),
            },
        });
    } catch (error) {
        console.error("Get dataset records error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch dataset records",
        });
    }
};