import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { paymentQueries } from '../models/queries.ts';
import { validateBody } from '../middleware/validation.ts';
import { asyncHandler } from '../middleware/errorHandler.ts';

const router = Router();

const createPaymentSchema = z.object({
    paymentNo: z.string().optional(),
    paymentDate: z.string(),
    partyName: z.string().min(1),
    partyType: z.enum(["Customer", "Supplier"]).optional(),
    amount: z.coerce.number().positive(),
    paymentMode: z.enum(["Cash", "Bank", "UPI", "Cheque"]),
    reference: z.string().optional(),
    notes: z.string().optional(),
    paymentDirection: z.enum(["In", "Out"]),
    dealId: z.coerce.number().optional().nullable(),
});

// GET all payments
router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const payments = await paymentQueries.getAll(limit, offset);
    res.json(payments);
}));

// GET payment by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
    const payment = await paymentQueries.getById(String(req.params.id));
    res.json(payment);
}));

// POST create payment
router.post('/', validateBody(createPaymentSchema), asyncHandler(async (req: Request, res: Response) => {
    const payment = await paymentQueries.create(req.body);
    res.status(201).json(payment);
}));

// PUT update payment
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
    const payment = await paymentQueries.update(String(req.params.id), req.body);
    res.json(payment);
}));

// DELETE payment
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
    const result = await paymentQueries.delete(String(req.params.id));
    res.json(result);
}));

export default router;
