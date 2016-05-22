var ytsParser = (function () {

    function getMovies() {
        var promise = new Promise(function (resolve, reject) {

            $.getJSON('https://yts.to/api/v2/list_movies.json?limit=12', function (res) {
                var movies = res.data.movies;
                resolve(movies);
            });
        });

        return promise;
    }

    function getMovieStream(name, hash) {
        var promise = new Promise(function (resolve, reject) {

            $.get('watch/' + name + '/' + hash, function (res) {
                resolve(res);
            })
        });

        return promise;
    }

    function search(query) {
        var promise = new Promise(function (resolve, reject) {
            $.getJSON('https://yts.to/api/v2/list_movies.json?query_term=' + query, function (res) {
                var movies = res.data.movies;
                console.log(movies);
                resolve(movies);
            });
        });

        return promise;
    }

    function filterByGenre(genre) {
        var promise = new Promise(function (resolve, reject) {
            var url = 'https://yts.to/api/v2/list_movies.json?genre=' + genre;
            $.getJSON(url, function (res) {
                var movies = res.data.movies;
                resolve(movies);
            });
        });
        return promise;
    }

    function sortBy(query) {
        var promise = new Promise(function (resolve, reject) {
            var url = 'https://yts.to/api/v2/list_movies.json?sort_by=' + query;
            $.getJSON(url, function (res) {
                var movies = res.data.movies;
                resolve(movies);
            })
        });
        return promise;
    }


    return {
        getMovies: getMovies,
        getMovieStream: getMovieStream,
        search: search,
        getGenre: filterByGenre,
        sortBy: sortBy
    };
}());
