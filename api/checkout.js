const admin = require('firebase-admin');

// 1. Inisialisasi Firebase (Taruh di paling atas biar stabil)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
        }),
    });
}

const db = admin.firestore();

// 2. Fungsi buat ngerampok 1 Lisensi dari Firebase
async function getLicenseFromFirebase() {
    const licensesRef = db.collection('licenses');
    const snapshot = await licensesRef.where('status', '==', 'AVAILABLE').limit(1).get();

    if (snapshot.empty) {
        throw new Error('STOK_HABIS');
    }

    const doc = snapshot.docs[0];
    const key = doc.id; // Kode lisensinya (misal: RICAD-VIP-001)

    // Langsung kunci jadi SOLD biar gak direbut orang lain
    await doc.ref.update({ status: 'ACTIVE' });

    return key;
}

// 3. FUNGSI UTAMA HANDLER
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send("Method Not Allowed");

    const { email } = req.body; // Nangkep email dari frontend
    if (!email) return res.status(400).json({ error: "Email wajib diisi" });

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const authString = Buffer.from(serverKey + ':').toString('base64');

    try {
        // A. Ambil Key dari Firebase DULU sebelum bikin tagihan
        const licenseKey = await getLicenseFromFirebase();
        console.log(`Berhasil narik key: ${licenseKey} buat email: ${email}`);

        // B. Bikin transaksi Midtrans
        const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authString}`
            },
            body: JSON.stringify({
                transaction_details: {
                    order_id: 'RJ-' + Date.now(),
                    gross_amount: 25000
                },
                customer_details: { email: email },
                // TITIPIN DATA KE MIDTRANS BUAT DIBACA WEBHOOK NANTI
                custom_field1: email,
                custom_field2: licenseKey // <--- KUNCI LISENSINYA MASUK SINI
            })
        });

        const data = await response.json();
        
        // C. Balikin Token Snap ke Frontend biar pop-up muncul
        res.status(200).json(data);

    } catch (error) {
        console.error("Error di Backend:", error);
        if (error.message === 'STOK_HABIS') {
            return res.status(404).json({ error: "Waduh Cad, stok lisensi di Firebase abis!" });
        }
        res.status(500).json({ error: error.message });
    }
}