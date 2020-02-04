process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest');
const { expect } = require('chai');
const connection = require('../db/connection');

describe('/api', () => {});

describe('/api', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe('/topics', () => {
    it('GET 200: returns status 200 and an array of topic objects', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.eql({
            topics: [
              { slug: 'mitch', description: 'The man, the Mitch, the legend' },
              { slug: 'cats', description: 'Not dogs' },
              { slug: 'paper', description: 'what books are made of' }
            ]
          });
          body.topics.forEach(topic => {
            expect(topic).to.have.all.keys('slug', 'description');
          });
        });
    });
  });
  describe('users', () => {
    it('GET 200: returns status 200 and the requested user info', () => {
      return request(app)
        .get('/api/users/butter_bridge')
        .expect(200)
        .then(({ body }) => {
          expect(body.user).to.have.all.keys('username', 'avatar_url', 'name');
        });
    });
    it('GET 404: returns status 404 when requested user does not exist', () => {
      return request(app)
        .get('/api/users/a_made_up_username')
        .expect(404)
        .then(({ body }) => {
          expect(body).to.eql({ msg: 'Not found' });
        });
    });
  });
  describe('/articles/:article_id', () => {
    it('GET 200: returns status 200 and and an object of the requested article', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.have.all.keys(
            'author',
            'title',
            'article_id',
            'body',
            'topic',
            'created_at',
            'votes',
            'comment_count'
          );
        });
    });
    it('GET 404: returns status 404 when requested article_id doesnt exist', () => {
      return request(app)
        .get('/api/articles/99999')
        .expect(404)
        .then(({ body }) => {
          expect(body).to.eql({ msg: 'Not found' });
        });
    });
    it('PATCH 200: returns status 200 and upated article when vote increment request is made', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: '-10' })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.have.all.keys(
            'author',
            'title',
            'article_id',
            'body',
            'topic',
            'created_at',
            'votes'
          ); //how to test that votes have been incremented??
        });
    });
    it("PATCH 404: returns status 404 when requested article_id doesn't exist", () => {
      return request(app)
        .patch('/api/articles/999')
        .send({ inc_votes: '15' })
        .expect(404)
        .then(({ body }) => {
          expect(body).to.eql({ msg: 'Not found' });
        });
    });
    it('PATCH 400: returns status 400 when inc_votes key is not included on the request', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ not_the_right_key: '15' })
        .expect(400)
        .then(({ body }) => {
          expect(body).to.eql({ msg: 'Bad request' });
        });
    });
    it('PATCH 400: returns status 400 when inc_votes value is not a number', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 'not a number' })
        .expect(400)
        .then(({ body }) => {
          expect(body).to.eql({ msg: 'Bad request' });
        });
    });
    describe('/comments', () => {
      it('POST 201: returns status 201 and created comment', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({ username: 'lurker', body: 'This is a comment I am making' })
          .expect(201)
          .then(({ body }) => {
            expect(body).to.have.all.keys(
              'comment_id',
              'author',
              'article_id',
              'votes',
              'created_at',
              'body'
            );
          });
      });
    }); //comments
  }); //articles/article_id
}); //api
