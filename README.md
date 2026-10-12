# psd-motion-studio

> **Movent — PSD Motion Studio**: Transforma archivos PSD en vídeos animados para Stories y Reels con motor de timeline determinista y dirección creativa por IA.

🔗 **Demo en vivo**: [https://alvarodesigns.github.io/psd-motion-studio/](https://alvarodesigns.github.io/psd-motion-studio/)

---

## ✨ Características

- 🎨 **Importación directa de PSD**: Parseo de capas, estilos y jerarquías con `ag-psd`.
- ⏱️ **Motor de Timeline Determinista**: Animaciones fluidas basadas en frames y timecode preciso para Stories (9:16) y formatos sociales.
- 🤖 **Dirección Creativa por IA**: Sugerencias de ritmo, transiciones y presets de animación automatizados.
- ⚡ **Rápido y Reactivo**: Desarrollado con React 19, TypeScript y Vite.

---

## 🛠️ Tecnologías

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [ag-psd](https://github.com/Agamennon/ag-psd)
- [Lucide Icons](https://lucide.dev/)

---

## 🚀 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build
npm run preview
```

---

## 📦 Despliegue en GitHub Pages

El proyecto incluye un flujo de trabajo automatizado en GitHub Actions (`.github/workflows/deploy.yml`) que compila y publica automáticamente la aplicación en cada commit a la rama `main`.
