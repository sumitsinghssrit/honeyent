import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { expenseQueries } from '../models/queries.ts';
import { validateBody } from '../middleware/validation.ts';
import { asyncHandler } from '../middleware/errorHandler.ts';

const router = Router();

const EXPENSE_CATEGORIES = [
    "Driver Salary",
    "Truck Repair",
    "Truck Maintenance",
    "Diesel / Fuel",
    "Tyre",
    "Toll / Parking",
    "Insurance / Permit",
    "Office / Admin",
    "Loading / Labour",
    "Other"
];

const idOrName = z.union([z.coerce.number(), z.string().min(1)]);

const createExpenseSchema = z.object({
    expenseNo: z.string().optional(),
    expenseDate: z.string(),
    category: z.enum(EXPENSE_CATEGORIES as [string, ...string[]]),
    vehicleId: idOrName.optional(),
    vehicle: z.string().optional(),
    driverId: idOrName.optional(),
    driver: z.string().optional(),
    paidTo: z.string().min(1),
    paymentMode: z.enum(["Cash", "Bank", "UPI", "Cheque"]),
    amount: z.coerce.number().positive(),
    remarks: z.string().optional(),
});

// GET all expenses
router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const expenses = await expenseQueries.getAll(limit, offset);
    res.json(expenses);
}));

// GET expense by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
    const expense = await expenseQueries.getById(String(req.params.id));
    res.json(expense);
}));

// POST create expense
router.post('/', validateBody(createExpenseSchema), asyncHandler(async (req: Request, res: Response) => {
    const expense = await expenseQueries.create(req.body);
    res.status(201).json(expense);
}));

// PUT update expense
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
    const expense = await expenseQueries.update(String(req.params.id), req.body);
    res.json(expense);
}));

// DELETE expense
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
    const result = await expenseQueries.delete(String(req.params.id));
    res.json(result);
}));

export default router;
