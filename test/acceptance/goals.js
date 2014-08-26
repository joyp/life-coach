/* global describe, before, beforeEach, it */

'use strict';

process.env.DB    = 'life-coach-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('goals', function(){
  before(function(done){
    // request is the browser, sends a get request to the node server
    // when the server responds, this function executes 'done'
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      // send login information as URL encoded, the way the browser does
      .send('email=bob@aol.com')
      .send('password=123')
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });

  describe('get /', function(){
    it('should fetch the home page', function(done){
      request(app)
      .get('/')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Home');
        done();
      });
    });
  });

  describe('get /goals/new', function(){
    it('should show the new goals page', function(done){
      request(app)
      .get('/goals/new')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Goal');
        expect(res.text).to.include('Due');
        expect(res.text).to.include('Tags');
        done();
      });
    });
  });

  describe('post /goals', function(){
    it('should create a new goal and redirect', function(done){
      request(app)
      .post('/goals')
      .set('cookie', cookie)
      .send('name=be+a+doctor&due=2014-11-30&tags=a%2Cb%2Cc%2Cd')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('get /goals', function(){
    it('should show the goals page', function(done){
      request(app)
      .get('/goals')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('be a doctor');
        done();
      });
    });
  });

  describe('get /goals/3', function(){
    it('should show a specific goal page', function(done){
      request(app)
      .get('/goals/a00000000000000000000003')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('be a doctor');
        done();
      });
    });

    it('should redirect to the home page', function(done){
      request(app)
      .get('/goals/a00000000000000000000002')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('post /goals/3/tasks', function(){
    it('should create a task for a specific goal', function(done){
      request(app)
      .get('/goals/a00000000000000000000001/tasks')
      .set('cookie', cookie)
      .send('name=Get+shooes&description=By+some+shoes&difficulty=Hard&rank=3')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

});

