import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Hanya menerima laporan (POST)!" });

    const data = req.body;

    // Cek kalau transaksi benar-benar LUNAS
    if (data.transaction_status === 'settlement' || data.transaction_status === 'capture') {
        const orderId = data.order_id;
        
        // AMBIL DATA TITIPAN DARI CHECKOUT.JS
        const emailPembeli = data.custom_field1; 
        const licenseKey = data.custom_field2; // INI DIA KODE ASLI FIREBASE-NYA!

        if (emailPembeli && licenseKey) {
            
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

            // TEMPLATE EMAIL ELITE & PROFESIONAL
            const mailOptions = {
                from: '"Richardo Journal" <support@richardojournal.com>',
                to: emailPembeli,
                subject: '💎 [CONFIRMED] Richardo Elite Journal - Vault Key Access',
                html: `
                    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #020005; color: #e2e8f0; padding: 40px 20px; line-height: 1.6;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0f; border: 1px solid #1e1e2d; border-radius: 12px; overflow: hidden; box-shadow: 0 0 30px rgba(168,85,247,0.1);">
                            
                            <div style="background: linear-gradient(90deg, #4c1d95 0%, #0891b2 100%); padding: 30px 20px; text-align: center;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">RICHARDO JOURNAL</h1>
                                <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 12px; letter-spacing: 4px; text-transform: uppercase;">Elite Sniper Ecosystem</p>
                            </div>

                            <div style="padding: 40px 30px;">
                                <p style="font-size: 16px; margin-bottom: 20px;">Welcome to the Ecosystem,</p>
                                <p style="font-size: 16px; color: #94a3b8; margin-bottom: 30px;">
                                    Pembayaran untuk order <strong>${orderId}</strong> telah berhasil diverifikasi. Arsitektur lokal Anda kini siap diaktifkan. Berikut adalah <i>Vault Key</i> eksklusif Anda untuk membuka seluruh fitur analitik kelas atas kami.
                                </p>

                                <div style="background-color: #13131a; border-left: 4px solid #00e5ff; padding: 25px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
                                    <span style="display: block; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Your Private License Key</span>
                                    <div style="font-family: monospace; font-size: 28px; font-weight: bold; color: #00e5ff; letter-spacing: 3px;">
                                        ${licenseKey}
                                    </div>
                                </div>

                                <h3 style="color: #ffffff; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #1e1e2d; padding-bottom: 10px; margin-bottom: 15px;">Deployment Protocol</h3>
                                <ul style="color: #94a3b8; font-size: 14px; padding-left: 20px; margin-bottom: 40px;">
                                    <li style="margin-bottom: 10px;">Unduh eksekutor resmi melalui dashboard utama.</li>
                                    <li style="margin-bottom: 10px;">Masukkan kunci di atas saat sistem melakukan inisialisasi Hardware DNA.</li>
                                    <li style="margin-bottom: 10px;">Kunci ini bersifat rahasia, seumur hidup, dan mengikat pada identitas Anda. Jaga kerahasiaannya.</li>
                                </ul>

                                <p style="font-size: 14px; color: #94a3b8;">
                                    Stop trading blind. Start executing like a machine.<br>
                                    <strong>Execute & Dominate.</strong>
                                </p>

                                <div style="margin-top: 40px; border-top: 1px solid #1e1e2d; padding-top: 20px;">
                                    <p style="margin: 0; color: #ffffff; font-weight: bold;">Ricad</p>
                                    <p style="margin: 2px 0 0 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">CEO & Architect</p>
                                </div>
                            </div>
                            
                            <div style="background-color: #050508; padding: 20px; text-align: center; border-top: 1px solid #1e1e2d;">
                                <p style="color: #475569; font-size: 11px; margin: 0;">© 2026 Richardo Journal. All rights reserved.<br>Zero-Telemetry Vault Technology.</p>
                            </div>
                        </div>
                    </div>
                `
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log("🔥 EMAIL LISENSI ELITE SUKSES DIKIRIM KE:", emailPembeli);
            } catch (error) {
                console.error("❌ Gagal ngirim email. Cek Password/Host di Vercel!", error);
            }
        } else {
            console.log("⚠️ Data custom_field1 atau custom_field2 tidak ditemukan dari Midtrans.");
        }
    }

    res.status(200).json({ status: 'success' });
}