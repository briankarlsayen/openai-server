import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { decrypt, encrypt } from '../../utils/encryption';

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

const typeList = ['RSA', 'AES'];

export const encryptData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pubKey, data, type } = req.body;
  try {
    // if (!typeList.includes(type))
    //   return res.status(422).json({ message: 'Invalid encryption type' });
    const result = encrypt({ data, key: pubKey, type });
    if ((<Error>result).message) {
      return res.status(200).json({ result: (<Error>result).message });
    }
    res.status(200).json({ encryptedData: result });
  } catch (error) {
    console.log('error', error);
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
    if (!typeList.includes(type))
      return res.status(422).json({ message: 'Invalid encryption type' });
    const result = decrypt({ data, key: privKey, type });
    res.status(200).json({ decryptedData: result });
  } catch (error) {
    next(error);
  }
};
