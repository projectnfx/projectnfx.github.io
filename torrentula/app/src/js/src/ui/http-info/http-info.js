//All stats
import React, { Component } from 'react';
import ReactInStyle from 'react-in-style';
import HttpButtons from '../http-buttons';

class HttpInfo extends Component {

  render() {
    return (
      <span className='item-stats'>
        <div className='col file-name'>{this.props.name}</div>
        <div className='col small-info'>{this.props.info.size}</div>
        <div className='col small-info'>-</div>
        <div className='col small-info'>{this.props.info.downloadSpeed}</div>
        <div className='col small-info'>-</div>
        <div className='col buttons-col'><HttpButtons {...this.props} /> </div>
      </span>
    );
  }
};

HttpInfo.prototype.displayName = 'HttpInfo';

export default HttpInfo;
