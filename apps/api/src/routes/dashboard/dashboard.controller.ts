import { Request, Response } from 'express';
import { validate } from '@/middleware/validate';
import { getDashboardSchema } from './dashboard.schema';
import sql from '@/utils/db';
import { getTijuanaDate } from '@/utils/getTijuanaDate';

export async function getDashboard(req: Request, res: Response) {
  const body = validate(getDashboardSchema, req.query, res);
  if (!body) return;

  const today = getTijuanaDate();

  const result = await sql`
  SELECT
    TO_CHAR(g.date, 'DD/MM') as "x",
    CASE
      WHEN SUM(d.goal) > 0 THEN (ROUND(SUM(d.prod)::numeric / SUM(d.goal) * 100, 0))::integer
      ELSE 0
    END AS "y"
  FROM generate_series(
    ${today}::date - INTERVAL '59 days',
    ${today}::date,
    '1 day'
  ) AS g(date)
  LEFT JOIN public.days d ON d.date = g.date
  GROUP BY g.date
  ORDER BY g.date;
`;

  res.send(result);
}
