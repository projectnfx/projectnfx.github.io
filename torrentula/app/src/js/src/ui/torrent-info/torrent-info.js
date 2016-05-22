//All stats
import React, { Component } from 'react';
import ReactInStyle from 'react-in-style';
import TorrentButtons from '../torrent-buttons';
class TorrentInfo extends Component {

  getMagnetLink() {
    return this.props.download.torrent ? this.props.download.magnetLink : 'Loading';
  }

  getHash() {
    return this.props.download.torrent ? this.props.download.torrent.infoHash : 'Loading';
  }

  render() {
    return (
      <span className='item-stats'>
        <div className='col file-name'><a href={this.getMagnetLink()}>{this.props.name}</a></div>
        <div className='col small-info'>{this.props.info.size}</div>
        <div className='col small-info'>{this.props.info.peers}</div>
        <div className='col small-info'>{this.props.info.downloadSpeed}</div>
        <div className='col small-info'>{this.props.info.uploadSpeed}</div>
        <div className='col buttons-col'><TorrentButtons {...this.props} /></div>
      </span>
    );
  }
};

TorrentInfo.prototype.displayName = 'TorrentInfo';

export default TorrentInfo;
