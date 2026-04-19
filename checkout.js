// api/checkout.js
export default async function handler(req, res) {
    // Tambahin header biar bisa diakses dari frontend mana aja (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Gunakan method POST, Cad!' });
    }

    // --- PASTIIN INI UDAH LU GANTI PAKE SERVER KEY SANDBOX ASLI ---
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    
    const authString = Buffer.from(serverKey + ':').toString('base64');

    const payload = {
        transaction_details: {
            order_id: 'RJ-' + Date.now(), // Pake timestamp biar ID-nya gak bakal duplikat
            gross_amount: 50000
        },
        credit_card: { secure: true }
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
        
        // Kalau Midtrans kasih error (misal Key salah), kirim pesannya ke kita
        if (!response.ok) {
            return res.status(response.status).json({ errorFromMidtrans: data });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}