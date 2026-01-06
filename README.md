# Portfolio One-Page

Portfolio moderne avec sections dynamiques chargées depuis des fichiers JSON.

## 🚀 Démarrage rapide

### Option 1 : Serveur Python (recommandé)

```bash
# Python 3
python3 -m http.server 8000

# Puis ouvrez dans votre navigateur :
# http://localhost:8000
```

### Option 2 : Serveur Node.js

```bash
# Si vous avez Node.js installé
npx http-server -p 8000

# Puis ouvrez dans votre navigateur :
# http://localhost:8000
```

### Option 3 : Extension VS Code

Installez l'extension "Live Server" dans VS Code, puis cliquez sur "Go Live" en bas à droite.

## ⚠️ Important

**Ne pas ouvrir directement `index.html` dans le navigateur** (file://) car les fichiers JSON ne se chargeront pas à cause des restrictions CORS du navigateur.

Vous devez utiliser un serveur local pour que tout fonctionne correctement.

## 📁 Structure des fichiers

- `index.html` - Page principale
- `projet-detail.html` - Page de détail d'un projet
- `styles.css` - Styles principaux
- `projet-detail.css` - Styles pour la page de détail
- `script.js` - Script principal
- `projet-detail.js` - Script pour la page de détail
- `data/projets.json` - Liste des projets
- `data/competences.json` - Compétences par catégorie
- `data/parcours.json` - Parcours scolaire et professionnel

## ✏️ Personnalisation

### Modifier les projets

Éditez `projets.json` :

```json
{
  "id": 1,
  "titre": "Mon Projet",
  "desc": "Description courte",
  "detail": "Description détaillée...",
  "mainImg": "url-de-l-image.jpg",
  "autreImg": ["img1.jpg", "img2.jpg"],
  "technologies": ["React", "Node.js"],
  "lienProjet": "https://...",
  "lienCode": "https://github.com/..."
}
```

### Modifier les compétences

Éditez `competences.json` avec vos compétences organisées par catégorie.

### Modifier le parcours

Éditez `parcours.json` avec votre parcours scolaire et professionnel.

## 🐛 Dépannage

Si rien ne s'affiche :
1. Vérifiez que vous utilisez un serveur local (pas file://)
2. Ouvrez la console du navigateur (F12) pour voir les erreurs
3. Vérifiez que tous les fichiers JSON sont présents
4. Vérifiez que les fichiers JSON sont valides (syntaxe correcte)

