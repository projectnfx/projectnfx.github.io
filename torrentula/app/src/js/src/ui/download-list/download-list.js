import React, { Component, PropTypes } from 'react';
import connectToStores from 'alt/utils/connectToStores';
import ReactInStyle from 'react-in-style';
import DownloadItem from '../download-item';
import DownloadStore from '../../stores/download-store';


@connectToStores
class List extends Component {

  static PropTypes = {
    torrents: PropTypes.array
  }

  static getStores() {
    return [DownloadStore];
  }

  static getPropsFromStores() {
    return DownloadStore.getState();
  }

  renderItems() {
    return this.props.downloads.map((download, index) => <DownloadItem key={`${index}`} download={download} />);
  }

  render() {
    return (
			<div className='list-items'>
        <span className='headers'>
          <div className='col file-name'>Name</div>
          <div className='col small-info'>Size</div>
          <div className='col small-info'>Peers</div>
          <div className='col small-info'>Down</div>
          <div className='col small-info'>Up</div>
          <div className='col'></div>
        </span>
        {this.renderItems()}
      </div>
		);
  }
};

List.prototype.displayName = 'List';

const ListStyle = {
  width: '100%',
  overflow: 'auto',
  zoom: 1,
  '.headers': {
    overflow: 'auto',
    zoom: 1,
  }
};
ReactInStyle.add(ListStyle, '.list-items');

export default List;
