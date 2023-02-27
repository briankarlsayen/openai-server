import { Router } from 'express';

import email from './email.router';

const router = Router();

router.use('/email', email);

export default router;
