# Proximiio Wayfinding Client

## Table of Contents

- [Proximiio Wayfinding Client](#proximiio-wayfinding-client)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Changing BASE_URL](#changing-base_url)
- [Usage](#usage)
- [Building the App](#building-the-app)
- [Dockerization](#dockerization)
- [Changing Default Colors](#changing-default-colors)
- [Configuring Manifest with Vite-PWA](#configuring-manifest-with-vite-pwa)
- [Project Structure](#project-structure)
	- [Store Data](#store-data)
		- [Filter Items](#filter-items)
		- [Kiosks](#kiosks)
- [Initiate the map with url params](#initiate-the-map-with-url-params)

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

Before you run development server please check out `.env` file and fill the configuration fields with your data.

```bash
# Base URL app will be initiated with
# when you define e.g '/something', your app will be available at http://localhost:6001/something
# some more edits are required when defining this, check out below
BASE_URL=
PORT=6001 # app dev/preview server will run on this port

VITE_APP_TITLE=Proximi.io - Wayfinding Client # app title
VITE_PROXIMIIO_TOKEN=PASTE YOUR TOKEN HERE # fill your proximi.io token here
VITE_PROXIMIIO_API=https://api.proximi.fi # api address, you don't need to change this
VITE_PROXIMIIO_GEO_VERSION=v5 # geo api version, you don't need to change this

# default place id your app will be initated with
VITE_WAYFINDING_DEFAULT_PLACE_ID=PASTE YOUR DEFAULT PLACE ID HERE
# define feature id which is considered as entrance of your venue
# it's also default starting point for kiosks
VITE_WAYFINDING_ENTRANCE_FEATURE_ID=PASTE YOUR ENTRANCE FEATURE ID HERE
# define parking amenity id if you have one
VITE_WAYFINDING_PARKING_AMENITY_ID=PASTE YOUR PARKING AMENITY ID HERE
# default longitude coordinate for map center
VITE_WAYFINDING_DEFAULT_LOCATION_LONGITUDE=longitude
# default latitude coordinate for map center
VITE_WAYFINDING_DEFAULT_LOCATION_LATITUDE=latitude
# default level your app will be initiated on
VITE_WAYFINDING_DEFAULT_LOCATION_LEVEL=0
# default map zoom
VITE_WAYFINDING_DEFAULT_ZOOM=19
# default map pitch
VITE_WAYFINDING_DEFAULT_PITCH=40
# default map bearing
VITE_WAYFINDING_DEFAULT_BEARING=12
# show/hide language toggle component
VITE_WAYFINDING_SHOW_LANGUAGE_TOGGLE=false
# show/hide reset button component (will reset the view and refetch data)
VITE_WAYFINDING_SHOW_RESET_BUTTON=false
# if app is initated as kiosk enable/disable virtual keyboard
VITE_WAYFINDING_USE_VIRTUAL_KEYBOARD_AT_KIOSKS=false
# use your device gps location within the app
VITE_WAYFINDING_USE_GPS_LOCATION=false
# enable/disable auto data refetch in default 1 hour interval
VITE_WAYFINDING_AUTO_DATA_REFETCH=false
# change interval for auto data refetch
VITE_WAYFINDING_REFETCH_INTERVAL=3600000 # 1 hour
# max 4 items per category, the last one will be toggle button
VITE_WAYFINDING_CATEGORY_ITEMS_LIMIT=5
# show/hide ads sidebar
VITE_WAYFINDING_SHOW_ADS=true
# time after last interaction, user session will be resetted
VITE_WAYFINDING_SESSION_TIMEOUT=60000 # 1 minute
```

### Changing BASE_URL

After you change your `BASE_URL` in `.env` file to e.g `/something`, there are few more parts of code required to change. **In case you don't plan to dockerize your app, only step 1 is mandatory.**

1. in `src/i18n.ts` comment out line 31 and uncomment line 30, this is necessary to keep translations working in production
2. If dockerizing: in `Dockerfile` check line 22-26, uncomment line 23 and comment out line 26, also don't forget to paste your `BASE_URL` in line 23
3. If dockerizing: in `nginx.conf` comment out lines 38-42 and uncomment 45-49 and don't forget to paste your `BASE_URL`

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

Our app use [TailwindCSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) component library for styling.

1. **Locate the CSS Variables:** To change default colors, look for a `src/index.css` file.

2. **Override Variables:** Change values for variables defined in `:root` section, you'll be probably most interested in `--primary, --secondary, --accent` and their `-foreground` variables, use [HSL color values](https://www.w3schools.com/colors/colors_hsl.asp).

   ```css
   /* In this example we change primary to black and primary-foreground to white */
   :root {
   	--primary: 0 0% 0%;
   	--primary-foreground: 100 100% 100%;
   }
   ```

In our app we use same color for `secondary` and `accent` but you can of course use different for each of them if required.

## Project Structure

Briefly explain the structure of your project, especially if it deviates from the default Vite or React setup. You can mention key directories or files and their purposes.

Here's an overview of the directory structure of this project:

```bash
proximiio-wayfinding-client/
│
├── public/
│   ├── locales/ (translations json files)
│   ├── ... (PWA manifest files)
│   └── ... (other static assets)
│
├── src/
│   ├── components/
│   │   ├── ui/ (UI components)
│   │   ├── MapView.tsx (place where we initate the map, you can change map configuration here)
│   │   └── ... (other react components)
│   │
│   ├── hooks/
│   │   ├── useKiosk.tsx (Custom hook for handling kiosk behavior)
│   │   └── useRouting.tsx (Custom hook for handling route finding)
│   │
│   ├── lib/
│   │   └── utils.ts (Utility functions)
│   │
│   ├── models/
│   │   └── ... (some custom interface models)
│   │
│   ├── store/
│   │   ├── data.ts (We store there some static data for filters and kiosks)
│   │   └── mapStore.ts (Global data store)
│   │
│   ├── App.tsx (the place where the app is initialized)
│   ├── i18n.ts (internationalizations config)
│   ├── index.css (styling)
│   └── ... (other main project files)
│
├── .env (configurations file)
├── .gitignore
├── DockerFile (Docker configuration)
├── index.html
├── nginx.conf (Nginx configuration file for dockerizing)
├── package.json
├── README.md
└── ... (other configuration files or additional folders)
```

### Store Data

In file `src/store/data.ts` you can define `filterItems` which are then displayed in a Sidebar component via Filters component. In the same file you can define `kiosks` which is a list of venue kiosks and the app can be initiated as kiosk via urlParams using the kiosk name parameter defined there.

#### Filter Items

Model for filter items can be found here `src/models/filterItem.model.tsx`.

```javascript
export interface FilterItemModel {
	title: string;
	icon?: string;
	iconImage?: string;
	id: string | string[];
	type: 'list' | 'closest';
}
```

Based on this, every FilterItem entry should contain:

- `type` we have two types of filters, `list` which will list all available features in **PoiList** component and the `closest` which should automatically pick up closest feature to starting point
- `title` which should be string defined in `translation.json` file
- `icon/iconImage` for icon from [react-icons](https://react-icons.github.io/react-icons/) library use `icon` and for static image from assets folder use `iconImage`
- `id` which could be a string or an array of strings of amenity id/'s to filter out (for `closest` type it should be always a single id)

#### Kiosks

Model for kiosk can be found here `src/models/kiosk.model.tsx`.

```javascript
export interface KioskModel {
	name: string;
	latitude?: number;
	longitude?: number;
	level?: number;
	zoom?: number;
	pitch?: number;
	bearing?: number;
	bounds?: [[number, number], [number, number]];
	poiId?: string;
}
```

Important property here is the `name`, we are calling it via url params when then map should be initated like kiosk, e.g. http://localhost:6001?kiosk=kioskName

There are two options how to define kiosk location

1. Using `latitude, longitude, level` properties
2. Or you can omit them and use `poiId`, id of existing map feature

Then you can define also default `zoom`, `pitch` and `bearing`. If you want to limit the bounding box you can use `bounds` property.

## Initiate the map with url params
In demo we have `handleUrlParams` enabled as default, so you can pass some url params into browser url to load map with predefined route generated for example. We can just serve them like this:

```
http://localhost:6001?defaultPlace=placeIdOrTitle&startFeature=featureIdOrTitle&destinationFeature=featureIdOrTitle
```

or with kiosk behavior

```
http://localhost:6001?kiosk=MyKiosk&destinationFeature=featureIdOrTitle
```