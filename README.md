# Dealora — marketplace MERN (style Temu / AliExpress)

Application e-commerce full-stack : **MongoDB**, **Express**, **React**, **Node.js**.

## Lancer le projet

```bash
npm install
npm run install:all
npm run dev
```

- Front : [http://localhost:5173](http://localhost:5173)
- API : [http://localhost:5000](http://localhost:5000)


Si MongoDB n’est pas installé, l’API bascule automatiquement sur un fichier local (`server/data/store.json`). Avec MongoDB, renseignez `MONGO_URI` dans `server/.env`.

## Fonctionnalités

- Accueil : ventes flash, compte à rebours, catégories, grilles produits
- Boutique : recherche, filtres, tri
- Fiche produit, panier, checkout (paiement simulé)
- Auth JWT, commandes, compte
