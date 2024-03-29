import crypto from 'crypto';

interface IEncrpt {
  data: string;
  type: EEncryptType;
  key: string;
}

interface PEncrypt {
  data: string;
  type: EEncryptType;
  key: string;
  convertedKey: string;
}

interface FEncrypt {
  (params: IEncrpt): string | Error;
}

const IV_SIZE = 16;
const KEY_SIZE = 24;

const rsaEncryption = (props: PEncrypt) => {
  try {
    const buffer = Buffer.from(props.data, 'utf8');
    const result = crypto.publicEncrypt(
      {
        key: props.convertedKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      buffer
    );
    return result.toString('base64');
  } catch (err) {
    console.log('Invalid encryption key');
    return '';
  }
};

const rsaDecryption = (props: PEncrypt) => {
  try {
    const buffer = Buffer.from(props.data, 'base64');
    const result = crypto.privateDecrypt(
      {
        key: props.convertedKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      buffer
    );
    return result.toString('utf-8');
  } catch (err) {
    console.log('Invalid decryption key');
    return '';
  }
};

const aesEncryption = (props: IEncrpt) => {
  try {
    let key = crypto.scryptSync(props.key, 'salt', KEY_SIZE);
    let iv = crypto.randomBytes(IV_SIZE);
    var cipher = crypto.createCipheriv('aes192', key, iv);
    var encrypted =
      cipher.update(props.data, 'utf8', 'hex') + cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (err) {
    console.log('Invalid encryption key');
    return '';
  }
};

const aesDecryption = (props: IEncrpt) => {
  try {
    let textParts = props.data.split(':');
    let iv = Buffer.from(textParts[0], 'hex');
    let key = crypto.scryptSync(props.key, 'salt', KEY_SIZE);
    let encryptedText = Buffer.from(textParts[1], 'hex');
    let decipher = crypto.createDecipheriv('aes192', key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    console.log('Invalid decryption key');
    return '';
  }
};

export const encrypt: FEncrypt = (props) => {
  try {
    switch (props.type) {
      case 'RSA':
        const convertedKey = Buffer.from(props.key, 'base64').toString('ascii');
        return rsaEncryption({ ...props, convertedKey });
      case 'AES':
        return aesEncryption(props);
      default:
        return new Error('Invalid encryption type');
    }
  } catch (err) {
    console.log('Encryption failed', err);
    return new Error('Invalid encryption type');
  }
};

export const decrypt: FEncrypt = (props) => {
  try {
    switch (props.type) {
      case 'RSA':
        const convertedKey = Buffer.from(props.key, 'base64').toString('ascii');
        return rsaDecryption({ ...props, convertedKey });
      case 'AES':
        return aesDecryption(props);
      default:
        return new Error('Invalid encryption type');
    }
  } catch (err) {
    console.log('Encryption failed', err);
    return new Error('Invalid encryption type');
  }
};
