var eztv = require('eztv');

module.exports = {
  info: function(range, file) {
    var positions = null;
    if(typeof range !== 'undefined' && range !== null) {
      positions = range.replace(/bytes=/, '').split('-');
    }
    var start = positions === null ? 0 : parseInt(positions[0], 10);
    var end = positions === null ? file.length : positions[1] ? parseInt(positions[1], 10) : file.length - 1;
    var chunkSize = (end - start) + 1;
    var contentRange = "bytes " + start + "-" + end + "/" + file.length;
    var contentType = 'video/mp4';
    if(file.name.indexOf('.avi') != -1) {
      contentType = 'video/avi';
    }else if(file.name.indexOf('.mkv') != -1) {
      contentType = 'video/x-matroska';
    }else if(file.name.indexOf('.wmv') != -1) {
      contentType = 'video/x-ms-wmv';
    }else if(file.name.indexOf('.flv') != -1) {
      contentType = 'video/x-flv';
    }else if(file.name.indexOf('.mpeg') != -1) {
      contentType = 'video/mpeg';
    }

    return {
      'fileName': file.name,
      'start': start,
      'end': end,
      'chunkSize': chunkSize,
      'contentRange': contentRange,
      'contentType': contentType
    };
  },
  link: function(links, id) {
    for(i = 0; i < links.length; i++) {
      if(id == links[i].id) {
        return links[i].link;
      }
    }
    return '';
  },
  shows: function(show, callback) {
    eztv.getShows({query: show}, function(error, results) {
      if(error) {
        console.log(JSON.stringify(error));
        callback(null);
        return;
      }
      if(results.length === 0) {
        console.log('no show results');
        callback(null);
        return;
      }
      callback(results)
    });
  },
  episodes: function(show, callback){
    eztv.getShowEpisodes(show, function(error, results) {
      if(error) {
        console.log(JSON.stringify(error));
        callback(null);
        return;
      }
      if(results.length === 0 || results.episodes.length === 0) {
        console.log('no episode results');
        callback(null);
        return;
      }
      callback(results);
      return;
    });
  }
};
