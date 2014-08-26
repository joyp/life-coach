'use strict';

function Task(o, goalId){
  this.name         = o.name;
  this.difficulty   = o.difficulty;
  this.isComplete   = false;
  this.description  = o.description;
  this.rank         = parseFloat(o.rank);
}

module.exports = Task;
