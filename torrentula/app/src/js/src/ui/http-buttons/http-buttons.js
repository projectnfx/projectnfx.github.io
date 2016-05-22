//All stats
import React, { Component } from 'react';
import ReactInStyle from 'react-in-style';
import HttpActions from '../../actions/download-actions';

class HttpButtons extends Component {

  render() {
    return (
      <div className='item-buttons'>
          {
            this.props.info.completed ?
              <button className='button-download' onClick={() => this.props.download.saveFile()}><i className='icon-down-circled'></i></button> : null
          }

          <button className='button-clear' onClick={() => HttpActions.clearDownload(this.props.download)}><i className='icon-cancel-circled'></i></button>
      </div>
    );
  }
};

HttpButtons.prototype.displayName = 'HttpButtons';

export default HttpButtons;
