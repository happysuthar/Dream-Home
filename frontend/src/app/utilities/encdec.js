import { createCipheriv, createDecipheriv } from 'crypto';

const IV_STRING = process.env.NEXT_PUBLIC_HASH_IV || '';
const KEY_STRING = process.env.NEXT_PUBLIC_HASH_KEY || '';

const iv = Buffer.from(IV_STRING, 'utf-8');  
const key = Buffer.from(KEY_STRING, 'utf-8'); 


// console.log( KEY_STRING);
// console.log(key);
// console.log(key.length);

// Encrypt function
export function encrypt(request_data) {
    // console.log("Req Data: ", request_data);
    if (!request_data) return '';

    try {
        const data = typeof request_data == 'object' ? JSON.stringify(request_data) : request_data;
        const cipher = createCipheriv('AES-256-CBC', key, iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (error) {
        console.error('Encryption Error:', error);
        return '';
    }
}

// Decrypt function
export function decrypt(request_data) {
    // console.log("Req dec Data: ", request_data);
    try {
        if (!request_data) return {};
        // console.log('Request Data to Decrypt:', request_data);

        const decipher = createDecipheriv('AES-256-CBC', key, iv);
        let decrypted = decipher.update(request_data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return isJson(decrypted) ? JSON.parse(decrypted) : decrypted;
    } catch (error) {
        console.error('Decryption Error:', error);
        return {};
    }
}

function isJson(data) {
    try {
        JSON.parse(data);
        return true;
    } catch {
        return false;
    }
}

export default { encrypt, decrypt };
