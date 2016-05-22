import React, { Component } from 'react';
import DownloadList from './download-list';
import DownloadStats from './download-stats';
import ReactInStyle from 'react-in-style';
import AddTorrent from './add-torrent';
import DownloadActions from '../actions/download-actions';
import dragDrop from 'drag-drop/buffer'

class App extends Component {

  componentDidMount() {
    dragDrop('body', DownloadActions.addDragDropDownload);
  }

  render() {
    return (
			<div className="tor-app">
        <AddTorrent />
        <div className="header-panel">
          <img src="img/icons/icon128.png" className='logo'/><h1 className='app-name'>Torrentula</h1>
        </div>

        <div className="main-panel">
          <DownloadList />
        </div>

        <div className="lower-panel">
          <DownloadStats />
        </div>

        <div className="file-selector">
        </div>
      </div>
		);
  }
};

App.prototype.displayName = 'App';

const AppStyle = {
  '.header-panel': {
    padding: '60px',
    background: '#333',
    color: 'rgb(200, 200, 200)'
  },
  // backgroundColor: 'rgb(100, 100, 100)',
  width: '100%',
  height: '100%',
  margin: 0,
  padding: 0
};
ReactInStyle.add(AppStyle, '.tor-app');



export default App;
