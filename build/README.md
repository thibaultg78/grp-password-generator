# Build & Release

## Icônes de l'application

Les icônes sont dans ce dossier :

- `icon.icns` — Pour macOS (512x512 minimum)
- `icon.ico` — Pour Windows (256x256 minimum)
- `icon.png` — Source PNG (1024x1024 recommandé)

### Générer de nouvelles icônes

1. Créez une image `icon.png` de 1024x1024 pixels
2. Convertissez avec https://cloudconvert.com :
   - PNG → ICNS (macOS)
   - PNG → ICO (Windows)

---

## Commandes de build

### Prérequis

```bash
# Installer Node.js (si pas déjà fait)
# macOS
brew install node

# Windows
winget install OpenJS.NodeJS.LTS
```

### Installation des dépendances

```bash
npm install
```

### Développement local

```bash
# Avec Docker (recommandé)
docker compose up

# Ou directement
npm run dev
```

L'app sera accessible sur http://localhost:5173

### Build des applications

```bash
# Build macOS (.dmg)
npm run electron:build:mac

# Build Windows (.exe)
npm run electron:build:win

# Build les deux
npm run electron:build:all
```

Les fichiers générés sont dans le dossier `release/`.

> ⚠️ **Windows** : Lancer PowerShell en **Administrateur** pour éviter les erreurs de permissions.

---

## Release via GitHub Actions

1. Aller sur le repo GitHub → **Actions**
2. Cliquer sur **"Build & Release"**
3. Cliquer sur **"Run workflow"**
4. Remplir :
   - **Version** : ex. `2.1.0`
   - **Nouveautés** : ex. `- Nouvelle feature X`
5. Cliquer sur **"Run workflow"**

Les builds macOS et Windows sont générés automatiquement et publiés dans une **Release** GitHub.

---

## Structure du projet

```
grp-password-generator/
├── src/                    # Code source React
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   ├── hooks/              # useTranslation, useTheme
│   └── locales/            # fr.json, en.json
├── electron/
│   └── main.cjs            # Point d'entrée Electron
├── build/                  # Icônes
├── release/                # Builds générés (gitignore)
├── package.json
├── vite.config.js
├── Dockerfile
└── docker-compose.yml
```