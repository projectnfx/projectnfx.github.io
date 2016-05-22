//All stats
//Loaded size, total size, download speed, upload speed
import React, { Component } from 'react';
import ReactInStyle from 'react-in-style';
import DownloadStore from '../../stores/download-store';
import connectToStores from 'alt/utils/connectToStores';
import prettyBytes from 'pretty-bytes';

@connectToStores
class DownloadStats extends Component {

  constructor() {
    super();
    this.state = {
      loadedSize: 0,
      totalSize: 0,
      downloadSpeed: 0,
      uploadSpeed: 0
    };
  }

  componentDidMount() {
    this.startUpdatingStats();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.interval);
  }

  static getStores() {
    return [DownloadStore];
  }

  static getPropsFromStores() {
    return DownloadStore.getState();
  }

  //Render loop
  startUpdatingStats() {
    this.interval = requestAnimationFrame(this.tick.bind(this));
  }

  tick() {
    this.getStats();
    this.interval = requestAnimationFrame(this.tick.bind(this));
  }

  getStats() {
    let stats = {
      loadedSize: 0,
      totalSize: 0,
      downloadSpeed: 0,
      uploadSpeed: 0
    };

    this.props.downloads.map(download => {
      let downloadStats = this.getStatsFromDownload(download);
      for (let stat in stats) {
        stats[stat] += downloadStats[stat];
      }
    });

    this.setState(stats);
  }

  getStatsFromDownload(download) {
    const isTorrent = (download.method === 'TORRENT');
    let loadedSize = 0,
      size = 0,
      progress = 0,
      totalSize = 0,
      downloadSpeed = 0,
      uploadSpeed = 0;

    if (isTorrent) {
      if (download.torrent && download.torrent.parsedTorrent) {
        progress = (download.torrent.downloaded / download.torrent.parsedTorrent.length).toFixed(1) * 100 || 0;
        totalSize = download.torrent.files[0].length || 0;
        downloadSpeed = download.torrent.swarm.downloadSpeed(),
        uploadSpeed = download.torrent.swarm.uploadSpeed()
      }
    } else {
      progress = download.progress || 0;
      totalSize = download.size || 0;
      downloadSpeed = download.downloadSpeed || 0;
    }

    loadedSize = (progress / 100) * totalSize;

    return {
      loadedSize,
      totalSize,
      downloadSpeed,
      uploadSpeed
    };
  }

  render() {
    const sizeStyle = {
      minWidth: '200px',
      display: 'inline-block',
      textAlign: 'center'
    };
    const dlStyle = {
      minWidth: '120px',
      display: 'inline-block',
      textAlign: 'center'
    };
    return (
      <div className='total-stats'>
            <span style={sizeStyle}><i className="icon-tasks" /> {prettyBytes(this.state.loadedSize)} / {prettyBytes(this.state.totalSize)}</span>
            <span style={dlStyle}><i className="icon-down" /> {prettyBytes(this.state.downloadSpeed)}/s</span>
            <span style={dlStyle}><i className="icon-up" /> {prettyBytes(this.state.uploadSpeed)}/s</span>
      </div>
    );
  }
};

DownloadStats.prototype.displayName = 'DownloadStats';
const style = {
  width: '100%',
  position: 'fixed',
  bottom: 0,
  margin: '10px',
  zIndex: 3,
  backgroundColor: 'rgba(255, 255, 255, .8)'

};
ReactInStyle.add(style, '.total-stats');

export default DownloadStats;
