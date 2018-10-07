import { Meteor } from 'meteor/meteor';

import { Mongo } from 'meteor/mongo';

import { check } from 'meteor/check';

 

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({

      $or: [

        { private: { $ne: true } },

        { owner: this.userId },

      ],

    });
  });

  Meteor.publish('task', function tasksPublication(owr) {
    console.log('Entro a publish task',owr);
    return Tasks.findOne({
      owner:owr
    });
  });

  Meteor.publish('gameTime', function tasksPublication(owr) {
    console.log('Entro a game Time',owr);
    return Tasks.findOne({
      owner:owr
    });
  });

}

Meteor.methods({

  'tasks.insert'(text,players) {

    check(text, String);

    console.log('players: ',players)
    // Make sure the user is logged in before inserting a task

    if (! this.userId) {

      throw new Meteor.Error('not-authorized');

    }

    console.log('what is this.userId: ', this.userId)
    
    const game = Tasks.findOne({
      owner: this.userId
    });
    console.log('Game?: ',game);
    if(!game)
    {

      console.log('Do you enter??: ');
      
      Tasks.insert({
        text: text,
        createdAt: new Date(),
        players: players,
        owner: this.userId,
        username: Meteor.users.findOne(this.userId).username,
  
      });  

    }

  },

  'tasks.remove'(taskId) {

    check(taskId, String);

    const task = Tasks.findOne(taskId);

    if (task.private && task.owner !== this.userId) {

      // If the task is private, make sure only the owner can delete it

      throw new Meteor.Error('not-authorized');

    }
 

    Tasks.remove(taskId);

  },

  'tasks.setChecked'(taskId, setChecked) {

    const task = Tasks.findOne(taskId);

    if (task.private && task.owner !== this.userId) {

      // If the task is private, make sure only the owner can check it off

      throw new Meteor.Error('not-authorized');

    }

    check(taskId, String);

    check(setChecked, Boolean);

    Tasks.update(taskId, { $set: { checked: setChecked } });
  }, 
   'tasks.addPlayer'(taskId) {
    const task = Tasks.findOne(taskId);
    const current_user = Meteor.users.findOne(this.userId)
    console.log('entra a addPlayers: ',task)
    console.log('current user:  ',current_user)
    if (task.owner !== this.userId && current_user) {
      task.players.push(current_user.username)
      console.log('task.players: ',task.players)
      Tasks.update(taskId, { $set: { players: task.players } });
    }
    else{
       if(typeof(current_user)==='undefined'){
         alert('Please login or create account to play!')
       }
    }
  },

  'tasks.changeTime'(taskId, newTime) {
    const task = Tasks.findOne(taskId);
    const current_user = Meteor.users.findOne(this.userId);
    console.log('entra a changeTime: ',task);
    console.log('current user:  ',current_user);
    if (task.owner === this.userId && current_user) {
      console.log('task.time: ',task.time);
      Tasks.update(taskId, { $set: { time: newTime } });
    }
  },

  'tasks.setPrivate'(taskId, setToPrivate) {

    check(taskId, String);

    check(setToPrivate, Boolean);

 

    const task = Tasks.findOne(taskId);

 

    // Make sure only the task owner can make a task private

    if (task.owner !== this.userId) {

      throw new Meteor.Error('not-authorized');

    }

    Tasks.update(taskId, { $set: { private: setToPrivate } });

  },
});