process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('returns a new empty array when passed an empty array', () => {
    const input = [];
    expect(formatDates(input)).to.eql([]);
    expect(formatDates(input)).to.not.equal(input);
  });
  it('returns an array of length 1 with created_at key formatted correctly', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    expect(formatDates(input)[0].created_at instanceof Date).to.be.true;
  });
  it('does not mutate the original array', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    formatDates(input);
    const copy = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    expect(input).to.eql(copy);
  });
  it('returns an array of multiple items with created_at key formatted correctly', () => {
    let input = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389
      },
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    formatDates(input).forEach(
      item => expect(item.created_at instanceof Date).to.be.true
    );
    input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 100,
        created_at: 1448282163389
      }
    ];
    formatDates(input).forEach(
      item => expect(item.created_at instanceof Date).to.be.true
    );
  });
});

describe('makeRefObj', () => {
  it('returns an empty object when passed an empty array', () => {
    const input = [];
    expect(makeRefObj(input)).to.eql({});
    expect(makeRefObj(input)).to.not.equal(input);
  });
  it('does not mutate original array', () => {
    const input = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        body: 'I find this existence challenging',
        votes: 100,
        topic: 'mitch',
        author: 'butter_bridge'
      }
    ];
    makeRefObj(input);
    const copy = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        body: 'I find this existence challenging',
        votes: 100,
        topic: 'mitch',
        author: 'butter_bridge'
      }
    ];
    expect(input).to.eql(copy);
  });
  it('makes a reference object of article name and id', () => {
    let input = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        body: 'I find this existence challenging',
        votes: 100,
        topic: 'mitch',
        author: 'butter_bridge'
      }
    ];
    let expected = { 'Living in the shadow of a great man': 1 };
    expect(makeRefObj(input)).to.eql(expected);
    expect(makeRefObj(input)).to.not.equal(input);
    input = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        body: 'I find this existence challenging',
        votes: 100,
        topic: 'mitch',
        author: 'butter_bridge'
      },
      {
        article_id: 9,
        title: "They're not exactly dogs, are they?",
        body: 'Well? Think about it.',
        votes: 0,
        topic: 'mitch',
        author: 'butter_bridge'
      },
      {
        article_id: 10,
        title: 'Seven inspirational thought leaders from Manchester UK',
        body: "Who are we kidding, there is only one, and it's Mitch!",
        votes: 0,
        topic: 'mitch',
        author: 'rogersop'
      }
    ];
    expected = {
      'Living in the shadow of a great man': 1,
      "They're not exactly dogs, are they?": 9,
      'Seven inspirational thought leaders from Manchester UK': 10
    };
    expect(makeRefObj(input)).to.eql(expected);
  });
});

describe('formatComments', () => {
  it('returns a new empty array when passed an empty array', () => {
    expect(formatComments([])).to.eql([]);
  });
  it('changes created_by key to author and belongs_to and article title key-value pair to article_id key value pair for one comment', () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const ref = { "They're not exactly dogs, are they?": 1 };
    const expected = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 1,
        author: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      }
    ];
    expect(formatComments(comments, ref)).to.eql(expected);
    expect(formatComments(comments, ref)).to.not.equal(comments);
  });
  it('does not mutate the original array', () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const ref = { "They're not exactly dogs, are they?": 1 };
    formatComments(comments, ref);
    const copy = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      }
    ];
    expect(comments).to.eql(copy);
  });
  it('works for multiple comments', () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 100,
        created_at: 1448282163389
      }
    ];
    const ref = {
      "They're not exactly dogs, are they?": 1,
      'Living in the shadow of a great man': 2
    };
    const expected = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 1,
        author: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        article_id: 2,
        author: 'butter_bridge',
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
        article_id: 2,
        author: 'icellusedkars',
        votes: 100,
        created_at: 1448282163389
      }
    ];
    expect(formatComments(comments, ref)).to.eql(expected);
  });
});
