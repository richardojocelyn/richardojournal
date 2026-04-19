export default function handler(req, res) {
    if (req.method === 'POST') {
        console.log("Notifikasi masuk dari Midtrans:", req.body);
        return res.status(200).json({ status: 'OK' });
    }
    // Jika dibuka lewat browser (GET)
    return res.status(200).send("Pintu sudah aktif, tinggal nunggu kiriman dari Midtrans!");
}