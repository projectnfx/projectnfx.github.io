//All stats
import React, { Component } from 'react';
import ReactInStyle from 'react-in-style';
import TorrentActions from '../../actions/download-actions';

class TorrentButtons extends Component {

  renderPreviewButton(fileType) {
    if (fileType === 'mp4' || fileType === 'webm') {
      return <button onClick={this.props.onPreviewVideo} className="button-options"><i className='icon-play'></i></button>
    } else if (fileType === 'jpg' || fileType === 'png') {
      return <button onClick={this.props.onPreviewImage} className="button-options"><i className='icon-file-image'></i></button>
    }
  }

  render() {
    let fileType = null;
    if (this.props.download.torrent && this.props.download.torrent.files[0]) {
      fileType = this.props.download.torrent.files[0].name.split('.').pop();
    }
    return (
      <div className='item-buttons'>
          <button className='button-options' onClick={() => this.props.onExpand()}><i className='icon-share'></i></button>
          {
            this.props.info.completed ?
              <button className='button-download' onClick={() => this.props.download.saveFile() }><i className='icon-down-circled'></i></button> :
              (this.props.download.url ? <button className='button-revert' onClick={() => TorrentActions.downloadWithHttp(this.props.download)}><i className='icon-link'></i></button> : null)
          }

          <button className='button-clear' onClick={() => TorrentActions.clearDownload(this.props.download)}><i className='icon-cancel-circled'></i></button>
          {this.renderPreviewButton(fileType)}
      </div>
    );
  }
};

TorrentButtons.prototype.displayName = 'TorrentButtons';

export default TorrentButtons;
