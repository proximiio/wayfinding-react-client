# Proximiio Wayfinding Client

## Table of Contents

- [Proximiio Wayfinding Client](#proximiio-wayfinding-client)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Building the App](#building-the-app)
- [Dockerization](#dockerization)
- [Changing Default Colors](#changing-default-colors)
- [Configuring Manifest with Vite-PWA](#configuring-manifest-with-vite-pwa)
- [Project Structure](#project-structure)

## Installation

To get started, clone this repository:

```bash
git clone https://github.com/proximiio/wayfinding-react-client.git
cd wayfinding-react-client

# Install dependencies
npm install
# or
yarn
```

## Configuration

Explain any necessary configuration steps users might need to take, such as setting up environment variables, API keys, or any other configurations.

## Usage

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open http://localhost:6001 to view it in your browser.

## Building the App

To build the app for production:

```bash
npm run build
# or
yarn build
```

## Dockerization

To build a Docker image for this app:

```bash
docker build -t proximiio-wayfinding-client .
```

Run the Docker container:

```bash
docker run -p 8080:80 proximiio-wayfinding-client
```

The app will be available at http://localhost:8080.

## Configuring Manifest with Vite-PWA

This project utilizes `vite-plugin-pwa` for Progressive Web App (PWA) functionality. To configure the manifest file using Vite-PWA, follow these steps:

### Manifest Configuration

1. **Locate the Configuration File:** The Vite-PWA plugin allows you to configure the PWA manifest file. Look for the `vite.config.ts` file in the root directory of your project.

2. **Update the Plugin Configuration:** Within the Vite configuration file, find the section where the `vite-plugin-pwa` is defined. There, you can specify various settings including the `manifest` object.

   ```javascript
   import { VitePWA } from 'vite-plugin-pwa';

   export default {
   	plugins: [
   		VitePWA({
   			manifest: {
   				/* Add or modify manifest properties here */
   				name: 'Your App Name',
   				short_name: 'Short Name',
   				/* Other manifest properties */
   			},
   			/* Other Vite-PWA configurations */
   		}),
   	],
   };
   ```

3. **Edit Manifest Properties:** Customize the properties within the `manifest` object according to your application's requirements. This includes the app's name, short name, icons, theme color, background color, and other relevant metadata.

4. **Generate App Icons:** Ensure you have app icons in various sizes to support different devices. You can use online tools or generators like [favicon.io](https://favicon.io/) and [maskable.app](https://maskable.app/) to create these icons and replace the default ones specified in the manifest.

5. **Test the PWA:** After making changes to the manifest configuration, rebuild your app (`npm run build` or `yarn build`) and test the PWA functionality on a supported browser or device.

## Changing Default Colors

Shadow UI kit relies on CSS variables for its color scheme. To modify the default colors:

1. **Locate the CSS Variables:** The default color variables are defined in the styling files or within the Shadow UI kit files. They usually follow a naming convention like `--primary-color`, `--secondary-color`, etc.

2. **Override Variables:** To change the default colors, you can override these CSS variables in your own stylesheet. For instance:

   ```css
   /* Define new color variables */
   :root {
   	--custom-primary-color: #your-color-code;
   	--custom-secondary-color: #your-color-code;
   	/* Add more variables for other colors if needed */
   }

   /* Apply the custom colors to elements */
   /* Example using the custom primary color */
   .your-element {
   	color: var(--custom-primary-color);
   	/* Other styling rules */
   }
   ```

3. **Apply the Custom Colors:** Update the UI components or elements by using these custom CSS variables within your project's stylesheets or component-specific styles.

By modifying these CSS variables, you can easily customize the default colors provided by the Shadow UI kit to match your desired color scheme throughout your application.

## Project Structure

Briefly explain the structure of your project, especially if it deviates from the default Vite or React setup. You can mention key directories or files and their purposes.

Here's an overview of the directory structure of this project:

```bash
proximiio-wayfinding-client/
│
├── public/
│   ├── index.html
│   └── ... (other static assets)
│
├── src/
│   ├── components/
│   │   └── ... (React components)
│   │
│   ├── pages/
│   │   └── ... (Different app pages)
│   │
│   ├── styles/
│   │   └── ... (CSS or styling files)
│   │
│   ├── utils/
│   │   └── ... (Utility functions)
│   │
│   ├── App.js
│   ├── index.js
│   └── ... (other main project files)
│
├── .gitignore
├── package.json
├── README.md
├── Dockerfile
└── ... (other configuration files or additional folders)
```