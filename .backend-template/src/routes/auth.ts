import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validation.ts';
import { asyncHandler } from '../middleware/errorHandler.ts';
import { generateToken } from '../middleware/auth.ts';
import { ApiError } from '../middleware/errorHandler.ts';

import bcrypt from 'bcryptjs';
import { userQueries } from '../models/queries.ts';

const router = Router();

const loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
});

// LOGIN endpoint
router.post('/login', validateBody(loginSchema), asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await userQueries.getByUsername(username);
    if (user && user.passwordHash) {
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (isValid) {
            const token = generateToken(String(user.userId), user.userName, user.role || 'admin');
            return res.json({
                success: true,
                token,
                user: {
                    id: String(user.userId),
                    username: user.userName,
                    role: user.role || 'admin'
                }
            });
        }
    }

    throw new ApiError(401, 'Invalid credentials');
}));

// LOGOUT endpoint
router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
    // Logout is handled on the frontend by removing the token
    res.json({ success: true, message: 'Logged out successfully' });
}));

// GET current user (requires token)
router.get('/me', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json(req.user);
});

export default router;
