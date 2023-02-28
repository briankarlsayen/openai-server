import { Router } from 'express';

import email from './email.router';
import auth from './auth.router';

const router = Router();

router.use('/auth', auth);
router.use('/email', email);

export default router;
