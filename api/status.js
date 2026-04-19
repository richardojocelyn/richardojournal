export default async function handler(req, res) {
    // Tangkap order_id dari URL
    const { order } = req.query;
    if (!order) return res.status(400).json({ error: "Order ID ga ketemu" });

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const authString = Buffer.from(serverKey + ':').toString('base64');

    try {
        // Nanya langsung ke database Midtrans
        const response = await fetch(`https://api.sandbox.midtrans.com/v2/${order}/status`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Accept': 'application/json'
            }
        });
        
        const data = await response.json();

        // Cek apakah beneran lunas (settlement)
        if (data.transaction_status === 'settlement' || data.transaction_status === 'capture') {
            // custom_field2 adalah tempat kita nitipin Key Firebase di checkout.js
            res.status(200).json({ licenseKey: data.custom_field2 });
        } else {
            res.status(400).json({ error: "Transaksi belum lunas atau gagal!" });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}