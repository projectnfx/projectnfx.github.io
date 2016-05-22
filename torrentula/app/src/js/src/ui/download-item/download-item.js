//Contains name, hash, progress, stats
import React, { Component } from 'react';
import TorrentActions from '../../actions/download-actions';
import ReactInStyle from 'react-in-style';
import prettyBytes from 'pretty-bytes';

import TorrentInfo from '../torrent-info'
import HttpInfo from '../http-info';

class DownloadItem extends Component {

  constructor() {
    super();
    this.state = {
      isShowing : false
    };
  }

  //Component lifecycle
  componentDidMount() {
    this.startUpdatingStats();
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.interval);
  }
  //Render loop
  startUpdatingStats() {
    this.interval = requestAnimationFrame(this.tick.bind(this));
  }

  tick() {
    const isTorrent = this.props.download.method === 'TORRENT';
    this.setState({
      isTorrent
    });

    isTorrent ? this.updateTorrentStats() : this.updateHttpStats();
    this.interval = requestAnimationFrame(this.tick.bind(this));
  }

  updateTorrentStats() {
    this.setState(this.getTorrentStats());
  }

  updateHttpStats() {
    this.setState(this.getHttpStats());
  }

  getTorrentStats() {
    const torrent = this.props.download.torrent;
    return {
      progress : (torrent && torrent.parsedTorrent) ? (100 * torrent.downloaded / torrent.parsedTorrent.length).toFixed(1) : 0,
      peers: torrent && torrent.swarm? torrent.swarm.wires.length : 0,
      downloadSpeed: torrent && torrent.swarm? prettyBytes(torrent.swarm.downloadSpeed()) : 0,
      uploadSpeed: torrent && torrent.swarm? prettyBytes(torrent.swarm.uploadSpeed()) : 0,
      completed: (torrent && torrent.parsedTorrent) ? (torrent.downloaded / torrent.parsedTorrent.length) === 1 : false,
      size: torrent && torrent.files[0]? prettyBytes(torrent.files[0].length) : 0
    };
  }

  getHttpStats() {
    const download = this.props.download;
    return {
      size: download.size ? prettyBytes(download.size) : 0,
      progress: download.progress ? download.progress : 0,
      downloadSpeed: download.downloadSpeed ? prettyBytes(download.downloadSpeed) + '/s' : 0,
      completed: download.size && download.progress ? (download.progress === 100) : false
    }
  }

  toggleExtraInfoShowing() {
    this.setState({
      isShowing: !this.state.isShowing
    });
  }

  toggleVideoPreview() {
    const {download} = this.props
    if (!this.state.videoSrc && download.torrent && download.torrent.files[0]) {
      const torrentFile = download.torrent.files[0];
      torrentFile.getBlobURL((err, url) => {
        this.setState({videoSrc: url});
      });
    } else {
      this.setState({videoSrc: null});
    }
  }

  toggleImgPreview() {
    console.log('test');
    const {download} = this.props
    if (!this.state.imgSrc && download.torrent && download.torrent.files[0]) {
      const torrentFile = download.torrent.files[0];
      torrentFile.getBlobURL((err, url) => {
        this.setState({imgSrc: url});
      });
    } else {
      this.setState({imgSrc: null});
    }
  }

  render() {

    return (
      <div className='item'>
        <div className='item-inner'>
          <div className={`progress-bar ${this.state.completed ? "completed" : ""}`} style={{
              width: this.state.progress + '%'
            }} />
            {
              this.state.isTorrent ?
              <TorrentInfo
                name={this.props.download.name}
                info={this.state}
                download={this.props.download}
                onExpand={this.toggleExtraInfoShowing.bind(this)}
                onPreviewVideo={this.toggleVideoPreview.bind(this)}
                onPreviewImage={this.toggleImgPreview.bind(this)} /> :
              <HttpInfo name={this.props.download.name} info={this.state} download={this.props.download} key="httpInfo"/>
            }
            { this.state.isTorrent ?
              <div className={`extra-info ${this.state.isShowing ? "showing" : ""}`}>
                <label htmlFor='item-hash' className="hash-label">Hash: </label><input name='item-hash' type='text' className='hash-input' value={this.props.download.torrent ? this.props.download.torrent.infoHash : ""} />
              </div> : null
            }
            { this.state.videoSrc ? <video className="preview" src={this.state.videoSrc} controls="true" autoPlay="true"/> : null }
            { this.state.imgSrc ? <image className="preview" src={this.state.imgSrc} /> : null }
        </div>
      </div>
    );
  }
};

DownloadItem.prototype.displayName = 'DownloadItem';

const ListStyle = {
  width: '100%',
  position: 'relative',
  overflow: 'auto',
  zoom: 1
};

const progressBarStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  height: '100%'
}

const detailsStyle = {
  position: 'relative',
  top: '0',
  left: '0',
  zIndex: '2'
}

ReactInStyle.add(ListStyle, '.item');
ReactInStyle.add(progressBarStyle, '.progress-bar');
ReactInStyle.add(detailsStyle, '.download-details');

export default DownloadItem;
