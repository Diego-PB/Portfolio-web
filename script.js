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
        const response = await fetch('data/parcours.json');
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

// --- Gestion des filtres de projets par compétence clé ---
let allProjets = [];
let activeCompetenceFilter = null;

function renderProjetsGrid() {
    const grid = document.getElementById('projets-grid');
    const info = document.getElementById('projets-filter-info');
    if (!grid) return;

    let projetsToRender = allProjets;
    if (activeCompetenceFilter) {
        projetsToRender = allProjets.filter(p =>
            Array.isArray(p.competences) && p.competences.includes(activeCompetenceFilter.id)
        );
    }

    if (info) {
        if (activeCompetenceFilter) {
            info.innerHTML = `
                <div style="margin-bottom: 1.5rem; padding: 0.85rem 1rem; border-radius: 999px; background: #eef2ff; display: inline-flex; align-items: center; gap: 0.75rem;">
                    <span style="font-size: 0.9rem; color: #4b5563;">
                        Filtre actif : <strong>${activeCompetenceFilter.label}</strong>
                    </span>
                    <button type="button" id="clear-competence-filter" style="border: none; background: transparent; color: #2563eb; font-weight: 600; cursor: pointer;">
                        Réinitialiser
                    </button>
                </div>
            `;

            const clearBtn = document.getElementById('clear-competence-filter');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    activeCompetenceFilter = null;
                    renderProjetsGrid();
                    // retirer l'état actif sur les cartes
                    document
                        .querySelectorAll('.core-competence-card')
                        .forEach(card => card.classList.remove('active'));
                    // retirer l'état actif sur les boutons de filtre
                    document
                        .querySelectorAll('.projets-filter-button')
                        .forEach(btn => btn.classList.remove('active'));
                });
            }
        } else {
            info.innerHTML = '';
        }
    }

    if (!projetsToRender || projetsToRender.length === 0) {
        grid.innerHTML = '<p>Aucun projet ne correspond à cette compétence pour le moment.</p>';
        return;
    }

    grid.innerHTML = projetsToRender.map(projet => `
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
}

function setActiveCompetenceFilter(competenceId, label) {
    activeCompetenceFilter = competenceId
        ? { id: competenceId, label }
        : null;
    renderProjetsGrid();

    // Mettre à jour l'état actif des boutons de filtre
    const filterButtons = document.querySelectorAll('.projets-filter-button');
    filterButtons.forEach(btn => {
        const id = btn.getAttribute('data-competence-id');
        btn.classList.toggle('active', !!activeCompetenceFilter && activeCompetenceFilter.id === id);
    });
}

// Charger et afficher les compétences
async function loadCompetences() {
    const container = document.getElementById('competences-categories');
    if (!container) return;

    try {
        const response = await fetch('data/competences.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const competences = await response.json();

        if (!competences || Object.keys(competences).length === 0) {
            showError(container, 'Le fichier competences.json est vide ou invalide.');
            return;
        }
        container.innerHTML = Object.entries(competences).map(([categorie, items]) => `
            <div class="competence-category open">
                <button class="competence-category-header" type="button">
                    <span class="competence-category-title">${categorie}</span>
                    <span class="competence-category-toggle-icon">›</span>
                </button>
                <div class="competence-items-wrapper">
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
            </div>
        `).join('');

        // Comportement accordéon
        const categoryHeaders = container.querySelectorAll('.competence-category-header');
        categoryHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const parent = header.closest('.competence-category');
                const isOpen = parent.classList.contains('open');

                // Optionnel : fermer les autres catégories
                container.querySelectorAll('.competence-category').forEach(cat => {
                    if (cat !== parent) cat.classList.remove('open');
                });

                if (isOpen) {
                    parent.classList.remove('open');
                } else {
                    parent.classList.add('open');
                }
            });
        });

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
        const response = await fetch('data/projets.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const projets = await response.json();

        if (!Array.isArray(projets) || projets.length === 0) {
            showError(grid, 'Le fichier projets.json est vide ou invalide.');
            return;
        }
        allProjets = projets;
        renderProjetsGrid();

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

// Charger les données statiques depuis data.json
async function loadData() {
    try {
        const response = await fetch('data/data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Navbar
        if (data.navbar) {
            const logo = document.getElementById('nav-logo');
            if (logo) logo.textContent = data.navbar.logo;

            const navHome = document.getElementById('nav-home');
            if (navHome) navHome.textContent = data.navbar.menu.home;

            const navAbout = document.getElementById('nav-about');
            if (navAbout) navAbout.textContent = data.navbar.menu.about;

            const navSkills = document.getElementById('nav-skills');
            if (navSkills) navSkills.textContent = data.navbar.menu.skills;

            const navProjects = document.getElementById('nav-projects');
            if (navProjects) navProjects.textContent = data.navbar.menu.projects;

            const navContact = document.getElementById('nav-contact');
            if (navContact) navContact.textContent = data.navbar.menu.contact;
        }

        // Home
        if (data.home) {
            const greeting = document.getElementById('home-greeting');
            if (greeting) greeting.textContent = data.home.greeting;

            const nameFirst = document.getElementById('home-name-first');
            if (nameFirst) nameFirst.textContent = data.home.name.first;

            const nameLast = document.getElementById('home-name-last');
            if (nameLast) nameLast.textContent = data.home.name.last;

            const role = document.getElementById('home-role');
            if (role) role.textContent = data.home.role;

            const desc = document.getElementById('home-desc');
            if (desc) desc.textContent = data.home.description;

            const btnProjects = document.getElementById('btn-projects');
            if (btnProjects) btnProjects.textContent = data.home.buttons.projects;

            const btnContact = document.getElementById('btn-contact');
            if (btnContact) btnContact.textContent = data.home.buttons.contact;

            const btnCv = document.getElementById('btn-cv');
            if (btnCv && data.home.buttons.cv) btnCv.textContent = data.home.buttons.cv;
        }

        // About
        if (data.about) {
            const title = document.getElementById('about-title');
            if (title) title.textContent = data.about.title;

            const aboutTextContainer = document.getElementById('about-text');
            if (aboutTextContainer && Array.isArray(data.about.content)) {
                aboutTextContainer.innerHTML = data.about.content.map(p => `<p>${p}</p>`).join('');
            }
        }

        // Contact
        if (data.contact) {
            const title = document.getElementById('contact-title');
            if (title) title.textContent = data.contact.title;

            const subtitle = document.getElementById('contact-subtitle');
            if (subtitle) subtitle.textContent = data.contact.subtitle;

            const desc = document.getElementById('contact-desc');
            if (desc) desc.textContent = data.contact.description;

            const email = document.getElementById('contact-email');
            if (email) email.textContent = data.contact.email;

            const phone = document.getElementById('contact-phone');
            if (phone) phone.textContent = data.contact.phone;

            const location = document.getElementById('contact-location');
            if (location) location.textContent = data.contact.location;

            const linkedin = document.getElementById('social-linkedin');
            if (linkedin && data.contact.socials.linkedin) {
                linkedin.href = data.contact.socials.linkedin;
            }

            const github = document.getElementById('social-github');
            if (github && data.contact.socials.github) {
                github.href = data.contact.socials.github;
            }
        }

        // Footer
        if (data.footer) {
            const copyright = document.getElementById('footer-copyright');
            if (copyright) copyright.innerHTML = data.footer.copyright;
        }

        // Compétences clés (cartes) + filtres projets
        if (Array.isArray(data.coreCompetences)) {
            const coreContainer = document.getElementById('core-competences');
            const filtersContainer = document.getElementById('projets-filters');

            // Rendu des cartes de compétences
            if (coreContainer) {
                coreContainer.innerHTML = data.coreCompetences.map(comp => {
                    // Choix d'icône simple selon le type
                    let iconPath = '';
                    switch (comp.icon) {
                        case 'chart':
                            iconPath = '<path d="M4 19h16M7 16V9m5 7V5m5 11v-8" />';
                            break;
                        case 'server':
                            iconPath = '<rect x="4" y="4" width="16" height="6" rx="2"/><rect x="4" y="14" width="16" height="6" rx="2"/><path d="M8 7h.01M8 17h.01" />';
                            break;
                        case 'data':
                            iconPath = '<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />';
                            break;
                        case 'project':
                            iconPath = '<rect x="3" y="4" width="18" height="6" rx="2"/><path d="M12 10v10"/><path d="M7 14h3v6H7zM14 14h3v6h-3z"/>';
                            break;
                        case 'team':
                            iconPath = '<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M4 18v-1a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v1"/><path d="M12 18v-1a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v1"/>';
                            break;
                        default:
                            iconPath = '<path d="M16 18l-4-4-4 4M16 12l-4-4-4 4" />';
                    }

                    return `
                        <article class="core-competence-card" data-competence-id="${comp.id}">
                            <div class="core-competence-header">
                                <div class="core-competence-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        ${iconPath}
                                    </svg>
                                </div>
                                <div class="core-competence-titles">
                                    <h3>${comp.titre}</h3>
                                    <p>${comp.sousTitre}</p>
                                </div>
                            </div>
                            <div class="core-competence-body">
                                <p>${comp.description}</p>
                                <button class="core-competence-button" type="button" data-competence-id="${comp.id}">
                                    Voir les projets liés
                                    <span class="icon-arrow">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M5 12h14M13 6l6 6-6 6" />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </article>
                    `;
                }).join('');

                // Comportement d'ouverture/fermeture des cartes
                const cards = coreContainer.querySelectorAll('.core-competence-card');
                cards.forEach(card => {
                    card.addEventListener('click', (e) => {
                        // éviter que le clic sur le bouton se propage pour fermer la carte
                        if (e.target.closest('.core-competence-button')) return;

                        const alreadyActive = card.classList.contains('active');
                        cards.forEach(c => c.classList.remove('active'));
                        if (!alreadyActive) {
                            card.classList.add('active');
                        }
                    });
                });

                // Clic sur "Voir les projets liés" -> filtre
                const buttons = coreContainer.querySelectorAll('.core-competence-button');
                buttons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const competenceId = btn.getAttribute('data-competence-id');
                        const card = btn.closest('.core-competence-card');
                        const titleEl = card.querySelector('.core-competence-titles h3');
                        const label = titleEl ? titleEl.textContent : 'Compétence';

                        // activer visuellement la carte
                        coreContainer.querySelectorAll('.core-competence-card').forEach(c => c.classList.remove('active'));
                        card.classList.add('active');

                        setActiveCompetenceFilter(competenceId, label);

                        // scroll vers la section projets pour voir le résultat du filtre
                        const projetsSection = document.getElementById('projets');
                        if (projetsSection) {
                            const offsetTop = projetsSection.offsetTop - 80;
                            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                        }
                    });
                });
            }

            // Rendu des boutons de filtre sous "Projets"
            if (filtersContainer) {
                filtersContainer.innerHTML = data.coreCompetences.map(comp => `
                    <button
                        type="button"
                        class="projets-filter-button"
                        data-competence-id="${comp.id}"
                    >
                        ${comp.titre}
                    </button>
                `).join('');

                const filterButtons = filtersContainer.querySelectorAll('.projets-filter-button');
                filterButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const competenceId = btn.getAttribute('data-competence-id');
                        const compData = data.coreCompetences.find(c => c.id === competenceId);
                        const label = compData ? compData.titre : 'Compétence';

                        // Appliquer le filtre
                        setActiveCompetenceFilter(competenceId, label);

                        // synchroniser l'état avec les cartes de compétences
                        const cards = document.querySelectorAll('.core-competence-card');
                        cards.forEach(card => {
                            card.classList.toggle(
                                'active',
                                card.getAttribute('data-competence-id') === competenceId
                            );
                        });
                    });
                });
            }
        }

    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
}

// Charger toutes les données au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    loadTimeline();
    loadCompetences();
    loadProjets();
});

