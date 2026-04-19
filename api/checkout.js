export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Harus POST" });

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const { email } = req.body; 

    if (!serverKey) return res.status(500).json({ error: "Server Key kaga ada!" });

    const authString = Buffer.from(serverKey + ':').toString('base64');

    try {
        const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${authString}`
            },
            body: JSON.stringify({
                transaction_details: {
                    order_id: 'RJ-' + Date.now(),
                    gross_amount: 25000
                },
                customer_details: {
                    email: email 
                },
                // INI TRIKNYA: Titip email di brankas anti-hilang Midtrans
                custom_field1: email, 
                enabled_payments: ["qris", "bank_transfer"]
            })
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}