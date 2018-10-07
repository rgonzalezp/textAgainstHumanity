# Text against humanity
Like cards against humanity, but with your input!

## Table of Contents
- [Demo](#demo)
- [Objectives](#objectives)
- [Technologies](#technologies)
- [Authors](#authors)
- [Quickstart](#quickstart)
- [Preview](#preview)
- [Copyright and license](#copyright-and-license)

## Demo
Add link to demo

## Objectives
- Recreate a fun game with a small new twist

- Make a game with free access

- Have fun!

## Technologies
- meteor, mongodb, react, reactstrap and many more libraries... 

## Authors:
- Ricardo Enrique Gonzalez Penuela: https://rgonzalezp.github.io/
- Esteban Galvis: https://tebandesade.github.io/

## Quickstart:
- Small note: You need to have installed mongodb and meteor to make the necessary imports to the mongo database and run the app
- ```meteor npm install``` to install node modules in the project folder
- ```meteor``` to deploy the local server
- Make sure you first import the card decks (Some default decks in the /db folder) before you start playing

## Preview
![alt text](preview/Homepage.png "Preview of Text against humanity homepage")
![alt text](preview/Gameroom.png "Preview of Text against humanity game room")

## Cards
- Decks provided by : https://crhallberg.com/cah/
- To import decks of cards use `mongoimport --host localhost:3001 --db meteor --collection Cartas --type json --file db/bd_cards.json --jsonArray`
- Add your own personal made decks too!

## Copyright and license
Code Copyright 2018 Ricardo Enrique Gonzalez Peñuela, Esteban Galvis. Code released under the MIT license.

