document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Logika Pengiriman Form Kontak
    const contactForm = document.getElementById('contactForm');
    const statusPesan = document.getElementById('statusPesan');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nama = document.getElementById('nama').value;

            // Simulasi loading dan sukses
            const btnSubmit = contactForm.querySelector('button');
            const originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
            btnSubmit.disabled = true;

            setTimeout(() => {
                statusPesan.style.color = '#38bdf8'; 
                statusPesan.innerHTML = `<i class="fa-solid fa-circle-check"></i> Pesan terkirim! Terima kasih, ${nama}.`;
                
                contactForm.reset();
                btnSubmit.innerHTML = originalText;
                btnSubmit.disabled = false;

                setTimeout(() => {
                    statusPesan.style.opacity = '0';
                    setTimeout(() => {
                        statusPesan.innerHTML = '';
                        statusPesan.style.opacity = '1';
                    }, 500);
                }, 5000);
            }, 1500); // Jeda 1.5 detik seolah-olah mengirim ke server
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