document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });
    }

    // Modal Logic
    const bookingModal = document.getElementById('bookingModal');
    const bookingButtons = document.querySelectorAll('#openBooking, .open-booking');
    const closeBtn = document.querySelector('.close-modal');
    const roomSelect = bookingModal ? bookingModal.querySelector('select') : null;

    bookingButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            bookingModal.style.display = 'flex';

            // Pre-select room if data-room exists
            const roomType = btn.getAttribute('data-room');
            if (roomType && roomSelect) {
                roomSelect.value = roomType;
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            bookingModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            bookingModal.style.display = 'none';
        }
    });

    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    function showSlide(index) {
        testimonials.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-advance testimonials
    setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }, 5000);

    // Page Loader Dismissal
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('hidden');
                setTimeout(() => loader.style.display = 'none', 1000);
            }
        }, 4000); // Luxury delay + 3s for text
    });

    // Parallax Scrolling Effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        // Hero Parallax
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
            heroContent.style.opacity = 1 - (scrolled / 700);
        }

        // Amenities Parallax
        const parallaxBg = document.querySelector('.parallax-bg');
        if (parallaxBg) {
            parallaxBg.style.backgroundPositionY = `${scrolled * 0.15}px`;
        }
    });

    // Intersection Observer for Reveal animations (Staggered)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Once revealed, we can stop observing
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Gallery Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hide');
                    // Trigger reveal animation if not already revealed
                    if (!item.classList.contains('revealed')) {
                        item.classList.add('revealed');
                    }
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });

    // Room Image Gallery Navigation
    const roomCardContainers = document.querySelectorAll('.room-img-container');

    roomCardContainers.forEach(container => {
        const prevBtn = container.querySelector('.prev-room-img');
        const nextBtn = container.querySelector('.next-room-img');
        const images = container.querySelectorAll('.room-img');
        let currentIndex = 0;

        function updateImages(index) {
            images.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent opening the lightbox if we ever add a click listener to the container
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateImages(currentIndex);
            });

            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent opening the lightbox
                currentIndex = (currentIndex + 1) % images.length;
                updateImages(currentIndex);
            });
        }
    });

    // Image Modal Logic (Lightbox)
    const imageModal = document.getElementById('imageModal');
    const expandedImg = document.getElementById('expandedImage');
    const imageCaption = document.getElementById('imageCaption');
    const closeImageBtn = document.querySelector('.close-image-modal');

    // Select all clickable images (Gallery and Room cards)
    const clickableImages = document.querySelectorAll('.gallery-item img, .room-img img');

    clickableImages.forEach(img => {
        img.addEventListener('click', () => {
            const src = img.getAttribute('src');
            const alt = img.getAttribute('alt');

            // Populate modal
            expandedImg.setAttribute('src', src);
            imageCaption.textContent = alt;

            // Show modal
            imageModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    function closeImageModal() {
        imageModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        // Delay resetting src to avoid flash during transition
        setTimeout(() => {
            expandedImg.setAttribute('src', '');
        }, 400);
    }

    if (closeImageBtn) {
        closeImageBtn.addEventListener('click', closeImageModal);
    }

    // Close on click outside the image
    if (imageModal) {
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal || e.target === closeImageBtn) {
                closeImageModal();
            }
        });
    }

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageModal.classList.contains('active')) {
            closeImageModal();
        }
    });
    // Custom Cursor
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const cursorFollower = document.createElement('div');
    cursorFollower.classList.add('cursor-follower');
    document.body.appendChild(cursorFollower);

    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        cursorFollower.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    });

    const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .room-img, .menu-toggle');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            cursorFollower.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            cursorFollower.classList.remove('active');
        });
    });

    // Advanced Parallax
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        // Multi-layered Hero Parallax
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo) {
            heroVideo.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0)`;
        }

        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translate3d(0, ${scrolled * 0.3}px, 0)`;
            heroContent.style.opacity = 1 - (scrolled / 800);
        }
    });

    // Amenities Cinematic Scroll Effect
    const amenitiesSection = document.querySelector('.amenities-visual');
    const parallaxImg = document.querySelector('.parallax-img');

    if (amenitiesSection && parallaxImg) {
        window.addEventListener('scroll', () => {
            const rect = amenitiesSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate visibility
            if (rect.top <= windowHeight && rect.bottom >= 0) {
                // Calculate scroll progress (0 when top enters view, 1 when bottom leaves)
                const distance = windowHeight - rect.top;
                const progress = distance / (windowHeight + rect.height);

                // Move image slightly slower than scroll (parallax)
                // Range: -10% to 10%
                const moveAmount = (progress - 0.5) * 20;

                parallaxImg.style.transform = `translateY(${moveAmount}%) scale(1.1)`;
            }
        });
    }

    // About Section Slideshow
    const slides = document.querySelectorAll('.img-wrapper.slideshow .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            // Remove active from current
            slides[currentSlide].classList.remove('active');

            // Move to next
            currentSlide = (currentSlide + 1) % slides.length;

            // Add active to next
            slides[currentSlide].classList.add('active');
        }, 5000); // Change every 5 seconds
    }
});
