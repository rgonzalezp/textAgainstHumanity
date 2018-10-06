# Optimize-Mern
Optimize application developed with the MERN stack

## Table of Contents
- [Demo](#demo)
- [Objectives](#objectives)
- [Technologies](#technologies)
- [Authors](#authors)
- [Quickstart](#quickstart)
- [Documentation](#documentation)
- [Preview](#preview)
- [Copyright and license](#copyright-and-license)

## Demo
https://optimizelocker.herokuapp.com

## Objectives
- Show off programming and design abilities, building a full-stack fully functional application

- Create an useful tool that helps the community

- Make a website that can become bigger and expandable into new domains

- Have fun!

## Technologies
- MERN Stack, mongodb, express, react, redux, reactstrap, node, material.ui, react-share, and many more libraries...

## Authors:
- Ricardo Enrique Gonzalez Penuela: https://rgonzalezp.github.io/
- Santiago Munera: https://sfmunera10.github.io/

## Quickstart:

- ```npm install``` to install node modules in the project folder
- ```npm run client-install``` to install the client
- add configuration file for oktaClient connection both in front and backend:
- Add "configfile.js" in client src folder with this code: ```export default{ url: '<<your okta domain>>', issuer: 'https://dev-767504.oktapreview.com/oauth2/default', redirect_uri: window.location.origin + '/implicit/callback', client_id: '<<your id client>>'};```
- Add "oktaClient.js" in root/lib folder with this code: ```const okta = require('@okta/okta-sdk-nodejs'); const client = new okta.Client({ orgUrl: '<<your okta domain>>', token: '<<secret-token>>'}); module.exports = client;```
- Add Google Api key at client/src/components/shared/Plans.js
-Request your keys by contacting Santiago Múnera or Ricardo González at Slack https://web-dev-uniandes.slack.com/messages
- use command ```npm run dev``` to run client and backend concurrently
- Save any changes to the files and the server will automatically notice changes and re-deploy
- Also, make sure you are using a valid mongodb user @ config/keys.js

## Preview
![alt text](images/WebScreenshot.png "Preview of Optimize")

## Cards

to import cards use `mongoimport --host localhost:3001 --db meteor --collection Cartas --type json --file db/bd_cards.json --jsonArray`
## Copyright and license
Code Copyright 2018 Ricardo Enrique Gonzalez Peñuela, Esteban Galvis. Code released under the MIT license.

