# Google Search Console Dumper

This Node.js small app dumps the content of a specific site by using the Google Search Console API

## Getting Started

These instructions will get you a copy of the project up and running on your local machine. This project implements a queue to avoid getting Google Search Console API quota exceeded.

### Prerequisites

This project requires to have a Redis server installed for the queue to work properly. Also, some packages will need to be instaled.

Redis can be used as a docker container by using the following command.

```docker
docker run -p 6379:6379 --name gsc-redis -d redis
```

### Installing

Install project dependencies by running:

```npm
npm install
```

### Setting up environment variables

Create a `.env` file and set up your Google creadentials and site URL. You can rename the sample file included in this repo.

```
mv .env.sample .env
```

Regarding getting the Google credentials, you can follow [this tutorial](https://flaviocopes.com/google-api-authentication/). Keep in mind you will not have to do the analytics steps, but use Google Search Console instead.

## Built With

- [Nodejs](https://nodejs.dev/)
- [Reds](https://redis.com)
- [Dotenv](https://github.com/motdotla/dotenv)
- [Google API](https://github.com/googleapis/google-api-nodejs-client)
- [Kue](https://rometools.github.io/rome/)
- [Moment](https://rometools.github.io/rome/)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/arisanguinetti/search-console-dumper/tags).

## Authors

- **Ariel Sanguinetti** - _Initial work_ - [GitHub](https://github.com/arisanguinetti)

See also the list of [contributors](hhttps://github.com/arisanguinetti/search-console-dumper/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
