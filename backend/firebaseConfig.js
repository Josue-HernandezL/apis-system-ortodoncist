import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

const serviceAccount = JSON.parse (
    await readFile(new URL('../serviceAccountKey.json', import.meta.url))
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ortodoncista-system-5c89c-default-rtdb.firebaseio.com"
});

const bd = admin.database();
export default bd;