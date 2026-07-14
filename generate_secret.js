// generate_secret.js
// PASTE JWT SECRET DARI SUPABASE DI DALAM TANDA KUTIP DI BAWAH INI:
const supabaseJwtSecret = "t3W0pe8NBCOxHmP58t+7W+Wys3EBBjVW1AYch8Y+pjKQcw2Ji5y+U3epuxr8jd3xHN9tymjjaTwWeeyV7jItUQ==";

console.log("\n========================================");
console.log("SUPABASE JWT SECRET ENCODING UTILITY");
console.log("========================================\n");

// 1. Jika Supabase JWT Secret Anda diakhiri dengan '==' (merupakan Base64 string):
// Ini adalah opsi yang standard untuk project Supabase baru/sedang berjalan.
const correctDecodedSecret = Buffer.from(supabaseJwtSecret, 'base64').toString('base64url');
console.log("👉 OPSI A: Base64 Decoded -> Base64URL (Gunakan ini jika secret Supabase Anda adalah Base64 / berakhiran ==):");
console.log(correctDecodedSecret);
console.log("\n----------------------------------------\n");

// 2. Jika Supabase JWT Secret Anda adalah string teks biasa (Plain UTF-8 string):
const utf8Secret = Buffer.from(supabaseJwtSecret).toString('base64url');
console.log("👉 OPSI B: Literal UTF-8 -> Base64URL (Gunakan ini HANYA jika secret Supabase Anda adalah string teks biasa tanpa encoding):");
console.log(utf8Secret);
console.log("\n========================================\n");