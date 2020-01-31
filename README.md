# Meso Web App [![CircleCI](https://circleci.com/gh/Watsi/meso-web/tree/master.svg?style=svg&circle-token=d9e155f93575eb4723bc3cb962b64a2eaac80519)](https://circleci.com/gh/Watsi/meso-web/tree/master)

A web interface for Meso. The user-facing client includes member management, claims adjudication, downloading reports, etc.

## Usage

After [getting set up](#getting-started), there's a few [npm scripts](https://medium.com/@dabit3/introduction-to-using-npm-as-a-build-tool-b41076f488b0) you'll want to know.

Start a local dev server with:

```bash
$ npm start
```

Run the test suite with:

```bash
$ npm test
```

You can see the full set of scripts in the `scripts` field of [`package.json`](https://github.com/meso-health/meso-web/blob/master/package.json).


## Getting started

If you're looking for a **quick start** guide:

```bash
$ git clone https://github.com/meso-health/meso-web
$ cd meso-web
$ npm install
$ npm start
```

Follow along below if you want more details.

#### Environment setup

The only binary dependencies you need are `node` and `watchman`. You can install them with [Homebrew](https://brew.sh) via:

```bash
$ brew install node watchman
```

We're currently developing with the Node version in [.nvmrc](https://github.com/meso-health/meso-web/blob/master/.nvmrc). If you use [`nvm`](https://github.com/creationix/nvm), you can run `nvm use` in the cloned repository to get the correct version.

### Offline behavior

Some pages of this web app loads even while the user is offline.

From facebook:
> The service worker is only enabled in the production environment. It's recommended that you do not enable an offline-first service worker in a development environment, as it can lead to frustration when previously cached assets are used and do not include the latest changes you've made locally.

So in order do run the production env locally to test out the offline behaviour, do the following:
```bash
$ npm run build
$ serve -s build -l 4500 # Put whatever port you feel is convenient. It's best to choose a different port than the default (3000)
```

Go to localhost:4500 once, and in console you still see that the web-app is now cached offline.
If you stop the node server that's serving the web-app, and also stop the backend server, the web application should still be navigable.

For more information on progress-web-apps, here are a few resources:
- https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app
- https://developers.google.com/web/progressive-web-apps/

#### Repository setup

After finishing with node, install the dependencies. Clone the repository, open the folder, and run:

```bash
$ npm install
```

You're good to go! Start the dev server with:

```bash
$ npm start
```

## Writing code

Since js-land is still a wild-west, this repo follows a few single-page apps conventions to keep things simple.

#### Source files

* `components`: **"Building-block" UI components** for the site. These components should be "dumb", reusable, and not tightly coupled to any specific use-case
* `containers`: **Components tied to specific data**. See [this article on the distinction between presentational and container components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.d3mqkdwk4) for more details
* `lib`: **Non-UI app code**. Helper functions and utilities. Authentication, configuration, and API code is stored in here
* `store`: **Redux code**. Any manipulation to application state should live here (reducers, actions, etc).
* `styles`: **Utilities for UI styles**. Akin to SCSS variables and mixins
* `views`: **The :sparkles: _magic_ :sparkles:**. These files tie together actions, containers, and components, into something useful to human beings

And a few important top-level source files:

* `app.js`: top-level app component, used for passing data around
* `router.js`: app routing
* `index.js`: app initialization script

#### File structure

Our file structure is following a re-ducks pattern of grouping code based on feature. Check out our [super-cool-app](https://github.com/gelo592/super-cool-app), an example repo that is a basic outline of our file structure. You can also read more about re-ducks [here](https://medium.freecodecamp.org/scaling-your-redux-app-with-ducks-6115955638be).

#### React components

To keep our react components organized, we have added a linter rule that enforces the ordering of render, lifecycle methods, static methods, etc
[sort-comp](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md)

```
order: [
  'static-methods',
  'lifecycle',
  'everything-else',
  'render'
],
```

#### Component naming

We follow some conventions around certain words that can help with naming your component, container, or view.

* `detail`: used for a page that displays the specifics of a single thing. eg: `reimbursements-detail-container` displays the specifics of a single reimbursement.
* `index`: used for a page that displays a list (usually in table format) of something. eg: `reimbursements-index-container` displays a table list of all reimbursements.
* `overview`: used for a page that displays an overview or summary of various stats or information. eg: `reimbursements-overview-container` displays some high level reimbursements stats and a summary of where each provider is at in terms of being reimbursed.

Another note around naming containers is that for containers under a feature, we prefix their names with the feature name (in plural). Eg:
```
reimbursements/
├── reimbursements-index-container.js
├── reimbursements-overview-container.js
├── reimbursements-<...>.js
```

#### Selector and props naming

Since it is important to know what format our selectors are returning data in, we use the following rules to make them easier to use:

* `<model>sArraySelector`: returns array of the objects (eg: `reimbursementsArraySelector`)
* `<model>sKeyedByIdSelector`: returns object of objects keyed by Id (eg: `reimbursementsKeyedByIdSelector`)
* `<model>ByIdSelector`: returns single specific object when passed its ID (eg: `reimbursementByIdSelector`)

However, since these selector names are quite long, we name the props that they're passed into like so:

* `<model>sArraySelector` ⟶ `<model>s` (eg: `reimbursements`)
* `<model>sKeyedByIdSelector` ⟶ `<model>sById` (eg: `reimbursementsById`)
* `<model>ByIdSelector` ⟶ `<model>` (eg: `reimbursement`)

### Development

When you run `npm start`, a local server will spin up on [localhost:3000](http://localhost:3000/).

**A note about dependencies:** The Node community makes it really easy to reuse other's code in a project (it's only a `npm install --save` away). However, be _very careful_ when adding dependencies. Many are poorly written, or too bloated for our needs. Check with others when you want to add a dependency. It's a piece of code we need to support and manage in the future and should be reviewed like our own code.

### Testing

Tests are done using Facebook's [Jest](https://facebook.github.io/jest/) test runner. As well, React components can be tested using Airbnb's [Enzyme](https://github.com/airbnb/enzyme) library. Their documentation is good — review them for a "getting started" guide.

Tests are co-located with the files they are meant to test, with a suffix. For example, to test `src/lib/auth.js`, write your tests in `src/lib/auth.test.js`.


#### Debugging Tests

Tests in jest can be debugged using Chrome Developer Tools via the following steps:

1. Set a `debugger;` statement in any test where you want the code to be paused.
2. Run the test with `npm test:debug [test name]`. This will run the test in a Node process that an external debugger can connect to. (Note that the process will pause until the debugger has connected to it.)
3. Go to chrome://inspect in your browser, and click on "Open Dedicated DevTools for Node". This will open a Chrome Dev Tools window that will automatically connect to the test as an external debugger, load the test, and pause it.
4. To run the test, click the button in the Chrome Dev Tools window that looks like a "play" button in the upper right hand side of the screen. When Jest executes the test that contains the `debugger;` statement, execution will pause and you can examine the current scope and call stack.

Note that along with the `debugger;` statement set in the test, you can also set breakpoints in any part of the code using Chrome Dev Tools.

For more information on debugging tests, see [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#debugging-tests) and [here](https://facebook.github.io/jest/docs/en/troubleshooting.html).

## Deployment

The admin site is built as a static site and hosted on [Netlify](https://netlify.com). We have four environments, [`coverage-admin-production`](https://app.netlify.com/sites/coverage-admin-production), [`coverage-admin-demo`](https://app.netlify.com/sites/coverage-admin-demo), and [`coverage-admin-sandbox`](https://app.netlify.com/sites/coverage-admin-sandbox), which [connect to their respective backend environments](https://github.com/meso-health/meso-backend#production-and-sandbox-deployment).

A few notes about our setup:

* **Continuous Integration**: Every branch and every commit, once pushed to the GitHub repo, will run its specs automatically on [CircleCI](https://circleci.com/gh/Watsi/coverage-admin).
* **Continuous Deployment**: Once our tests pass on the [master branch on CircleCI](https://circleci.com/gh/Watsi/coverage-admin/tree/master), that commit is automatically and immediately pushed to both production and sandbox. This is configured with webhooks within [`circle.yml`](https://github.com/Watsi/coverage-admin/blob/master/circle.yml).
* **Deploy Previews**: Pull requests to this repo automatically generate ["deploy previews"](https://cloud.githubusercontent.com/assets/303731/23380588/47ebb9f6-fcf0-11e6-8294-f8cdf002286c.png) for you to preview your changes against the sandbox backend.
* **Deployment metadata**: Netlify passes our build script a variety of environment variables to use, like [the current release's git SHA, branch, or deploy URL](https://www.netlify.com/docs/continuous-deployment/#build-environment-variables).

Summary:

| Environment           | Url                                                   | Endpoint                                | Deployment | Deployed after push to... |
|-----------------------|-------------------------------------------------------|-----------------------------------------|------------|---------------------------|
| Local                 | http://localhost:3000                                 | http://localhost:5000                   | manual     | -                         |
