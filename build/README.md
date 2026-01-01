# Icônes de l'application

Placez ici les icônes de l'application :

- `icon.icns` — Pour macOS (512x512 minimum)
- `icon.ico` — Pour Windows (256x256 minimum)
- `icon.png` — Source PNG (1024x1024 recommandé)

## Générer les icônes

### Option 1 : Depuis une image PNG

1. Créez une image `icon.png` de 1024x1024 pixels
2. Utilisez un outil en ligne comme https://cloudconvert.com pour convertir :
   - PNG → ICNS (macOS)
   - PNG → ICO (Windows)

### Option 2 : Sans icône personnalisée

Si vous n'avez pas d'icône, electron-builder utilisera une icône par défaut.
Supprimez simplement les lignes `icon` dans package.json.
