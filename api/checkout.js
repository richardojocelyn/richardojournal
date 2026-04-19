export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send("Method Not Allowed");

    const { email } = req.body; // Nangkep email dari script.js
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const authString = Buffer.from(serverKey + ':').toString('base64');

    try {
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
                // Simpen di sini
                customer_details: { email: email },
                // DAN PAKSA SIMPEN DI SINI (Buat dibaca webhook)
                custom_field1: email 
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}