import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Hanya nerima laporan (POST)!" });

    const data = req.body;

    if (data.transaction_status === 'settlement' || data.transaction_status === 'capture') {
        const orderId = data.order_id;
        
        // AMBIL EMAIL DARI CUSTOM FIELD 1 (Dijamin 100% dapet)
        const emailPembeli = data.custom_field1; 

        if (emailPembeli) {
            const angkaOrder = orderId.replace('RJ-', '');
            const licenseKey = "PRO-" + angkaOrder + "-GACOR";

            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: 465,
                secure: true, 
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
                tls: {
                    rejectUnauthorized: false 
                }
            });

            const mailOptions = {
                from: '"Richardo Journal" <support@richardojournal.com>',
                to: emailPembeli,
                subject: '✅ Lisensi Richardo Journal Lo Udah Aktif!',
                html: `
                    <h2>Halo bro! Thanks udah support Richardo Journal.</h2>
                    <p>Pembayaran lo udah kami terima. Berikut adalah akses Lisensi VIP lo:</p>
                    <div style="background: #1e293b; color: #38bdf8; padding: 15px; border-radius: 8px; font-size: 20px; font-weight: bold; width: fit-content; border: 1px dashed #38bdf8;">
                        ${licenseKey}
                    </div>
                    <br>
                    <h3>Panduan Penggunaan:</h3>
                    <ul>
                        <li>Simpan kode ini baik-baik, jangan disebar.</li>
                        <li>Kode ini aktif selamanya.</li>
                    </ul>
                    <p>Salam Gacor,<br><b>CEO Richardo Journal</b></p>
                `
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log("🔥 EMAIL LISENSI SUKSES DIKIRIM KE:", emailPembeli);
            } catch (error) {
                console.error("❌ Gagal ngirim email. Cek Password/Host di Vercel!", error);
            }
        } else {
            console.log("Email pembeli ga nemu nih dari Midtrans.");
        }
    }

    res.status(200).json({ status: 'success' });
}