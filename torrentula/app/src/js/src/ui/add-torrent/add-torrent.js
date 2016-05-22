import React, { Component } from 'react';
import DownloadActions from '../../actions/download-actions';
import ReactInStyle from 'react-in-style';

class AddTorrent extends Component {
  addTorrentFileFromFile(ev) {

    const elem = ev.target;

    if (elem.files.length === 0) return null;
    const reader = new FileReader;
    let index = 0;
    const results = [];
    function read(index) {
      const file = elem.files[index];
      reader.readAsArrayBuffer(file);
    }
    reader.addEventListener('load', (e) => {
      results.push({
        file: elem.files[index],
        target: e.target
      });
      index ++;
      if (index === elem.files.length) {
        DownloadActions.downloadBlob({blobs: results.map(file => file.file)});
      }
      else read(index)
    });
    read(index);
  }
  addTorrentFromHash(e) {
    const hash = e.target.value
    if (hash.length === 40) {
      DownloadActions.downloadHash(hash);
    }
  }
  render() {
    return (
			<div className="add-torrent">
        <input type="file" onChange={this.addTorrentFileFromFile} />
        <p> Or Drop files anywhere to add them.</p>
        <input type="text" placeholder='paste file hash' onChange={this.addTorrentFromHash} />
      </div>
		);
  }
};

AddTorrent.prototype.displayName = 'AddTorrent';

const Style = {
  color: '#fff',
  padding: '15px',
  background: '#555',
  borderRadius: '2px',
  minWidth: '200px',
  position: 'fixed',
  top: '15px',
  right: '30px',
};

ReactInStyle.add(Style, '.add-torrent');

export default AddTorrent;
