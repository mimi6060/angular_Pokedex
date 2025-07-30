
# 🧪 Angular Challenge – Pokédex App

## 📋 Description

Ce projet est un **Pokédex** développé en Angular, dans le cadre d'un challenge technique. Il utilise l'API [PokeAPI](https://pokeapi.co/docs/v2) pour afficher les données des Pokémon.

L’objectif principal est d’évaluer la capacité à structurer une application Angular en respectant de bonnes pratiques tout en offrant une expérience utilisateur fluide.

---

## 🎯 Fonctionnalités

### 1. 🧾 Liste des Pokémon
- Affichage de tous les Pokémon disponibles via la [PokeAPI](https://pokeapi.co/docs/v2).
- Pagination pour naviguer efficacement dans la liste.
  - Implémentation d’un système de pagination clair et intuitif.
  - Plusieurs stratégies de pagination ont été considérées ; la plus adaptée a été retenue pour optimiser l’expérience utilisateur.

### 2. 📄 Page de détails
- Chaque Pokémon listé est **cliquable**, menant à une **page de détails dédiée**.
- Les informations affichées incluent :
  - **Nom** et **ID**
  - **Sprites** (images)
  - **Types** (ex. : Fire, Water, Grass)
  - **Capacités** (_Abilities_)
  - **Statistiques** (HP, Attaque, Défense, Vitesse, etc.)

### 3. 💻 Responsive
- L'application est conçue pour être **responsive sur les écrans de bureau**.
- L'affichage mobile n’est pas requis pour ce challenge.

---

## 🚀 Démarrage du projet

### 🔧 Prérequis
- Node.js
- npm

### 📦 Installation

```bash
npm install
```

### ▶️ Lancement

```bash
npm run start
```

L'application sera accessible sur `http://localhost:4200/`.

---

## 🌐 Démo en ligne

Le projet est déployé et accessible à l'adresse suivante :

👉 [https://kaleidoscopic-paprenjak-7552a7.netlify.app/pokemons/80](https://kaleidoscopic-paprenjak-7552a7.netlify.app/pokemons/80)

---

## 📁 Structure du projet

```
src/
├── app/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── models/
│   └── app.module.ts
├── assets/
└── index.html
```

---

## 🛠️ Technologies utilisées

- Angular
- TypeScript
- RxJS
- HTML/CSS
- PokeAPI

---
