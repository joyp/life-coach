'use strict';

var Goal = require('../models/goal');

exports.index = function(req, res){
  Goal.findAllByUserId(res.locals.user._id, function(err, goals){
    res.render('goals/index', {goals:goals});
  });
};

exports.new = function(req, res){
  res.render('goals/new');
};

exports.create = function(req, res){
  Goal.create(req.body, res.locals.user._id, function(){
    res.redirect('/goals');
  });
};

exports.show = function(req, res){
  Goal.findById(req.params.goalId, res.locals.user._id, function(err, goal){
    if(goal){
      res.render('goals/show', {goal:goal});
    }else{
      res.redirect('/');
    }
  });
};

exports.addTask = function(req, res){
  Goal.findById(req.params.goalId, res.locals.user._id, function(err, goal){
    if(goal){
      Goal.addTask(req.body, req.params.goalId, function(err, task){
        res.render('goals/show', {task:task});
      });
    }else{
      res.redirect('/');
    }
  });
};
