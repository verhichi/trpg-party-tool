import React, { Component } from 'react';
import { connect } from 'react-redux';
import { STATUS_TYPE_VALUE } from '../../../../constants/constants';

// Redux Map State To Prop
const mapStateToProps = (state) => {
  return { global: state.global };
};

class Status extends Component {
  render() {

    const toggleActiveClass = this.props.isActive ? 'is-active' : '';
    const toggleScrollClass = this.props.global.isMobile ? '' : 'hide-scroll';
    const showStat          = this.props.privacy <= 0 || this.props.ownerId === this.props.global.id;

    const statusList = this.props.status.map(status => {
      if (status.type === STATUS_TYPE_VALUE){
        return (
          <div className="stat-inp-cont mb-1 font-size-lg">
            <span className="font-weight-bold">{status.label}</span>: {showStat ? status.value : '???'}
          </div>
        );
      } else {
        return (
          <div className="stat-inp-cont mb-1 font-size-lg">
            <span className="font-weight-bold">{status.label}</span>: {showStat ? status.value : '???'} / {showStat ? status.maxValue : '???'}
          </div>
        );
      }
    });

    return (
        <div className={`char-modal f-grow-1 ${toggleActiveClass} ${toggleScrollClass}`}>

          {statusList.length === 0
            ? (<div className="align-center p-2">No Statuses</div>)
            : statusList }

        </div>
    );
  }
}

export default connect(mapStateToProps)(Status);
