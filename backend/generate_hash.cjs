const bcrypt = require('bcryptjs');

// IMPORTANT: Choose a secure, temporary password here
const rawPassword = '123456'; 

// Generate the hash
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(rawPassword, salt);

console.log("-----------------------------------------");
console.log("RAW PASSWORD: ", rawPassword);
console.log("PASTE THIS HASH INTO THE DATABASE:");
console.log(hash);
console.log("-----------------------------------------");