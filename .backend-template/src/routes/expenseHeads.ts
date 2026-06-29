import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { expenseHeadQueries } from '../models/queries.ts';
import { validateBody } from '../middleware/validation.ts';
import { asyncHandler } from '../middleware/errorHandler.ts';

const router = Router();

const createExpenseHeadSchema = z.object({
    name: z.string().min(1),
    code: z.string().min(1).optional(),
    description: z.string().optional(),
});

router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const heads = await expenseHeadQueries.getAll();
    res.json(heads);
}));

router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
    const head = await expenseHeadQueries.getById(String(req.params.id));
    res.json(head);
}));

router.post('/', validateBody(createExpenseHeadSchema), asyncHandler(async (req: Request, res: Response) => {
    const head = await expenseHeadQueries.create(req.body);
    res.status(201).json(head);
}));

router.put('/:id', validateBody(createExpenseHeadSchema), asyncHandler(async (req: Request, res: Response) => {
    const head = await expenseHeadQueries.update(String(req.params.id), req.body);
    res.json(head);
}));

router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
    const result = await expenseHeadQueries.delete(String(req.params.id));
    res.json(result);
}));

export default router;
