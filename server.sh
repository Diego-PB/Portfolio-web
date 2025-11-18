#!/bin/bash

# Script pour lancer un serveur local pour le portfolio

echo "🚀 Démarrage du serveur local..."
echo ""
echo "Le portfolio sera accessible à l'adresse :"
echo "👉 http://localhost:8000"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Vérifier si Python 3 est disponible
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8000
else
    echo "❌ Python n'est pas installé."
    echo "Installez Python ou utilisez Node.js avec: npx http-server -p 8000"
    exit 1
fi

