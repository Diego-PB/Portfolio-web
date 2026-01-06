// Les fonctionnalités de navigation (hamburger, scroll navbar) sont gérées par script.js
// qui est chargé avant ce fichier.


// Récupérer l'ID du projet depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const projetId = parseInt(urlParams.get('id'));

async function fetchJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Impossible de charger ${path} (statut ${response.status})`);
    }
    return response.json();
}

// Charger les projets depuis le JSON
async function loadProjetDetail() {
    try {
        const [projets, competences] = await Promise.all([
            fetchJSON('data/projets.json'),
            fetchJSON('data/competences.json').catch(error => {
                console.warn('Impossible de charger competences.json:', error);
                return null;
            })
        ]);

        const projet = projets.find(p => p.id === projetId);

        if (!projet) {
            document.getElementById('projet-detail-content').innerHTML =
                '<p>Projet non trouvé.</p>';
            return;
        }

        renderProjetDetail(projet, competences);
    } catch (error) {
        console.error('Erreur lors du chargement du projet:', error);
        document.getElementById('projet-detail-content').innerHTML =
            '<p>Erreur lors du chargement du projet.</p>';
    }
}

function normalizeName(name = '') {
    return name
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\+/g, 'plus')
        .replace(/#/g, 'sharp')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
}

function buildCompetenceMap(competencesData) {
    const map = new Map();

    if (!competencesData) {
        return map;
    }

    Object.entries(competencesData).forEach(([categorie, items]) => {
        items.forEach(item => {
            const key = normalizeName(item.nom);
            if (!map.has(key)) {
                map.set(key, { ...item, categorie });
            }
        });
    });

    return map;
}

function createCompetenceCards(technologies = [], competenceMap) {
    if (!technologies.length) {
        return '';
    }

    return technologies.map(tech => {
        const competence = competenceMap.get(normalizeName(tech));
        const displayName = competence?.nom || tech;
        const categoryLabel = competence?.categorie || 'Compétence projet';
        const iconHTML = competence?.icon
            ? `<img src="${competence.icon}" alt="${displayName}" loading="lazy">`
            : `<span class="projet-competence-letter">${tech.charAt(0).toUpperCase()}</span>`;

        return `
            <div class="projet-competence-card">
                <div class="projet-competence-icon">
                    ${iconHTML}
                </div>
                <div class="projet-competence-info">
                    <span class="competence-name">${displayName}</span>
                    <span class="competence-category">${categoryLabel}</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderCompetenceSection(technologies, competenceMap) {
    const cards = createCompetenceCards(technologies, competenceMap);

    if (!cards) {
        return '';
    }

    return `
        <div class="projet-detail-section">
            <h2>Compétences mobilisées</h2>
            <p class="projet-competence-helper">
                Ces compétences sont extraites automatiquement de mon référentiel (<code>competences.json</code>).
            </p>
            <div class="projet-competences-grid">
                ${cards}
            </div>
        </div>
    `;
}

function renderListSection(title, items = []) {
    if (!items.length) {
        return '';
    }

    return `
        <div class="projet-detail-section">
            <h2>${title}</h2>
            <ul class="projet-detail-list">
                ${items.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `;
}

function renderResultSection(resultats = {}) {
    const entries = Object.entries(resultats);
    if (!entries.length) {
        return '';
    }

    return `
        <div class="projet-detail-section">
            <h2>Impact et résultats</h2>
            <div class="projet-resultats-grid">
                ${entries.map(([label, value]) => `
                    <div class="projet-result-card">
                        <span class="result-label">${label}</span>
                        <span class="result-value">${value}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Rendre les détails du projet
function renderProjetDetail(projet, competencesData) {
    const content = document.getElementById('projet-detail-content');
    const competenceMap = buildCompetenceMap(competencesData);
    const competenceSection = renderCompetenceSection(projet.technologies || [], competenceMap);
    const contexteSection = projet.contexte
        ? `
            <div class="projet-detail-section">
                <h2>Contexte</h2>
                <p>${projet.contexte}</p>
            </div>
        `
        : '';
    const objectifsSection = renderListSection('Objectifs clés', projet.objectifs);
    const responsabilitesSection = renderListSection('Rôle & responsabilités', projet.responsabilites);
    const featuresSection = renderListSection('Fonctionnalités principales', projet.fonctionnalites);
    const resultatsSection = renderResultSection(projet.resultats);

    // Toutes les images (image principale + autres images)
    const allImages = [projet.mainImg, ...(projet.autreImg || [])];

    // Générer le carrousel
    const carouselHTML = `
        <div class="image-carousel">
            <div class="carousel-main">
                <img id="carousel-main-img" src="${allImages[0]}" alt="${projet.titre}">
                <button class="carousel-nav prev" onclick="changeImage(-1)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>
                <button class="carousel-nav next" onclick="changeImage(1)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </button>
                <div class="carousel-indicator" id="carousel-indicator"></div>
            </div>
            ${allImages.length > 1 ? `
                <div class="carousel-thumbnails" id="carousel-thumbnails"></div>
            ` : ''}
        </div>
    `;

    // Générer les tags de technologies
    const technologies = projet.technologies || [];
    const technologiesHTML = technologies.length
        ? `
            <div class="projet-detail-technologies">
                ${technologies.map(tech => `<span class="projet-detail-tag">${tech}</span>`).join('')}
            </div>
        `
        : '';

    // Générer les liens
    const linksHTML = `
        ${projet.lienProjet ? `
            <a href="${projet.lienProjet}" target="_blank" class="projet-detail-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                </svg>
                Voir le projet
            </a>
        ` : ''}
        ${projet.lienCode ? `
            <a href="${projet.lienCode}" target="_blank" class="projet-detail-link secondary">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Code source
            </a>
        ` : ''}
    `;

    content.innerHTML = `
        <div class="projet-detail-header">
            <h1 class="projet-detail-title">${projet.titre}</h1>
            ${projet.sousTitre ? `<p class="projet-detail-subtitle">${projet.sousTitre}</p>` : ''}
            <p class="projet-detail-desc">${projet.desc}</p>
            <div class="projet-detail-links">
                ${linksHTML}
            </div>
        </div>
        
        ${carouselHTML}
        
        <div class="projet-detail-content">
            <div class="projet-detail-section">
                <h2>À propos du projet</h2>
                <p>${projet.detail}</p>
                ${technologiesHTML}
            </div>
            ${contexteSection}
            ${objectifsSection}
            ${responsabilitesSection}
            ${featuresSection}
            ${resultatsSection}
            ${competenceSection}
        </div>
    `;

    // Initialiser le carrousel
    if (allImages.length > 1) {
        initCarousel(allImages);
    }
}

// Variables globales pour le carrousel
let currentImageIndex = 0;
let images = [];

// Initialiser le carrousel
function initCarousel(imageList) {
    images = imageList;
    currentImageIndex = 0;

    // Créer les indicateurs
    const indicator = document.getElementById('carousel-indicator');
    if (indicator) {
        indicator.innerHTML = images.map((_, index) =>
            `<div class="carousel-dot ${index === 0 ? 'active' : ''}" onclick="goToImage(${index})"></div>`
        ).join('');
    }

    // Créer les miniatures
    const thumbnails = document.getElementById('carousel-thumbnails');
    if (thumbnails) {
        thumbnails.innerHTML = images.map((img, index) =>
            `<div class="carousel-thumbnail ${index === 0 ? 'active' : ''}" onclick="goToImage(${index})">
                <img src="${img}" alt="Miniature ${index + 1}">
            </div>`
        ).join('');
    }
}

// Changer d'image
function changeImage(direction) {
    currentImageIndex += direction;

    if (currentImageIndex < 0) {
        currentImageIndex = images.length - 1;
    } else if (currentImageIndex >= images.length) {
        currentImageIndex = 0;
    }

    goToImage(currentImageIndex);
}

// Aller à une image spécifique
function goToImage(index) {
    currentImageIndex = index;

    // Mettre à jour l'image principale
    const mainImg = document.getElementById('carousel-main-img');
    if (mainImg) {
        mainImg.src = images[currentImageIndex];
    }

    // Mettre à jour les indicateurs
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentImageIndex);
    });

    // Mettre à jour les miniatures
    const thumbnails = document.querySelectorAll('.carousel-thumbnail');
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === currentImageIndex);
    });
}

// Navigation au clavier
document.addEventListener('keydown', (e) => {
    if (images.length > 1) {
        if (e.key === 'ArrowLeft') {
            changeImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeImage(1);
        }
    }
});

// Charger le projet au chargement de la page
if (projetId) {
    loadProjetDetail();
} else {
    document.getElementById('projet-detail-content').innerHTML =
        '<p>ID de projet manquant.</p>';
}

