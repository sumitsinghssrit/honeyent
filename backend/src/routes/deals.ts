import { Router } from 'express';
import { z } from 'zod';
import { dealQueries } from '../models/queries.ts';
import { validateBody } from '../middleware/validation.ts';
import { asyncHandler } from '../middleware/errorHandler.ts';
import { authMiddleware } from '../middleware/auth.ts';

const router = Router();

const idOrName = z.union([z.coerce.number(), z.string().min(1)]);

const confirmWeightSchema = z.object({
    customerWeight: z.coerce.number().positive(),
    reason: z.string().min(1),
    remarks: z.string().optional(),
    approvedBy: z.string().optional(),
});

const createDealSchema = z.object({
    dealNo: z.string().min(1).optional(),
    dealDate: z.string().optional(),
    customerId: idOrName.optional(),
    customer: z.string().min(1).optional(),
    supplierId: idOrName.optional(),
    supplier: z.string().min(1).optional(),
    orderId: z.string().optional(),
    challanId: z.string().optional(),
    weighSlipId: z.string().optional(),
    tripId: z.string().optional(),
    salesInvoiceId: z.string().optional(),
    purchaseInvoiceId: z.string().optional(),
    totalValue: z.coerce.number().nonnegative().optional(),
    status: z.string().optional(),
});

const updateDealSchema = z.object({
    dealNo: z.string().min(1).optional(),
    dealDate: z.string().optional(),
    customerId: idOrName.optional(),
    customer: z.string().min(1).optional(),
    supplierId: idOrName.optional(),
    supplier: z.string().min(1).optional(),
    orderId: z.string().optional(),
    challanId: z.string().optional(),
    weighSlipId: z.string().optional(),
    tripId: z.string().optional(),
    salesInvoiceId: z.string().optional(),
    purchaseInvoiceId: z.string().optional(),
    totalValue: z.coerce.number().nonnegative().optional(),
    status: z.string().optional(),
    cancelled: z.boolean().optional(),
    cancelRemark: z.string().optional(),
    cancelledAt: z.string().optional(),
});

router.get('/', asyncHandler(async (req, res) => {
    const deals = await dealQueries.getAll();
    res.json(deals);
}));



router.get('/:id', asyncHandler(async (req, res) => {
    const deal = await dealQueries.getById(String(req.params.id));
    res.json(deal);
}));


router.post('/:id/confirm-weight', authMiddleware, validateBody(confirmWeightSchema), asyncHandler(async (req: any, res) => {
    const dealId = String(req.params.id);
    const updatedBy = req.user?.username || 'Admin';
    const result = await dealQueries.confirmWeight(dealId, {
        customerWeight: req.body.customerWeight,
        reason: req.body.reason,
        remarks: req.body.remarks,
        approvedBy: req.body.approvedBy,
        updatedBy,
    });
    res.json(result);
}));

router.post('/', validateBody(createDealSchema), asyncHandler(async (req, res) => {
    const deal = await dealQueries.create(req.body);
    res.status(201).json(deal);
}));

router.put('/:id', validateBody(updateDealSchema), asyncHandler(async (req, res) => {
    const deal = await dealQueries.update(String(req.params.id), req.body);
    res.json(deal);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
    const result = await dealQueries.delete(String(req.params.id));
    res.json(result);
}));

export default router;
