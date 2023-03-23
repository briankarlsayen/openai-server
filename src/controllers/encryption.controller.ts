import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { decrypt, encrypt } from '../../utils/encryption';

const keyGenerator = () => {
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 520,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: '',
    },
  });
  return keyPair;
};

export const generateKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    // const { privateKey, publicKey } = keyGenerator();

    const pubKey = Buffer.from(publicKey)
      .toString('base64')
      .replace(/(\r\n|\n|\r)/gm, '');
    const priKey = Buffer.from(privateKey)
      .toString('base64')
      .replace(/(\r\n|\n|\r)/gm, '');

    console.log('haha');
    res.status(200).json({ publicKey: pubKey, privateKey: priKey });
  } catch (error) {
    next(error);
  }
};

export const encryptData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pubKey, data, type } = req.body;
  try {
    // const type = 'RSA';
    const result = encrypt({ data, key: pubKey, type });
    res.status(200).json({ encryptedData: result });
  } catch (error) {
    next(error);
  }
};

export const decryptData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { privKey, data, type } = req.body;
  try {
    const result = decrypt({ data, key: privKey, type });
    res.status(200).json({ decryptedData: result });
  } catch (error) {
    next(error);
  }
};
