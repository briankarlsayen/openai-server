import { Router } from 'express';

import email from './email.router';
import auth from './auth.router';
import encryption from './encryption.router';

const router = Router();

router.use('/auth', auth);
router.use('/email', email);
router.use('/encryption', encryption);

export default router;
