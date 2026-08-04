document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Logika Pengiriman Form Kontak (Terhubung ke Formspree)
    const contactForm = document.getElementById('contactForm');
    const statusPesan = document.getElementById('statusPesan');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Mencegah halaman reload

            const btnSubmit = contactForm.querySelector('button');
            const originalText = btnSubmit.innerHTML;
            
            // Ubah tombol jadi status loading
            btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
            btnSubmit.disabled = true;

            // Mengambil data dari form
            const formData = new FormData(contactForm);

            try {
                // Mengirim data ke Formspree
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Jika berhasil terkirim
                    statusPesan.style.color = '#38bdf8'; 
                    statusPesan.innerHTML = `<i class="fa-solid fa-circle-check"></i> Pesan berhasil terkirim!`;
                    contactForm.reset();
                } else {
                    // Jika ada error dari Formspree
                    statusPesan.style.color = '#ef4444'; // Warna merah
                    statusPesan.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Ups! Gagal mengirim pesan.`;
                }
            } catch (error) {
                // Jika masalah jaringan
                statusPesan.style.color = '#ef4444';
                statusPesan.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Terjadi masalah koneksi jaringan.`;
            } finally {
                // Kembalikan tombol seperti semula
                btnSubmit.innerHTML = originalText;
                btnSubmit.disabled = false;

                // Hilangkan pesan status setelah 5 detik
                setTimeout(() => {
                    statusPesan.style.opacity = '0';
                    setTimeout(() => {
                        statusPesan.innerHTML = '';
                        statusPesan.style.opacity = '1';
                    }, 500);
                }, 5000);
            }
        });
    }

    // 2. Animasi Scroll (Intersection Observer)
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = function() {
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 100; // Jarak dari bawah layar sebelum elemen muncul

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    };

    window.addEventListener('scroll', revealOnScroll);
    
    // Panggil sekali saat halaman dimuat agar elemen di tampilan awal langsung muncul
    revealOnScroll();
});
