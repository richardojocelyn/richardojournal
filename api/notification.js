export default async function handler(req, res) {
    // 1. Kalau lu ngetes buka link ini di browser (Jalur GET)
    if (req.method === 'GET') {
        return res.status(200).send("GACOR CAD! PINTU UDAH KEBUKA DAN SIAP NERIMA MIDTRANS!");
    }

    // 2. Kalau Midtrans ngirim laporan pembayaran (Jalur POST)
    if (req.method === 'POST') {
        console.log("🔥 ADA YANG BAYAR NIH CAD! Data:", req.body);
        return res.status(200).json({ status: 'OK', message: 'Notif aman diterima' });
    }

    // Kalau ada yang nyoba-nyoba jalur lain
    return res.status(405).json({ message: "Jalur kaga diizinin" });
}