import { Meteor } from 'meteor/meteor';

import { Mongo } from 'meteor/mongo';

import { check } from 'meteor/check';

import moment from 'moment';

 

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
    return Tasks.find({
      owner:owr
    });
  });

  Meteor.publish('gameTime', function tasksPublication(gameId) {
    console.log('Entro a game Time',gameId);
    return Tasks.find({_id:gameId}
    );
  });

}

Meteor.methods({

  'tasks.insert'(text,players,cartas) {

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
        game_on: false,
        player_1:{},
        player_2:{},
        player_3:{},
        player_4:{},
        player_1votes:0,
        player_2votes:0,
        player_3votes:0,
        player_4votes:0,
        cards:cartas,
        currentWinner:{},
        time:moment.duration( 3 , 'minutes' ),
  
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
  'tasks.updatePlayerText'(taskId,player,input,input2) {
    const task = Tasks.findOne(taskId);
    console.log('entra a updatePlayerText:',task)
    console.log('entra a updatePlayerText:',player)
    player.input_text = input
    player.input_text2 = input2
    player.ready = true
    console.log('newplayer; ',player)
    if(player.pos===1){
      Tasks.update(task._id, { $set: { player_1: player } });
    }
    else if (player.pos===2){
      Tasks.update(task._id, { $set: { player_2: player} });

    }
    else if (player.pos===3){
      Tasks.update(task._id, { $set: { player_3: player } });
    }
    else if (player.pos===4){
      Tasks.update(task._id, { $set: { player_4: player} });
 
    }
    
  },
  'tasks.voteForPlayer'(taskId,playerPos) {
    const task = Tasks.findOne(taskId);
    
    const ind = playerPos;
    console.log('entra a voteForPlayer:',ind);
    
    if(+ind===0) {
      console.log('entre1');
      Tasks.update(task._id, { $inc: { player_1votes: 1} });
    }
    else if (+ind===1) {
      console.log('entre1');
      Tasks.update(task._id, { $inc: { player_2votes: 1} });

    }
    else if (+ind===2) {
      console.log('entre3');
      Tasks.update(task._id, { $inc: { player_3votes: 1} });
    }
    else if (+ind===3) {
      console.log('entre4'); 
      Tasks.update(task._id, { $inc: { player_4votes: 1} });
 
    }
    
  },
  'tasks.definePlayer'(taskId,playerArray) {
    const task = Tasks.findOne(taskId);
    if(playerArray.length===1){
      Tasks.update(task._id, { $set: { player_1: playerArray[0] } });
    }
    else if (playerArray.length===2){
      Tasks.update(task._id, { $set: { player_1: playerArray[0], player_2: playerArray[1] } });

    }
    else if (playerArray.length===3){
      Tasks.update(task._id, { $set: { player_1: playerArray[0], player_2: playerArray[1], player_3: playerArray[2] } });
    }
    else if (playerArray.length===4){
      Tasks.update(task._id, { $set: { player_1: playerArray[0], player_2: playerArray[1], player_3: playerArray[2], player_4: playerArray[3] } });
 
    }
    
  },
  'tasks.resetRound'(taskId,playerArray,index) {
    const task = Tasks.findOne(taskId);
    Tasks.update(task._id, { $set: {
      player_1: playerArray[0], player_2: playerArray[1], player_3: playerArray[2], player_4: playerArray[3],
      player_1votes:0,
      player_2votes:0,
      player_3votes:0,
      player_4votes:0,
      currentWinner:playerArray[index]
    } });
 

  },

  'tasks.changeTime'(taskId, newTime) {
    const task = Tasks.findOne(taskId);
    const current_user = Meteor.users.findOne(this.userId);
    console.log('entra a changeTime: ',task);
    console.log('current user:  ',current_user);
   
      console.log('task.time: ',task.time);
      Tasks.update(task._id, { $set: { time: newTime } });
    
  },
  
  'tasks.activateGame'(taskId) {
    const task = Tasks.findOne(taskId);
    console.log('activate Game: ', task)
    Tasks.update(task._id, { $set: { game_on: true } });
    
  },
    
  'tasks.updateTaskBlack'(taskId, carta) {
    const task = Tasks.findOne(taskId);
    console.log('updateTasksBlack: ', task)
    console.log(carta)
    Tasks.update(task._id, { $set: { blackcard: carta } });
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