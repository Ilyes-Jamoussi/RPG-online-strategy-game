# RPG Online Strategy Game

<div align="center">
  
  [<img src="https://img.shields.io/badge/-English-blue?style=for-the-badge">](#overview)
  [<img src="https://img.shields.io/badge/-Français-green?style=for-the-badge">](#aperçu)

</div>

---

## Overview

RPG Online Strategy Game is a multiplayer web-based role-playing strategy game built with Angular and NestJS. Players can create custom characters, join game sessions, and engage in strategic gameplay on customizable maps. The game features real-time multiplayer functionality, character creation with avatars, inventory management, and turn-based combat mechanics.

<div align="center">
    <img src="game-demo.gif" alt="RPG Strategy Game Demo" width="600"><br><br>
</div>

The application consists of a dynamic Angular frontend with real-time communication via Socket.IO and a robust NestJS backend with MongoDB integration for persistent game data.

## Key Features

- **Character Creation**: Customize your character with various avatars and attributes
- **Multiplayer Sessions**: Create or join game rooms with other players
- **Real-time Gameplay**: Live updates using WebSocket connections
- **Map Editor**: Design custom game maps with tiles and objects
- **Inventory System**: Manage items and equipment
- **Turn-based Combat**: Strategic dice-based combat system
- **Chat System**: In-game communication between players

## Prerequisites

Before starting, ensure you have the following installed:
- **Node.js**: Version 18.x or later
- **npm**: Node package manager (comes with Node.js)
- **MongoDB**: For database functionality (local or cloud instance)

## Project Setup

### Install Dependencies

Navigate to both client and server directories and install dependencies:

```bash
# Install root dependencies
npm ci

# Install client dependencies
cd client
npm ci

# Install server dependencies
cd ../server
npm ci
```

### Environment Configuration

Create a `.env` file in the server directory with your MongoDB connection string and other environment variables:

```bash
# Server environment variables
DATABASE_URL=mongodb://localhost:27017/rpg-strategy-game
PORT=5020
```

## Local Development

### Start the Development Servers

You can start both client and server simultaneously:

```bash
# Start both client and server
npm start
```

Or start them individually:

```bash
# Start client only (runs on http://localhost:4200)
npm run start:client

# Start server only (runs on http://localhost:5020)
npm run start:server
```

The client will be accessible at `http://localhost:4200` and the server at `http://localhost:5020`.

## Build and Deploy

### Build for Production

```bash
# Build client
cd client
npm run build

# Build server
cd ../server
npm run build
```

### Run Tests

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run coverage

# Run linting
npm run lint
```

## Game Architecture

- **Frontend**: Angular 19 with Angular Material UI components
- **Backend**: NestJS framework with Express
- **Database**: MongoDB with Mongoose ODM
- **Real-time Communication**: Socket.IO for WebSocket connections
- **Authentication**: Session-based player management

---

<br><br><br>

---

## Aperçu

RPG Online Strategy Game est un jeu de rôle stratégique multijoueur basé sur le web, construit avec Angular et NestJS. Les joueurs peuvent créer des personnages personnalisés, rejoindre des sessions de jeu et s'engager dans un gameplay stratégique sur des cartes personnalisables. Le jeu propose des fonctionnalités multijoueurs en temps réel, la création de personnages avec avatars, la gestion d'inventaire et des mécaniques de combat au tour par tour.

<div align="center">
    <img src="game-demo.gif" alt="RPG Strategy Game Demo" width="600"><br><br>
</div>

L'application se compose d'un frontend Angular dynamique avec communication en temps réel via Socket.IO et d'un backend NestJS robuste avec intégration MongoDB pour les données de jeu persistantes.

## Fonctionnalités Principales

- **Création de Personnage**: Personnalisez votre personnage avec divers avatars et attributs
- **Sessions Multijoueurs**: Créez ou rejoignez des salles de jeu avec d'autres joueurs
- **Gameplay en Temps Réel**: Mises à jour en direct utilisant les connexions WebSocket
- **Éditeur de Carte**: Concevez des cartes de jeu personnalisées avec tuiles et objets
- **Système d'Inventaire**: Gérez les objets et équipements
- **Combat au Tour par Tour**: Système de combat stratégique basé sur les dés
- **Système de Chat**: Communication en jeu entre joueurs

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés :
- **Node.js** : Version 18.x ou ultérieure
- **npm** : Gestionnaire de packages Node (fourni avec Node.js)
- **MongoDB** : Pour les fonctionnalités de base de données (instance locale ou cloud)

## Configuration du Projet

### Installation des Dépendances

Naviguez vers les répertoires client et serveur et installez les dépendances :

```bash
# Installer les dépendances racine
npm ci

# Installer les dépendances client
cd client
npm ci

# Installer les dépendances serveur
cd ../server
npm ci
```

### Configuration de l'Environnement

Créez un fichier `.env` dans le répertoire serveur avec votre chaîne de connexion MongoDB et autres variables d'environnement :

```bash
# Variables d'environnement du serveur
DATABASE_URL=mongodb://localhost:27017/rpg-strategy-game
PORT=5020
```

## Développement Local

### Démarrer les Serveurs de Développement

Vous pouvez démarrer le client et le serveur simultanément :

```bash
# Démarrer le client et le serveur
npm start
```

Ou les démarrer individuellement :

```bash
# Démarrer le client uniquement (s'exécute sur http://localhost:4200)
npm run start:client

# Démarrer le serveur uniquement (s'exécute sur http://localhost:5020)
npm run start:server
```

Le client sera accessible à `http://localhost:4200` et le serveur à `http://localhost:5020`.

## Construction et Déploiement

### Construction pour la Production

```bash
# Construire le client
cd client
npm run build

# Construire le serveur
cd ../server
npm run build
```

### Exécuter les Tests

```bash
# Exécuter tous les tests
npm run test

# Exécuter les tests avec couverture
npm run coverage

# Exécuter le linting
npm run lint
```

## Architecture du Jeu

- **Frontend** : Angular 19 avec composants Angular Material UI
- **Backend** : Framework NestJS avec Express
- **Base de Données** : MongoDB avec Mongoose ODM
- **Communication Temps Réel** : Socket.IO pour les connexions WebSocket
- **Authentification** : Gestion des joueurs basée sur les sessions
