document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. STICKY HEADER & ACTIVE NAV LINKS
       ========================================================================== */
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Link on Scroll (Alternative to IntersectionObserver for simplicity)
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       2. MOBILE MENU TOGGLE
       ========================================================================== */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       3. MANUAL QUOTE REQUEST (WHATSAPP REDIRECT)
       ========================================================================== */
    const quoteManualBtn = document.getElementById('btn-whatsapp-quote');

    if (quoteManualBtn) {
        quoteManualBtn.addEventListener('click', () => {
            const nameVal = document.getElementById('name').value;
            const emailVal = document.getElementById('email').value;
            const phoneVal = document.getElementById('phone').value;
            const projectType = document.getElementById('project-type').value;
            const widthVal = document.getElementById('quote-width').value;
            const lengthVal = document.getElementById('quote-length').value;
            const messageVal = document.getElementById('message').value;

            if (!nameVal || !phoneVal) {
                alert('Por favor, ingresa al menos tu Nombre y Teléfono en el formulario para iniciar la cotización por WhatsApp.');
                return;
            }

            const widthText = widthVal ? `${widthVal}m` : 'No especificado';
            const lengthText = lengthVal ? `${lengthVal}m` : 'No especificado';
            const areaText = (widthVal && lengthVal) ? `${(parseFloat(widthVal) * parseFloat(lengthVal)).toFixed(2)} m²` : 'A definir';
            const detailsText = messageVal ? messageVal : 'Sin detalles adicionales';

            const basePhoneNumber = '524426158952'; // Querétaro / Corregidora phone number
            const message = `¡Hola MDJ Soluciones Metálicas! Me interesa solicitar una cotización formal. Les comparto los detalles de mi contacto y proyecto:

*Nombre:* ${nameVal}
*Teléfono:* ${phoneVal}
*Correo:* ${emailVal || 'No especificado'}
*Servicio de Interés:* ${projectType}
*Ancho aproximado:* ${widthText}
*Largo aproximado:* ${lengthText}
*Área aproximada:* ${areaText}
*Detalles específicos:* ${detailsText}

Quedo a la espera de su contacto para agendar la visita técnica sin costo en Querétaro.`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${basePhoneNumber}?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');
        });
    }

    /* ==========================================================================
       4. PROJECTS CAROUSELS LOGIC
       ========================================================================== */
    const carousels = document.querySelectorAll('.project-carousel');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        
        if (!track || slides.length === 0) return;

        let currentIndex = 0;
        const slideCount = slides.length;
        let autoplayTimer = null;

        // Create dot indicators dynamically
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < slideCount; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToSlide(i);
                    resetAutoplay();
                });
                dotsContainer.appendChild(dot);
            }
        }

        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

        function goToSlide(index) {
            if (index < 0) {
                currentIndex = slideCount - 1;
            } else if (index >= slideCount) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }

            // Slide translation
            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Update dots
            dots.forEach((dot, i) => {
                if (i === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Button events
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
                resetAutoplay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
                resetAutoplay();
            });
        }

        // Autoplay functions
        function startAutoplay() {
            if (autoplayTimer) clearInterval(autoplayTimer);
            autoplayTimer = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 6000);
        }

        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        }

        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        // Start autoplay initially
        startAutoplay();

        // Pause autoplay on mouse enter, resume on leave
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
    });

    /* ==========================================================================
       4.1 OUTER PROJECTS CAROUSELS LOGIC
       ========================================================================== */
    const outerCarousel = document.querySelector('.projects-outer-carousel');
    if (outerCarousel) {
        const track = outerCarousel.querySelector('.projects-outer-track');
        const cards = outerCarousel.querySelectorAll('.project-card-3d');
        const prevBtn = outerCarousel.querySelector('.outer-carousel-btn.prev');
        const nextBtn = outerCarousel.querySelector('.outer-carousel-btn.next');
        const dotsContainer = outerCarousel.querySelector('.outer-carousel-dots');
        
        if (track && cards.length > 0) {
            let currentIndex = 0;
            const cardCount = cards.length;

            // Create dot indicators dynamically
            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                for (let i = 0; i < cardCount; i++) {
                    const dot = document.createElement('span');
                    dot.classList.add('outer-dot');
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => {
                        goToCard(i);
                    });
                    dotsContainer.appendChild(dot);
                }
            }

            const dots = dotsContainer ? dotsContainer.querySelectorAll('.outer-dot') : [];

            function goToCard(index) {
                if (index < 0) {
                    currentIndex = cardCount - 1;
                } else if (index >= cardCount) {
                    currentIndex = 0;
                } else {
                    currentIndex = index;
                }

                // Translate track
                track.style.transform = `translateX(-${currentIndex * 100}%)`;

                // Update dots
                dots.forEach((dot, i) => {
                    if (i === currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }

            // Button click events
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    goToCard(currentIndex - 1);
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    goToCard(currentIndex + 1);
                });
            }

            // Sync slide translation on window resize
            window.addEventListener('resize', () => {
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
            });
        }
    }

    /* ==========================================================================
       5. CONTACT FORM VALIDATION & SUBMISSION SIMULATION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const contactStatus = document.getElementById('contact-status');

    const projectTypeSelect = document.getElementById('project-type');
    const dimensionsRow = document.getElementById('quote-dimensions-row');

    let toggleDimensions;
    if (projectTypeSelect && dimensionsRow) {
        toggleDimensions = () => {
            if (projectTypeSelect.value === 'Consulta General') {
                dimensionsRow.classList.remove('show');
            } else {
                dimensionsRow.classList.add('show');
            }
        };
        // Initial state check
        toggleDimensions();
        // Listener
        projectTypeSelect.addEventListener('change', toggleDimensions);
    }

    if (contactForm && contactStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Fetch input values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;

            // Reset status
            contactStatus.classList.remove('show', 'success', 'error');

            // Simple validation check
            if (!name || !email || !phone || !message) {
                contactStatus.textContent = 'Por favor, llena todos los campos requeridos.';
                contactStatus.classList.add('error', 'show');
                return;
            }

            // Simulate loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...';

            setTimeout(() => {
                // Fetch current select value
                const projectType = document.getElementById('project-type').value;

                // Compose Mailto link
                const mailSubject = `Cotización MDJ - ${projectType}`;
                const mailBody = `Hola MDJ Soluciones Metálicas,

Me interesa solicitar una cotización. Les comparto mis datos de contacto y detalles:

Nombre: ${name}
Teléfono: ${phone}
Correo: ${email}
Servicio: ${projectType}
Ancho aproximado: ${document.getElementById('quote-width').value || 'No especificado'}m
Largo aproximado: ${document.getElementById('quote-length').value || 'No especificado'}m
Detalles específicos: ${message}

Quedo a la espera de su respuesta para coordinar los detalles.`;

                const mailtoUrl = `mailto:mario.mandujano.moreno@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
                
                // Open local mail client
                window.location.href = mailtoUrl;

                // Success State Simulation
                contactStatus.textContent = `¡Muchas gracias, ${name}! Tu cliente de correo se ha abierto. Si no se abrió, puedes enviarlo directamente a mario.mandujano.moreno@gmail.com.`;
                contactStatus.classList.add('success', 'show');
                
                // Clear Form and collapse dimensions if general option
                contactForm.reset();
                if (toggleDimensions) toggleDimensions();

                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                // Hide status after 8 seconds
                setTimeout(() => {
                    contactStatus.classList.remove('show');
                }, 8000);

            }, 1500);
        });
    }

    /* ==========================================================================
       6. SCROLL PROGRESS BAR & INDICATORS
       ========================================================================== */
    const progressBar = document.getElementById('scroll-progress-bar');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    window.addEventListener('scroll', () => {
        // Scroll Progress Bar
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (windowHeight > 0) {
            const scrolled = (window.scrollY / windowHeight) * 100;
            if (progressBar) progressBar.style.width = scrolled + '%';
        }

        // Hide scroll mouse indicator on scroll
        if (scrollIndicator) {
            if (window.scrollY > 80) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        }
    });

    /* ==========================================================================
       7. CSS 3D TILT PARALLAX EFFECT
       ========================================================================== */
    const tiltElements = document.querySelectorAll('.service-card, .project-card-3d, .info-card, .contact-form');

    // Apply 3D Tilt interaction only on desktop devices for performance
    if (window.innerWidth > 1024) {
        tiltElements.forEach(elem => {
            elem.addEventListener('mousemove', (e) => {
                const rect = elem.getBoundingClientRect();
                const x = e.clientX - rect.left; 
                const y = e.clientY - rect.top;  
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate tilt angles (max 10 degrees)
                const rotateX = ((centerY - y) / centerY) * 10;
                const rotateY = ((x - centerX) / centerX) * 10;
                
                elem.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            elem.addEventListener('mouseleave', () => {
                elem.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    /* ==========================================================================
       8. THREE.JS 3D INDUSTRIAL WIREFRAME BACKGROUND
       ========================================================================== */
    const canvas3d = document.getElementById('hero-3d-canvas');
    if (canvas3d && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas3d.clientWidth / canvas3d.clientHeight, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({ canvas: canvas3d, alpha: true, antialias: true });
        renderer.setSize(canvas3d.clientWidth, canvas3d.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Group to contain all structural elements
        const structureGroup = new THREE.Group();

        // 1. Create structural nodes (spheres) and connections (wireframe geometry)
        // This represents structural truss node architecture
        const geometry = new THREE.IcosahedronGeometry(9, 1);
        
        // Dark blue steel main beam lines
        const material = new THREE.MeshBasicMaterial({
            color: 0x5b88b2, // Ocean blue
            wireframe: true,
            transparent: true,
            opacity: 0.18
        });
        const mesh = new THREE.Mesh(geometry, material);
        structureGroup.add(mesh);

        // Glowing connection nodes
        const pointsMaterial = new THREE.PointsMaterial({
            color: 0x7da2c8, // Light Ocean blue
            size: 0.35,
            transparent: true,
            opacity: 0.7
        });
        const points = new THREE.Points(geometry, pointsMaterial);
        structureGroup.add(points);

        // 2. Add an outer rotating cubic structural grid
        const boxLinesMaterial = new THREE.LineBasicMaterial({
            color: 0x5b88b2, // Ocean blue
            transparent: true,
            opacity: 0.3
        });
        const boxGeometry = new THREE.BoxGeometry(13, 13, 13, 2, 2, 2);
        const boxWireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(boxGeometry),
            boxLinesMaterial
        );
        structureGroup.add(boxWireframe);

        scene.add(structureGroup);
        camera.position.z = 20;

        // Interaction coordinates and scroll tracking
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        let scrollY = 0;

        window.addEventListener('mousemove', (e) => {
            // Normalised coordinates (-1 to 1)
            mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        });

        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
        });

        // Resize updates
        window.addEventListener('resize', () => {
            camera.aspect = canvas3d.clientWidth / canvas3d.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas3d.clientWidth, canvas3d.clientHeight);
        });

        let passiveRotY = 0;
        let passiveRotX = 0;

        // Animation loop
        const tick = () => {
            requestAnimationFrame(tick);

            // Continuous passive rotation
            passiveRotY += 0.0015;
            passiveRotX += 0.0008;

            // Tilt structure toward mouse cursor with lerp smoothing
            targetX += (mouseX * 0.4 - targetX) * 0.05;
            targetY += (mouseY * 0.4 - targetY) * 0.05;
            
            // Apply rotation combining passive, cursor tilt, and scroll parallax
            structureGroup.rotation.y = passiveRotY + targetX + scrollY * 0.0008;
            structureGroup.rotation.x = passiveRotX + targetY + scrollY * 0.0004;

            renderer.render(scene, camera);
        };

        tick();
    }

    /* ==========================================================================
       9. CUSTOM FLOATING CURSOR WITH INERTIA (TRAILER)
       ========================================================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    if (cursorDot && cursorOutline && window.innerWidth > 1024) {
        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Move solid dot instantly
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        });

        // Inertial lerp animation loop for outline ring
        const animateCursor = () => {
            const lerpFactor = 0.15; // smooth lag speed
            outlineX += (mouseX - outlineX) * lerpFactor;
            outlineY += (mouseY - outlineY) * lerpFactor;

            cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Hover expansions
        const hoverTargets = document.querySelectorAll('a, button, input, select, textarea, .service-card, .project-card-3d, .outer-carousel-btn, .carousel-btn, .logo, .floating-whatsapp');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hovered');
                cursorDot.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hovered');
                cursorDot.classList.remove('hovered');
            });
        });
    }

    /* ==========================================================================
       10. SCROLL REVEAL (INTERSECTION OBSERVER)
       ========================================================================== */
    const reveals = document.querySelectorAll('.reveal, .reveal-parent');
    
    if (reveals.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        reveals.forEach(el => revealObserver.observe(el));
    }

    /* ==========================================================================
       11. COPY & CONTENT PROTECTION
       ========================================================================== */
    // Block context menu (right-click)
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Block keyboard copy shortcut (Ctrl+C / Cmd+C)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            e.preventDefault();
        }
    });

    // Block dragging of images
    document.addEventListener('dragstart', (e) => {
        if (e.target.nodeName === 'IMG') {
            e.preventDefault();
        }
    });
});
