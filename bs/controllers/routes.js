var bodyParser = require('body-parser');
var ejs = require('ejs');
var torrent = require('torrent-stream');
var utils = require('./utils.js');

var links = [];
module.exports = {
  setup: function(express, app) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use('/static', express.static(__dirname + '/../public'));
    app.engine('html', ejs.renderFile);
    app.set('view engine', 'ejs');
    this.static(app);
    this.dynamic(app);
    this.stream(app);
    this.error(app);
  },
  static : function(app) {
    app.get('/', function(request, response) {
      response.render('index.html');
    });

    app.get('/direct', function(request, response) {
      response.render('direct.html');
    });
  },
  dynamic: function(app) {
    app.post('/shows', function(request, response) {
      if(!request.body.show){
        response.status(404);
        response.render('error.html', 'show not found');
        return;
      }
      console.log(request.body);
      utils.shows(request.body.show, function(results) {
        if(results === null) {
          response.status(404);
          response.render('error.html', 'show not found');
          return;
        }
        console.log(results);
        response.render('shows.html', { shows: results });
      });
    });

    app.get('/episodes', function(request, response) {
      if(!request.query.show){
        response.status(404);
        response.render('error.html', 'episode not found');
        return;
      }
      console.log(request.query);
      utils.episodes(request.query.show, function(results) {
        if(results === null) {
          response.end('no episode results');
          return;
        }
        console.log(results.episodes);
        response.render('episodes.html', {episodes: results.episodes});
      });
    });

    app.post('/link', function(request, response) {
      if(!request.body.link){
        response.end('no show results');
        return;
      }
      console.log(request.body);
      var link = {'id': links.length, 'link': request.body.link};
      links.push(link);
      response.render('watch.html', { id: link.id});
    });
  },
  stream: function(app) {
    app.get('/video/:id', function(request, response) {
      var link = utils.link(links, request.params.id)
      var engine = torrent(link);
      engine.on('ready', function() {
        engine.files.forEach(function(file) {
          var info = utils.info(request.headers.range, file);
          response.writeHead(206, {
            'Content-Range': info.contentRange,
            'Accept-Ranges': 'bytes',
            'Content-Length': info.chunkSize,
            'Content-Type': info.contentType
          });

          var stream = file.createReadStream({ start: info.start, end: info.end });
          console.log(info);
          stream.pipe(response);
          stream.on('error', function(error) {
            console.log(error);
            response.end(error);
          });
        });
      });
    });
  },
  error: function(app) {
    app.get('*', function(request, response){
      response.status(404);
      response.render('error.html', {error: '404 - page not found'});
    });
  }
};
