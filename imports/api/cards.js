import { Meteor } from 'meteor/meteor';

import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


export const Cards = new Mongo.Collection('Cards');

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish Cards that are public or belong to the current user
    Meteor.publish('Cards', function cardsPublication() {
      return Cards.find({});
    });
  }

  
Meteor.methods({
    'Cards.get'(_arrayCheckpoints) {
      check(_arrayCheckpoints, Array);
   
      // Make sure the user is logged in before inserting a task
      if (! this.userId) {
        throw new Meteor.Error('not-authorized');
      }
      let ret =Cards.find({}).fetch() 
      console.log(ret)
       return ret ;
    }
  });
