export default async function handler(req, res) {
    if (req.method === 'GET') {
        return res.status(200).send("WEBHOOK GACOR CAD! PINTU BARU UDAH DIBUKA!");
    }

    if (req.method === 'POST') {
        console.log("🔥 ADA YANG BAYAR NIH CAD! Data:", req.body);
        return res.status(200).json({ status: 'OK', message: 'Notif aman diterima di pintu baru' });
    }

    return res.status(405).json({ message: "Jalur kaga diizinin" });
}