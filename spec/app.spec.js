process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest');
const chai = require('chai');
const chaiSorted = require('chai-sorted');
const { expect } = chai;
const connection = require('../db/connection');

const defaults = require('superagent-defaults');
const request2 = defaults(request(app)); //allows assigning a token to make post requests

chai.use(require('sams-chai-sorted'));

describe('/api', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe('/api/login', () => {
    beforeEach(() => {
      request2
        .post('/api/login')
        .expect(200)
        .send({ username: 'butter_bridge', password: 'butter_bridge_pw' })
        .then(({ body: { token } }) => {
          request2.set('Authorization', `BEARER ${token}`);
        });
    });
    it('POST 200: responds with access token when given correct username and password', () => {
      return request(app)
        .post('/api/login')
        .send({ username: 'butter_bridge', password: 'butter_bridge_pw' })
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.ownProperty('token');
        });
    });
    it('POST 401: responds with status 401 for an incorrect password', () => {
      return request(app)
        .post('/api/login')
        .send({ username: 'butter_bridge', password: 'wrongpassword' })
        .expect(401)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal('invalid password');
        });
    });
    it('POST 401: responds with status 401 for an incorrect username', () => {
      return request(app)
        .post('/api/login')
        .send({ username: 'wrongusername', password: 'secure123' })
        .expect(401)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal('invalid username');
        });
    });
  });
  //// MAIN ENDPOINTS
  it('GET 200: returns a JSON describing all endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body.api).to.have.all.keys(
          'GET /api',
          'GET /api/topics',
          'GET /api/users',
          'POST /api/topics',
          'DELETE /api/topics/:slug',
          'POST /api/users',
          'GET /api/users/:username',
          'GET /api/articles',
          'POST /api/articles',
          'GET /api/articles/:article_id',
          'PATCH /api/articles/:article_id',
          'DELETE /api/articles/:article_id',
          'POST /api/articles/:article_id/comments',
          'GET /api/articles/:article_id/comments',
          'PATCH /api/comments/:comment_id',
          'DELETE /api/comments/:comment_id'
        );
      });
  });
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

    it('POST 201: posts a topic', () => {
      return request(app)
        .post('/api/topics')
        .send({ slug: 'dogs', description: "I'm allergic to cats" })
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).to.eql({
            slug: 'dogs',
            description: "I'm allergic to cats"
          });
        });
    });
    it('POST 400: returns an error when slug and description are not passed in the request', () => {
      return request(app)
        .post('/api/topics')
        .send({ notslug: 'dogs', description: "I'm allergic to cats" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('Bad request');
        });
    });
    it('DELETE 204: deletes topic', () => {
      return request(app)
        .delete('/api/topics/mitch')
        .expect(204);
    });
  });
  describe('/users', () => {
    it('GET: 200 returns an array of all users', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
          body.users.forEach(user => {
            expect(user).to.have.all.keys('username', 'avatar_url', 'name');
          });
        });
    });
    it('POST 201: adds a user', () => {
      return request(app)
        .post('/api/users')
        .send({
          username: 'newUser',
          avatar_url: 'www.google.com',
          name: 'Bob',
          password: 'bobssecretpassword'
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.user).to.eql({
            username: 'newUser',
            avatar_url: 'www.google.com',
            name: 'Bob'
          });
        });
    });
    it('POST 400: returns an error when request does not include username, avatar_url and name', () => {
      return request(app)
        .post('/api/users')
        .send({
          username: 'newUser',
          name: 'Bob'
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.eql('Bad request - password required');
        });
    });
    describe('/:username', () => {
      it('GET 200: returns status 200 and the requested user info', () => {
        return request(app)
          .get('/api/users/butter_bridge')
          .expect(200)
          .then(({ body }) => {
            expect(body.user).to.have.all.keys(
              'username',
              'avatar_url',
              'name'
            );
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
  });
  describe('/articles', () => {
    beforeEach(() => {
      //assign token for post requests
      request2
        .post('/api/login')
        .expect(200)
        .send({ username: 'butter_bridge', password: 'butter_bridge_pw' })
        .then(({ body: { token } }) => {
          request2.set('Authorization', `BEARER ${token}`);
        });
    });
    it('GET 200: returns all articles with comment count, sorted by date in descending order by default', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach(article => {
            expect(article).to.have.all.keys(
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
          expect(body.articles).to.be.descendingBy('created_at');
        });
    });
    it('GET 200: returns articles sorted by sort_by queried column and queried order', () => {
      return request(app)
        .get('/api/articles?sort_by=title&order=desc')
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach(article => {
            expect(article).to.have.all.keys(
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
          expect(body.articles).to.be.descendingBy('title');
        });
    });
    it('GET 200: returns articles sorted by sort_by queried column and queried order', () => {
      return request(app)
        .get('/api/articles?sort_by=votes&order=desc')
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach(article => {
            expect(article).to.have.all.keys(
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
          expect(body.articles).to.be.descendingBy('votes');
        });
    });
    it('GET 200: returns articles sorted by sort_by queried column and queried order', () => {
      return request(app)
        .get('/api/articles?sort_by=comment_count&order=asc')
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach(article => {
            expect(article).to.have.all.keys(
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
          expect(body.articles).to.be.sortedBy('comment_count');
        });
    });
    it('GET 200: returns articles sorted by sort_by queried column and queried order', () => {
      return request(app)
        .get('/api/articles?sort_by=created_at&order=desc')
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach(article => {
            expect(article).to.have.all.keys(
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
          expect(body.articles).to.be.descendingBy('created_at');
        });
    });
    it('GET 200: responds with articles by queried user', () => {
      return request(app)
        .get('/api/articles?author=butter_bridge')
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach(article => {
            expect(article).to.have.all.keys(
              'author',
              'title',
              'article_id',
              'body',
              'topic',
              'created_at',
              'votes',
              'comment_count'
            );
            expect(article.author).to.equal('butter_bridge');
          });
        });
    });
    it('GET 200: responds with empty array when queried user exists but has no articles', () => {
      return request(app)
        .get('/api/articles?author=lurker')
        .expect(200);
    });
    it('GET 200: responds with articles by queried topic', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach(article => {
            expect(article).to.have.all.keys(
              'author',
              'title',
              'article_id',
              'body',
              'topic',
              'created_at',
              'votes',
              'comment_count'
            );
            expect(article.topic).to.equal('mitch');
          });
        });
    });
    it('GET 200: responds with empty array when queried topic exists but has no articles', () => {
      return request(app)
        .get('/api/articles?topic=paper')
        .expect(200);
    });
    it('GET 200: responds with status 200 and sorted by default order asc when queried order_by is not asc or desc', () => {
      return request(app)
        .get('/api/articles?sort_by=votes&order=something_you_cant_order_by')
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach(article => {
            expect(article).to.have.all.keys(
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
          expect(body.articles).to.be.ascendingBy('votes');
        });
    });
    it('GET 200: responds with page limit defaulted to 10 and page defaulted to 1', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.total_count).to.equal(12);
          expect(body.articles).to.have.length(10);
        });
    });
    it('GET 200: responds with queried limit and page', () => {
      return request(app)
        .get('/api/articles?limit=5&p=3')
        .expect(200)
        .then(({ body }) => {
          expect(body.total_count).to.equal(12);
          expect(body.articles).to.have.length(2);
        });
    });
    it("GET 404: responds with status 404 when queried topic doesn't exist", () => {
      return request(app)
        .get('/api/articles?topic=something_that_isnt_a_topic')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql('Not found');
        });
    });
    it("GET 404: responds with status 404 when queried author doesn't exist", () => {
      return request(app)
        .get('/api/articles?author=this_is_not_an_author')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql('Not found');
        });
    });
    it("GET 400: responds with status 400 when queried sort_by column doesn't exist", () => {
      return request(app)
        .get('/api/articles?sort_by=not_a_column')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.eql('Queried column does not exist');
        });
    });
    it('POST 201: returns status 201 and posted article', () => {
      return request2 //has token assigned
        .post('/api/articles')
        .send({
          username: 'butter_bridge',
          title: 'a new article',
          topic: 'cats',
          body: 'a new article that is about cats'
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.article).to.have.all.keys(
            'author',
            'title',
            'body',
            'article_id',
            'topic',
            'created_at',
            'votes'
          );
        });
    });
    it('POST 401: returns status 401 when no token is assigned', () => {
      return request2
        .post('/api/articles')
        .set('Authorization', ``) //remove token authorisation
        .send({
          username: 'butter_bridge',
          title: 'a new article',
          topic: 'cats',
          body: 'a new article that is about cats'
        })
        .expect(401)
        .then(({ body }) => {
          expect(body.msg).to.eql('unauthorised');
        });
    });
    it('POST 400: returns an error when each of username, title, topic and body are not passed in the request', () => {
      return request2
        .post('/api/articles')
        .send({
          title: 'a new article',
          topic: 'cats',
          body: 'a new article that is about cats'
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('Bad request');
        });
    });
    it('POST 404: returns an error when username or topic are not valid', () => {
      return request2
        .post('/api/articles')
        .send({
          username: 'not_a_real_username',
          title: 'a new article',
          topic: 'cats',
          body: 'a new article that is about cats'
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('Not found');
        });
    });
    describe('/:article_id', () => {
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
            );
            expect(body.article.votes).to.equal(90);
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
      it('DELETE 204: deletes the selected article', () => {
        return request(app)
          .delete('/api/articles/3')
          .expect(204);
      });
      it("DELETE 404: returns error when article doesn't exist", () => {
        return request(app)
          .delete('/api/articles/999')
          .expect(404);
      });
      describe('/comments', () => {
        it('POST 201: returns status 201 and created comment', () => {
          return request2 //has token assigned
            .post('/api/articles/1/comments')
            .send({ username: 'lurker', body: 'This is a comment I am making' })
            .expect(201)
            .then(({ body }) => {
              expect(body.comment).to.have.all.keys(
                'comment_id',
                'author',
                'article_id',
                'votes',
                'created_at',
                'body'
              );
            });
        });
        it('POST 400: returns status 400 when body does not have the correct information', () => {
          return request2 //used for token
            .post('/api/articles/1/comments')
            .send({
              not_the_right_key: 'lurker',
              body: 'This is a comment I am making'
            })
            .expect(400)
            .then(({ body }) => {
              expect(body).to.eql({ msg: 'Bad request' });
            });
        });
        it("POST 404: returns status 404 when requested article_id doesn't exist", () => {
          return request2 //used for token
            .post('/api/articles/999/comments')
            .send({ username: 'lurker', body: 'This is a comment I am making' })
            .expect(404)
            .then(({ body }) => {
              expect(body).to.eql({ msg: 'Not found' });
            });
        });
        it('POST 401: returns 401 if no token is provided', () => {
          return request2
            .post('/api/articles/1/comments')
            .set('Authorization', ``) //remove auth token
            .send({ username: 'lurker', body: 'This is a comment I am making' })
            .expect(401)
            .then(({ body }) => {
              expect(body.msg).to.equal('unauthorised');
            });
        });
        it('GET 200: returns an array of comments for given article, sorted by created_at desc by default', () => {
          return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
              body.comments.forEach(comment => {
                expect(comment).to.have.all.keys(
                  'comment_id',
                  'author',
                  'article_id',
                  'votes',
                  'created_at',
                  'body'
                );
                expect(comment.article_id).to.equal(1);
              });
              expect(body.comments).to.be.descendingBy('created_at');
            });
        });
        it('GET 200: includes a total_count key and returns a default of 10 comments per page starting at p = 1', () => {
          return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
              expect(body.total_count).to.equal(13);
            });
        });
        it('GET 200: returns the queried limit number and queried page', () => {
          return request(app)
            .get('/api/articles/1/comments?limit=5&p=3')
            .expect(200)
            .then(({ body }) => {
              expect(body.total_count).to.equal(13);
              expect(body.comments).to.have.length(3);
            });
        });
        it('GET 200: returns an empty array of comments when given article has no comments', () => {
          return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.eql([]);
            });
        });
        it('GET 200: returns an array of comments for given article, sorted by queried sort_by and order', () => {
          return request(app)
            .get('/api/articles/1/comments?sort_by=author&order=desc')
            .expect(200)
            .then(({ body }) => {
              body.comments.forEach(comment => {
                expect(comment).to.have.all.keys(
                  'comment_id',
                  'author',
                  'article_id',
                  'votes',
                  'created_at',
                  'body'
                );
                expect(comment.article_id).to.equal(1);
              });
              expect(body.comments).to.be.descendingBy('author');
            });
        });
        it("GET 404: returns 404 when article doesn't exist", () => {
          return request(app)
            .get('/api/articles/999/comments')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal('Not found');
            });
        });
        it("GET 400: returns 400 when sort by column doesn't exist", () => {
          return request(app)
            .get('/api/articles/1/comments?sort_by=made_up_column')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal('Queried column does not exist');
            });
        });
      }); //comments
    }); //:article_id
  }); //articles
  describe('/comments/:comment_id', () => {
    it('PATCH 200: returns comment with vote incremented by passed amount', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: -10 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).to.have.all.keys(
            'comment_id',
            'author',
            'article_id',
            'votes',
            'created_at',
            'body'
          );
          expect(body.comment.votes).to.equal(6);
        });
    });
    it('PATCH 400: returns status 400 when inc_votes key is not included on the request', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ not_the_right_key: '15' })
        .expect(400)
        .then(({ body }) => {
          expect(body).to.eql({ msg: 'Bad request' });
        });
    });
    it('PATCH 400: returns status 400 when inc_votes value is not a number', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 'not a number' })
        .expect(400)
        .then(({ body }) => {
          expect(body).to.eql({ msg: 'Bad request' });
        });
    });
    it('PATCH 400: returns status 400 when comment does not exist', () => {
      return request(app)
        .patch('/api/comments/999')
        .expect(400)
        .then(({ body }) => {
          expect(body).to.eql({ msg: 'Bad request' });
        });
    });
    it('DELETE 204: returns 204 and deletes comment', () => {
      return request(app)
        .delete('/api/comments/2')
        .expect(204);
    });
    it("DELETE 404: returns 404 if comment doesn't exist", () => {
      return request(app)
        .delete('/api/comments/99999')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('Not found');
        });
    });
  }); //comments/:comment_id
}); //api
