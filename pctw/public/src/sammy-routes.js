var sammyApp = Sammy('#content', function () {
    var $content = $('#content');
    var $loader = $('#loader');

    this.get('#/', function () {
        $loader.show();
        this.redirect('#/movies');
    });

    this.get('#/movies', function () {
        $loader.show();
        $content.html('');
        var movies;
        ytsParser.getMovies().then(function (res) {
            movies = res;
            return templates.get('movies');
        }).then(function (template) {
            $content.html(template(movies));
            $loader.hide();
        })
    });

    this.get('#/watch/:name/:hash', function () {
        $loader.show();
        $content.html('');
        ytsParser.getMovieStream(this.params.name, this.params.hash)
            .then(function (streamURL) {
                createVideo(streamURL);
                $loader.hide();
            })
    });

    this.get('#/search/:query', function () {
        $loader.show();
        $content.html('');
        var movies;
        ytsParser.search(this.params.query).then(function (res) {
            movies = res;
            return templates.get('movies');
        }).then(function (template) {
            $content.html(template(movies));
            $loader.hide();
        })
    });

    this.get('#/genre/:query', function () {
        $loader.show();
        var movies;
        ytsParser.getGenre(this.params.query).then(function (res) {
            movies = res;
            return templates.get('movies');
        }).then(function (template) {
            $content.html(template(movies));
            $loader.hide();
        })
    });

    this.get('#/sortby/:query', function () {
        $loader.show();
        var movies;
        ytsParser.sortBy(this.params.query).then(function (res) {
            movies = res;
            return templates.get('movies');
        }).then(function (template) {
            $content.html(template(movies));
            $loader.hide();
        });
    })
});

$(function () {
    sammyApp.run('#/');
});

function createVideo(url) {
    var hostName = window.location.hostname;
    var $video = $('<video />').attr('name', 'media').attr('controls', '').attr('autoplay', '').width('100%').height('100%');
    var $source = $('<source />').attr('src', 'http://' + hostName + url).attr('type', 'video/mp4').appendTo($video);
    var $track = $('<track />').attr('kind', 'subtitles').attr('src', '/subtitles/bulgarian.vtt').attr('srclang', 'bg').attr('label', 'Bulgarian').attr('default', '').appendTo($video);
    $('#content').html($video);
}