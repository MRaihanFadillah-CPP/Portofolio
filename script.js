document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Logika Pengiriman Form Kontak (Formspree)
    const contactForm = document.getElementById('contactForm');
    const statusPesan = document.getElementById('statusPesan');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); 
            const btnSubmit = contactForm.querySelector('button');
            const originalText = btnSubmit.innerHTML;
            
            btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
            btnSubmit.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    statusPesan.style.color = '#00f2fe'; 
                    statusPesan.innerHTML = `<i class="fa-solid fa-circle-check"></i> Pesan berhasil terkirim!`;
                    contactForm.reset();
                } else {
                    statusPesan.style.color = '#ef4444'; 
                    statusPesan.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Ups! Gagal mengirim pesan.`;
                }
            } catch (error) {
                statusPesan.style.color = '#ef4444';
                statusPesan.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Terjadi masalah koneksi jaringan.`;
            } finally {
                btnSubmit.innerHTML = originalText;
                btnSubmit.disabled = false;
                setTimeout(() => {
                    statusPesan.style.transition = 'opacity 0.5s ease';
                    statusPesan.style.opacity = '0';
                    setTimeout(() => { statusPesan.innerHTML = ''; statusPesan.style.opacity = '1'; }, 500);
                }, 5000);
            }
        });
    }

    // 2. Animasi Reveal saat Scroll
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = function() {
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 100; 
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // 3. Menu Hamburger
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('is-active');
            navLinks.classList.toggle('active');
        });

        navItems.forEach(item => {
            item.addEventListener('click', function() {
                mobileMenu.classList.remove('is-active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 4. Typing Effect Otomatis
    const textArray = ["Mahasiswa Ilmu Komputer", "Pengembang Perangkat Lunak", "Penggemar Basis Data"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; 
    let textArrayIndex = 0;
    let charIndex = 0;
    const typeWriterElement = document.getElementById("typewriter");

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typeWriterElement.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typeWriterElement.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 500);
        }
    }

    if(typeWriterElement) {
        setTimeout(type, 1000);
    }
});