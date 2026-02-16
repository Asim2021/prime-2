import { mapValues } from "lodash-es";
import { AES, enc} from "crypto-js";

const secretKey = import.meta.env.VITE_ENCRYPTION_SECRET; ; // Your encryption/decryption key

// Encrypt function
export const encrypt = (text: string) => {
  return AES.encrypt(text, secretKey).toString();
};

// Decrypt function
export const decrypt = (encryptedText : string) => {
  const bytes = AES.decrypt(encryptedText, secretKey);
  return bytes.toString(enc.Utf8);
};

export const encryptPayload = ({ payload }: Record<string, any>) =>
  mapValues(payload, (value : any) => encrypt(value));

export const decryptPayload = ({ payload }: Record<string, any>) =>
  mapValues(payload, (value : any) => decrypt(value));

