import crypto from 'crypto';
import { env } from '../config/env';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit nonce recommended for GCM
const TAG_LENGTH = 16;

/**
 * Returns the encryption key Buffer for the given version.
 * Keys are stored as 64-char hex strings in env vars.
 */
function getKey(version: number): Buffer {
    const keyMap: Record<number, string | undefined> = {
        1: env.MESSAGE_ENCRYPTION_KEY_V1,
    };

    const hex = keyMap[version];
    if (!hex) {
        throw new Error(`Encryption key version ${version} not configured`);
    }

    const buf = Buffer.from(hex, 'hex');
    if (buf.length !== 32) {
        throw new Error(
            `Encryption key v${version} must be 32 bytes (64 hex chars), got ${buf.length}`
        );
    }
    return buf;
}

export interface EncryptedPayload {
    ciphertext: string; // base64
    nonce: string;      // base64
    authTag: string;    // base64
    keyVersion: number;
}

/**
 * Encrypt plaintext using AES-256-GCM.
 */
export function encryptMessage(plaintext: string): EncryptedPayload {
    const keyVersion = env.MESSAGE_ENCRYPTION_KEY_VERSION;
    const key = getKey(keyVersion);
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
        authTagLength: TAG_LENGTH,
    });

    const encrypted = Buffer.concat([
        cipher.update(plaintext, 'utf8'),
        cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return {
        ciphertext: encrypted.toString('base64'),
        nonce: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        keyVersion,
    };
}

/**
 * Decrypt an encrypted payload back to plaintext.
 */
export function decryptMessage(payload: EncryptedPayload): string {
    const key = getKey(payload.keyVersion);
    const iv = Buffer.from(payload.nonce, 'base64');
    const tag = Buffer.from(payload.authTag, 'base64');
    const ciphertext = Buffer.from(payload.ciphertext, 'base64');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
        authTagLength: TAG_LENGTH,
    });
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final(),
    ]);

    return decrypted.toString('utf8');
}
