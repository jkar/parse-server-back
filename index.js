// Example express application adding the parse-server module to expose Parse
// compatible API routes.

const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const args = process.argv || [];
const test = args.some(arg => arg.includes('jasmine'));
const itemRouter = require('./public/routers/itemRouter');
const userRouter = require('./public/routers/userRouter');

const databaseUri = "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.m84zd.mongodb.net/parse?retryWrites=true&w=majority";

const config = {
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || 'master', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse', // Don't forget to change to https if needed
  liveQuery: {
    classNames: ['Posts', 'Comments'], // List of classes to support for query subscriptions
  },

  // verifyUserEmails: true,
  // publicServerURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
  // appName: process.env.APP_NAME || 'CodeCraft',
  // emailAdapter: {
  //   module: 'parse-server-simple-mailgun-adapter',
  //   options: {
  //     fromAddress: '',
  //     domain: '',
  //     apiKey: ''
  //   }
  // }
};
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/items', itemRouter);
app.use('/user', userRouter);

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/parse';
if (!test) {
  const api = new ParseServer(config);
  app.use(mountPath, api);
}

// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

const port = process.env.PORT || 1337;
if (!test) {
  const httpServer = require('http').createServer(app);
  httpServer.listen(port, function () {
    console.log('parse-server-example running on port ' + port + '.');
  });
  // This will enable the Live Query real-time server
  ParseServer.createLiveQueryServer(httpServer);
}

module.exports = {
  app,
  config,
};
