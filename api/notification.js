// api/notification.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const notification = req.body;

    // Ambil data penting dari notifikasi Midtrans
    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    console.log(`Ada kabar dari Midtrans! Order ID: ${orderId}, Status: ${transactionStatus}`);

    // LOGIKA PEMBERIAN LISENSI
    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
        if (fraudStatus === 'accept' || !fraudStatus) {
            
            // --- DI SINI TEMPAT LU GENERATE LICENSE ---
            // Contoh: Simpan ke Database (Supabase/Firebase) 
            // atau kirim email otomatis ke pembeli.
            
            console.log(`PEMBAYARAN SUKSES! Generate license buat ${orderId}...`);
            
            return res.status(200).json({ status: 'OK', message: 'License Activated' });
        }
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
        // Logika kalau pembayaran gagal/expired
        console.log(`Transaksi ${orderId} gagal/expired.`);
    }

    return res.status(200).send('OK');
}