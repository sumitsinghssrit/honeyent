import { Router } from 'express';
import { z } from 'zod';
import { companyProfileQueries } from '../models/queries.ts';
import { validateBody } from '../middleware/validation.ts';
import { asyncHandler } from '../middleware/errorHandler.ts';

const router = Router();

const companyProfileSchema = z.object({
    name: z.string().min(1),
    tagline: z.string().optional().nullable(),
    gstin: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    logoText: z.string().optional().nullable(),
    ownerName: z.string().optional().nullable(),
    ownerPhone: z.string().optional().nullable(),
    ownerEmail: z.string().optional().nullable(),
    bank: z.string().optional().nullable(),
    upi: z.string().optional().nullable(),
    financialYear: z.string().optional().nullable(),
});

// Helper to map DB camelized fields to exact frontend CompanyProfile structure
const mapToFrontend = (row: any) => {
    if (!row) return null;
    return {
        name: row.name,
        tagline: row.tagline,
        gstin: row.gst,
        address: row.address,
        city: row.city,
        state: row.state,
        phone: row.phone,
        email: row.email,
        logoText: row.logoText,
        ownerName: row.ownerName,
        ownerPhone: row.ownerPhone,
        ownerEmail: row.ownerEmail,
        bank: row.bankDetails,
        upi: row.upiId,
        financialYear: row.financialYear
    };
};

router.get('/', asyncHandler(async (req, res) => {
    const profile = await companyProfileQueries.get();
    res.json(mapToFrontend(profile));
}));

router.post('/', validateBody(companyProfileSchema), asyncHandler(async (req, res) => {
    const profile = await companyProfileQueries.update(req.body);
    res.json(mapToFrontend(profile));
}));

export default router;
