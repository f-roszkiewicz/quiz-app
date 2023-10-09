<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Quiz app working on graphQL API. GraphQL types are listed in file schema.gql.
Functionalities:
1. Listing all available quizzes, for example:

```query {
  getQuizzes {
    id
    name
    questions {
      question
      type
      answers
    }
  }
}
```

2. Getting specific quiz by id, for example:

```query {
  getQuiz(id: 1) {
    id
    name
    questions {
      question
      type
      answers
    }
  }
}
```

3. Solving specific quiz and fetching answers, for example:

```query {
  answer(quizId: 1, answers: ["d", "ac", "0"]) {
    yourAnswer
    correctAnswer
  }
}
```

4. Creating custom quizzes, for example:

```mutation {
  createQuiz(
    name: "Simple maths quiz",
    questions: [
      {
        question: "What is 9 + 10?",
        type: SINGLE_CORRECT,
        answers: ["18", "19", "20", "21"]
      },
      {
        question: "What equals to 4?",
        type: MULTIPLE_CORRECT,
        answers: ["2+2", "2-2", "2*2", "2/2"]
      },
      {
        question: "What is 2/0?",
        type: PLAIN_TEXT,
        answers: []
      }
    ],
    answers: ["b", "ac", "0"]
  ) {
    id
    name
    questions {
      question
      type
      answers
    }
  }
}
```

Question's possible answers are automatically listed as a,b,c,... and answers should be matched to these letters.
If question is single correct type, the answer should be one letter.
If question is multiple correct type, the answer should be multiple letters ordered lexicographically.
If question is sorting type, the answer should be one multiple letters sorted.
If question is plain text type, the possible answers should be empty.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
