// api/checkout.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // AUTHENTICATION: Server Key lu (Ambil dari Dashboard Midtrans Sandbox)
    // Ganti kata 'SERVER_KEY_LU' dengan Server Key Sandbox asli
    const serverKey = 'SERVER_KEY_LU_DI_SINI';
    const authString = Buffer.from(serverKey + ':').toString('base64');

    // Data Transaksi
    const payload = {
        transaction_details: {
            order_id: 'RJ-' + Math.floor(Math.random() * 1000000), // ID unik tiap order
            gross_amount: 50000 // Harga Lisensi
        },
        credit_card: { secure: true },
        // Lu bisa nambahin customer detail di sini nanti
    };

    try {
        const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${authString}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return res.status(200).json(data); // Kirim Snap Token ke Frontend
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}