import { Router } from 'express';
import * as emailController from '../controllers/email.controller';
const router = Router();

router.post('/rephrase', emailController.rephrase);
router.post('/generateemail', emailController.generateEmail);
router.post('/sendmsg', emailController.sendMail);

export default router;
