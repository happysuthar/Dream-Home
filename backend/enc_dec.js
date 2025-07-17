const crypto = require("crypto");
const algorithm = 'aes-256-cbc';  // Make sure the algorithm name matches exactly

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const data = `{
"title": "Sample Title",
"content": "Sample Content",
"tags": "sample Tags"
}`;

const encrypted = encrypt(data);
const decrypdte = decrypt('048b4b7b37456608e8b9a43c8209402f');
console.log('Encrypted:', encrypted);
console.log('Decrypted:', decrypted);
