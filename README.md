# Description

This is a template for react development with `phonegap` cross-platform support.

Phonegap has a minimal `config.xml` and its `www/` folder contains symlinks to `../../client/(required_files)`.

In short, you get [react-hot-loader](https://github.com/gaearon/react-hot-loader) with **state preservation** for browser and **live reload** for [Phonegap Developer App](http://docs.phonegap.com/getting-started/2-install-mobile-app/) that syncs the project to your mobile devices on file changes.

# Usage

```bash
# install dependencies

cd server; npm i; cd ..
cd client; npm i; cd ..

### CLIENT

# terminal 1
cd client
npm run dev # localhost:8080, has react-hot-loader with state preservation

# terminal 2
cd client
npm run watch # updates bundle.js on file changes

# terminal 3
cd phonegap
phonegap serve # localhost:3000, has live reload with `phonegap developer app`

### SERVER

# terminal 4
cd server
npm run watch # rebuilds on file changes

# terminal 5
cd server
npm run start # nodemon restarts server on file changes
```

# Includes

### Client

#### react
  - router
  - hot-loader

#### redux
  - thunk

#### webpack
  - dev-server

#### babel
  - es6
  - typecheck
  - async

### Server

#### webpack
  - dev-server
  - express
  - nodemon

#### babel
  - es6
  - typecheck
  - async
