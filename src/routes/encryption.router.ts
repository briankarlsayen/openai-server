import { Router } from 'express';
import * as encryptionController from '../controllers/encryption.controller';
const router = Router();

router.post('/generatekey', encryptionController.generateKey);
router.post('/encrypt', encryptionController.encryptData);
router.post('/decrypt', encryptionController.decryptData);

export default router;
