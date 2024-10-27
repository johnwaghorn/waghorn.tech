const elements = {
    header: document.querySelector('.header'),
    scrollTopButton: document.querySelector('.scroll-top'),
    menuButton: document.querySelector('.mobile-menu-button'),
    mobileMenu: document.querySelector('.mobile-menu'),
    mobileMenuLinks: document.querySelectorAll('.mobile-menu .nav-link'),
    currentYearSpan: document.getElementById('currentYear'),
    sections: document.querySelectorAll('section')
};

const menuIcons = {
    open: `
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    `,
    close: `
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    `
};

function updateCopyright() {
    elements.currentYearSpan.textContent = new Date().getFullYear();
}

function handleScroll() {
    const isScrolled = window.scrollY > 50;
    elements.header.classList.toggle('scrolled', isScrolled);
    elements.scrollTopButton.classList.toggle('visible', isScrolled);
}

function toggleMobileMenu() {
    const isOpen = elements.mobileMenu.classList.toggle('active');
    const menuIcon = elements.menuButton.querySelector('svg');
    menuIcon.innerHTML = isOpen ? menuIcons.close : menuIcons.open;
}

function resetMobileMenu() {
    elements.mobileMenu.classList.remove('active');
    elements.menuButton.querySelector('svg').innerHTML = menuIcons.open;
}

function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);

    if (target) {
        const headerHeight = elements.header.offsetHeight;
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        resetMobileMenu();
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function setupFadeAnimations() {
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elements.sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transition = 'opacity 0.5s ease-in-out';
        observer.observe(section);
    });

    const style = document.createElement('style');
    style.textContent = '.fade-in { opacity: 1 !important; }';
    document.head.appendChild(style);
}

function handleClickOutside(e) {
    if (elements.mobileMenu.classList.contains('active') &&
        !elements.mobileMenu.contains(e.target) &&
        !elements.menuButton.contains(e.target)) {
        resetMobileMenu();
    }
}

function handleResize() {
    if (window.innerWidth >= 768 && elements.mobileMenu.classList.contains('active')) {
        resetMobileMenu();
    }
}

function initializeEventListeners() {
    window.addEventListener('scroll', handleScroll);
    elements.menuButton.addEventListener('click', toggleMobileMenu);
    elements.scrollTopButton.addEventListener('click', scrollToTop);
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);
}

function initialize() {
    updateCopyright();
    setupFadeAnimations();
    initializeEventListeners();
}

document.addEventListener('DOMContentLoaded', initialize);
