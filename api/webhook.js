import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Hanya nerima laporan (POST)!" });

    const data = req.body;

    // Kalo statusnya "settlement" atau "capture" (artinya LUNAS)
    if (data.transaction_status === 'settlement' || data.transaction_status === 'capture') {
        const orderId = data.order_id;
        
        // Midtrans balikin email user yang tadi kita titipin
        const emailPembeli = data.customer_details ? data.customer_details.email : null; 

        if (emailPembeli) {
            // 1. Racik Lisensi Unik
            const angkaOrder = orderId.replace('RJ-', '');
            const licenseKey = "PRO-" + angkaOrder + "-GACOR";

            // 2. Setup Mesin Pengirim Email (Nodemailer)
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: 465,
                secure: true, // Pake SSL
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
                // Tambahin ini biar gak kena blokir firewall hosting
                tls: {
                    rejectUnauthorized: false 
                }
            });

            // 3. Desain Isi Emailnya
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

            // 4. Kirim Emailnya!
            try {
                await transporter.sendMail(mailOptions);
                console.log("🔥 EMAIL LISENSI SUKSES DIKIRIM KE:", emailPembeli);
            } catch (error) {
                console.error("❌ Gagal ngirim email:", error);
            }
        }
    }

    // Selalu kasih respon 200 OK ke Midtrans biar dia tenang
    res.status(200).json({ status: 'success' });
}