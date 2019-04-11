'use strict';

const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');

describe('Bookmarks Endpoints', function() {

  const testBookmarksArray = [
    {
      id: 1,
      name: 'test1',
      url: 'test1_url',
      description: 'test1_descr',
      rating: 5
    },
    {
      id: 2,
      name: 'test2',
      url: 'test2_url',
      description: 'test2_descr',
      rating: 2
    },
    {
      id: 3,
      name: 'test3',
      url: 'test3_url',
      description: 'test3_descr',
      rating: 3
    },
    {
      id: 4,
      name: 'test4',
      url: 'test4_url',
      description: 'test4_descr',
      rating: 4
    }
  ];

  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db('bookmarks').truncate());

  afterEach('cleanup', () => db('bookmarks').truncate());

  context('Given there are articles in the database', () => {
    const testBookmarks = testBookmarksArray;
    // const testBookmarks = [
    //   {
    //     id: 1,
    //     name: 'test1',
    //     url: 'test1_url',
    //     description: 'test1_descr',
    //     rating: 5
    //   },
    //   {
    //     id: 2,
    //     name: 'test2',
    //     url: 'test2_url',
    //     description: 'test2_descr',
    //     rating: 2
    //   },
    //   {
    //     id: 3,
    //     name: 'test3',
    //     url: 'test3_url',
    //     description: 'test3_descr',
    //     rating: 3
    //   },
    //   {
    //     id: 4,
    //     name: 'test4',
    //     url: 'test4_url',
    //     description: 'test4_descr',
    //     rating: 4
    //   }
    // ];
    
    beforeEach('insert articles', () => {
      return db
        .into('bookmarks')
        .insert(testBookmarks);
    });

    
    it('GET /api/bookmarks:id responds with 200 and correct bookmark', () => {

      // eslint-disable-next-line no-undef
      return supertest(app)
        .get('/api/bookmarks/1')
        .expect(200, testBookmarks[0]);
      // TODO: add more assertions about the body
    });
  
    
    it('GET /api/bookmarks responds with 200 and all of the bookmarks', () => {
      // eslint-disable-next-line no-undef
      return supertest(app)
        .get('/api/bookmarks')
        .expect(200, testBookmarks);
      // TODO: add more assertions about the body
    });
  });


  describe('POST /api/bookmarks', () => {
    it('creates a bookmark, responding with 201 and the new bookmark',  function() {

      const newBookmark = {
        id : 13,
        name: 'PostTest',
        url: 'www.testpost.com',
        description:'optional description',
        rating: 5
      };
      
      // eslint-disable-next-line no-undef
      return supertest(app)
        .post('/api/bookmarks')
        .send(newBookmark)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(newBookmark.name);
          expect(res.body.url).to.eql(newBookmark.url);
          expect(res.body.description).to.eql(newBookmark.description);
          expect(res.body.rating).to.eql(newBookmark.rating);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/bookmarks/${res.body.id}`);
        })
        .then(postRes =>
          // eslint-disable-next-line no-undef
          supertest(app)
            .get('/api/bookmarks/' + postRes.body.id )
            .expect(postRes.body) 
        );
    });

    it('responds with 400 and an error message when the \'name\' is missing', () => {
      // eslint-disable-next-line no-undef
      return supertest(app)
        .post('/api/bookmarks')
        .send({
          url: 'blank',
          id: 15,
          description: '30',
          rating: 4
        })
        .expect(400, {
          error: { message: 'Missing \'name\' in request body' }
        });
    });

    it('responds with 400 and an error message when the \'url\' is missing', () => {
      // eslint-disable-next-line no-undef
      return supertest(app)
        .post('/api/bookmarks')
        .send({
          name: 'testme',
          id: 15,
          description: '30',
          rating: 4
        })
        .expect(400, {
          error: { message: 'Missing \'url\' in request body' }
        });
    });

    it('responds with 400 and an error message when the \'rating\' is missing', () => {
      // eslint-disable-next-line no-undef
      return supertest(app)
        .post('/api/bookmarks')
        .send({
          url: 'blank',
          id: 15,
          description: '30',
          name:'title_Test'
        })
        .expect(400, {
          error: { message: 'Missing \'rating\' in request body' }
        });
    });

    it('responds with 400 and an error message when the \'rating\' is not a number', () => {
      // eslint-disable-next-line no-undef
      return supertest(app)
        .post('/api/bookmarks')
        .send({
          url: 'blank',
          id: 15,
          description: '30',
          rating: 'fglkfdjgk',
          name:'hello'
        })
        .expect(400, {
          error: { message: 'Invalid rating' }
        });
    });

    it('responds with 400 and an error message when the \'rating\' is outside range', () => {
      // eslint-disable-next-line no-undef
      return supertest(app)
        .post('/api/bookmarks')
        .send({
          url: 'blank',
          id: 15,
          description: '30',
          rating: 30,
          name:'hello'
        })
        .expect(400, {
          error: { message: 'Invalid rating' }
        });
    });

    it('responds with 400 and an error message when the \'name\' is missing', () => {
      // eslint-disable-next-line no-undef
      return supertest(app)
        .post('/api/bookmarks')
        .send({
          url: 'blank',
          id: 15,
          description: '30',
          rating: 4
        })
        .expect(400, {
          error: { message: 'Missing \'name\' in request body' }
        });
    });


  });

  describe('DELETE /api/bookmarks/:id', () => {
    context('Given there are bookmarks in the database', () => {
      
      const testBookmarks = [
        {
          id: 1,
          name: 'test1',
          url: 'test1_url',
          description: 'test1_descr',
          rating: 5
        },
        {
          id: 2,
          name: 'test2',
          url: 'test2_url',
          description: 'test2_descr',
          rating: 2
        },
        {
          id: 3,
          name: 'test3',
          url: 'test3_url',
          description: 'test3_descr',
          rating: 3
        },
        {
          id: 4,
          name: 'test4',
          url: 'test4_url',
          description: 'test4_descr',
          rating: 4
        }
      ];
  
      beforeEach('insert bookmark', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks);
      });
  
      it('responds with 204 and removes the bookmark', () => {
        const idToRemove = 2;
        const expectedBookmarks = testBookmarks.filter(bookmark => bookmark.id !== idToRemove);
        // eslint-disable-next-line no-undef
        return supertest(app)
          .delete(`/api/bookmarks/${idToRemove}`)
          .expect(204)
          .then(res =>
            // eslint-disable-next-line no-undef
            supertest(app)
              .get('/api/bookmarks')
              .expect(expectedBookmarks)
          );
      });

      context('Given no bookmarks', () => {
        it('responds with 404', () => {
          const bookmarkId = 123456;
          // eslint-disable-next-line no-undef
          return supertest(app)
            .delete(`/api/bookmarks/${bookmarkId}`)
            .expect(404, { error: { message: 'Bookmark doesn\'t exist' } });
        });
      });
    });
  });

  describe(`PATCH /api/bookmarks/:id`, () => {
    context(`Given no bookmarks`, () => {
      it(`responds with 404`, () => {
        const id = 123456;
        return supertest(app)
          .patch(`/api/bookmarks/${id}`)
          .expect(404, { error: { message: `Bookmark doesn't exist` }  });
      });
    });
    context('Given there are bookmarks in the database', () => {
      const testBookmarks = testBookmarksArray;

      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks)
      });

      it('responds with 204 and updates the bookmark', () => {
        const idToUpdate = 2
        const updateBookmark = {
          url: 'testurl.com',
          description: 'test description',
          rating: 4,
        };
        const expectedBookmark = {
          ...testBookmarks[idToUpdate - 1],
          ...updateBookmark
        };
        return supertest(app)
          .patch(`/api/bookmarks/${idToUpdate}`)
          .send(updateBookmark)
          .expect(204)
          .then(res => 
            supertest(app)
              .get(`/api/bookmarks/${idToUpdate}`)
              .expect(expectedBookmark)
          );
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2;
        return supertest(app)
          .patch(`/api/bookmarks/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `request body must contain either 'name', 'url', 'rating', or 'description'`
            }
          });
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2
        const updateBookmark = {
          name: 'updated bookmark name',
        }
        const expectedBookmark = {
          ...testBookmarks[idToUpdate - 1],
          ...updateBookmark
        }

        return supertest(app)
          .patch(`/api/bookmarks/${idToUpdate}`)
          .send({
            ...updateBookmark,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/bookmarks/${idToUpdate}`)
              .expect(expectedBookmark)
          );
      });


    });
  });

});