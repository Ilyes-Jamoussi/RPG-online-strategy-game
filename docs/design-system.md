# Design System Documentation

## 🎨 Thème Visuel

### Palette de Couleurs

```scss
// Couleurs principales
- Fond principal: linear-gradient(135deg, #0a192f 0%, #112240 100%)
- Bleu accent: #0284c7
- Bleu hover: #0369a1
- Bleu clair: #0ea5e9
```

### Animations Signatures

```scss
// Animation du titre
@keyframes titleFloat {
    0%,
    100% {
        transform: translateY(0) scale(1);
        background-position: 0% center;
        filter: brightness(100%);
    }
    25% {
        transform: translateY(-6px) scale(1.01);
        background-position: 50% center;
        filter: brightness(110%);
    }
    50% {
        transform: translateY(0) scale(1);
        background-position: 100% center;
        filter: brightness(100%);
    }
    75% {
        transform: translateY(6px) scale(0.99);
        background-position: 50% center;
        filter: brightness(110%);
    }
}

// Animation de lueur
@keyframes glowPulse {
    0%,
    100% {
        opacity: 0.3;
        transform: translateY(-50%) scale(0.95);
    }
    50% {
        opacity: 0.7;
        transform: translateY(-50%) scale(1.05);
    }
}
```

### Composants UI

#### Conteneurs

```scss
.container {
    background: rgba(17, 34, 64, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(2, 132, 199, 0.1);
}
```

#### Boutons

```scss
.button {
    padding: 1.3rem;
    border-radius: 12px;
    background: #0284c7;
    color: white;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
        background: #0369a1;
        transform: translateY(-2px);
    }
}
```

#### Inputs

```scss
.input {
    height: 70px;
    border-radius: 15px;
    border: 2px solid rgba(2, 132, 199, 0.2);
    background: rgba(17, 34, 64, 0.95);
    color: #0284c7;

    &:focus {
        border-color: #0284c7;
        box-shadow: 0 0 30px rgba(2, 132, 199, 0.2);
    }
}
```

### Typographie

```scss
- Font-family: 'Poppins', sans-serif
- Titres: clamp(2.5rem, 5vw, 4rem)
- Letter-spacing titres: 2px
- Font-weight titres: 700
```

### Effets et Transitions

-   Tous les hovers avec transformation légère
-   Effets de lueur sur focus
-   Transitions fluides (0.3s cubic-bezier)
-   Feedback visuel sur interactions
-   Blur effects pour profondeur

### Responsive Design

```scss
// Breakpoints
@media (max-width: 768px) {
    // Tablette
}

@media (max-width: 480px) {
    // Mobile
}
```

## 📝 Notes Importantes

### Standards de Développement

1. Composants Angular standalone
2. Séparation des fichiers (HTML, SCSS, TS)
3. Logique métier dans les services
4. Utilisation des @Input() et @Output()
5. Typage strict
6. Pas de styles ou templates inline

### Maintenance de la Cohérence

-   Réutiliser les mêmes animations
-   Maintenir la palette de couleurs
-   Appliquer les mêmes effets d'interaction
-   Respecter la hiérarchie visuelle
-   Utiliser les mêmes timings d'animation

### Bonnes Pratiques

-   Components simples et réutilisables
-   Services pour la logique métier
-   Nommage clair en kebab-case
-   Organisation par features
-   Tests unitaires
