export default async function handler(req, res) {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    if (!serverKey) {
        return res.status(500).json({ error: "Server Key kaga ada di Vercel, Cad!" });
    }

    // Auth string Midtrans: ServerKey + ":" di-encode ke Base64
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
                    gross_amount: 50000
                },
                credit_card: { secure: true }
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            // INI PENTING: Liat pesan error dari Midtrans di console Vercel
            console.log("Midtrans Ngamuk:", data); 
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}