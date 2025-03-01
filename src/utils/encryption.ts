import CryptoJS from 'crypto-js';

export const encrypt = (text: string, masterKey: string): string => {
  return CryptoJS.AES.encrypt(text, masterKey).toString();
};

export const decrypt = (ciphertext: string, masterKey: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, masterKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const generatePassword = (
  length: number = 16,
  options: {
    includeUppercase?: boolean;
    includeLowercase?: boolean;
    includeNumbers?: boolean;
    includeSymbols?: boolean;
  } = {
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  }
): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let chars = '';
  if (options.includeUppercase) chars += uppercase;
  if (options.includeLowercase) chars += lowercase;
  if (options.includeNumbers) chars += numbers;
  if (options.includeSymbols) chars += symbols;

  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
};