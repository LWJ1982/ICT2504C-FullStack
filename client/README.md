# SIT-URMS
# Instructions on how to run the application locally
## Setup the .env in the client folder (FrontEnd)

```bash
VITE_API_BASE_URL = "http://localhost:3000/api/v1" # Server Backend URL, make sure to match the port and url link
VITE_GOOGLE_MAPS_API_KEY = "<Google Maps API Key>"
VITE_GOOGLE_CLIENT_KEY = "<Google OAuth2 Client Key>"
```

## Dependancy for the client (FrontEnd)
```bash
npm create vite .
npm install
```

## To start the client (FrontEnd)
cd into the client folder
```bash
npm start
```

## Troubleshooting
For CMD terminal

Perform the below on the client folder, for vite projects

```bash
npm i vite
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.