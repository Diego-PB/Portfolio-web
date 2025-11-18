// Navigation mobile
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Fermer le menu mobile lors du clic sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth scroll pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Animation au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les éléments à animer
const animateElements = document.querySelectorAll('.competence-card, .projet-card, .stat-item');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Animation des barres de compétences
const animateBars = () => {
    const bars = document.querySelectorAll('.level-bar');
    bars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
};

// Observer pour déclencher l'animation des barres
const barsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateBars();
            barsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const competencesSection = document.getElementById('competences');
if (competencesSection) {
    barsObserver.observe(competencesSection);
}

// Gestion du formulaire de contact
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Récupérer les valeurs du formulaire
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Ici vous pouvez ajouter la logique pour envoyer l'email
        // Par exemple, utiliser un service comme EmailJS, Formspree, ou votre backend
        
        // Pour l'instant, on affiche juste une alerte
        alert('Merci pour votre message ! Je vous répondrai dans les plus brefs délais.');
        
        // Réinitialiser le formulaire
        contactForm.reset();
    });
}

// Highlight du lien actif dans la navigation
const sections = document.querySelectorAll('.section');
const navLinksArray = Array.from(navLinks);

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Ajouter un style pour le lien actif
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// Fonction pour afficher un message d'erreur
function showError(container, message) {
    if (!container) return;
    container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #ef4444; background: #fef2f2; border-radius: 8px; border: 2px solid #fecaca;">
            <p style="font-weight: 600; margin-bottom: 0.5rem;">⚠️ Erreur de chargement</p>
            <p style="font-size: 0.9rem;">${message}</p>
            <p style="font-size: 0.85rem; margin-top: 1rem; color: #6b7280;">
                Assurez-vous d'utiliser un serveur local (voir README.md)
            </p>
        </div>
    `;
}

// Charger et afficher la frise chronologique
async function loadTimeline() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;
    
    try {
        const response = await fetch('parcours.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const parcours = await response.json();
        
        if (!Array.isArray(parcours) || parcours.length === 0) {
            showError(timeline, 'Le fichier parcours.json est vide ou invalide.');
            return;
        }
        
        timeline.innerHTML = parcours.map((item, index) => `
            <div class="timeline-item ${index % 2 === 0 ? 'left' : 'right'}">
                <div class="timeline-content">
                    <div class="timeline-date">${item.date}</div>
                    <h3 class="timeline-title">${item.titre}</h3>
                    <div class="timeline-entreprise">${item.entreprise}</div>
                    <p class="timeline-description">${item.description}</p>
                </div>
            </div>
        `).join('');
        
        // Observer les éléments de la timeline pour l'animation
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, i) => {
            item.style.opacity = '0';
            item.style.transform = i % 2 === 0 ? 'translateX(-30px)' : 'translateX(30px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            setTimeout(() => {
                observer.observe(item);
            }, i * 100);
        });
    } catch (error) {
        console.error('Erreur lors du chargement de la timeline:', error);
        showError(timeline, `Impossible de charger parcours.json: ${error.message}`);
    }
}

// Charger et afficher les compétences
async function loadCompetences() {
    const container = document.getElementById('competences-categories');
    if (!container) return;
    
    try {
        const response = await fetch('competences.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const competences = await response.json();
        
        if (!competences || Object.keys(competences).length === 0) {
            showError(container, 'Le fichier competences.json est vide ou invalide.');
            return;
        }
        
        container.innerHTML = Object.entries(competences).map(([categorie, items]) => `
            <div class="competence-category">
                <h3 class="competence-category-title">${categorie}</h3>
                <div class="competence-items">
                    ${items.map(item => `
                        <div class="competence-item">
                            <div class="competence-item-icon">
                                <img src="${item.icon}" alt="${item.nom}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                <div class="competence-item-fallback" style="display: none;">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                                    </svg>
                                </div>
                            </div>
                            <span class="competence-item-name">${item.nom}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
        // Observer les éléments de compétences pour l'animation
        const competenceItems = document.querySelectorAll('.competence-item');
        competenceItems.forEach((item, i) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            setTimeout(() => {
                observer.observe(item);
            }, i * 50);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des compétences:', error);
        showError(container, `Impossible de charger competences.json: ${error.message}`);
    }
}

// Charger et afficher les projets
async function loadProjets() {
    const grid = document.getElementById('projets-grid');
    if (!grid) return;
    
    try {
        const response = await fetch('projets.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const projets = await response.json();
        
        if (!Array.isArray(projets) || projets.length === 0) {
            showError(grid, 'Le fichier projets.json est vide ou invalide.');
            return;
        }
        
        grid.innerHTML = projets.map(projet => `
            <div class="projet-card">
                <div class="projet-image" style="background-image: url('${projet.mainImg}');">
                    <div class="image-overlay">
                        <a href="projet-detail.html?id=${projet.id}" class="projet-link">En savoir plus</a>
                        ${projet.lienCode ? `<a href="${projet.lienCode}" class="projet-link" target="_blank">Code source</a>` : ''}
                    </div>
                </div>
                <div class="projet-content">
                    <h3>${projet.titre}</h3>
                    <p>${projet.desc}</p>
                    <div class="projet-tags">
                        ${projet.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
        
        // Observer les projets pour l'animation
        const projetCards = document.querySelectorAll('.projet-card');
        projetCards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            setTimeout(() => {
                observer.observe(card);
            }, i * 100);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
        showError(grid, `Impossible de charger projets.json: ${error.message}`);
    }
}

// Charger toutes les données au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadTimeline();
    loadCompetences();
    loadProjets();
});

