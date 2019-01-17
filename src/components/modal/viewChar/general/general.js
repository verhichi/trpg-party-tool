import React, { Component } from 'react';
import { connect } from 'react-redux';

// Redux Map State To Prop
const mapStateToProps = (state) => {
  return {
    isMobile:     state.isMobile,
    id:           state.id,
    modalSetting: state.modalSetting
  };
};


class General extends Component {
  render() {

    const toggleActiveClass = this.props.isActive ? 'is-active' : '';
    const toggleScrollClass = this.props.isMobile ? '' : 'hide-scroll';

    const privacyText = {
      '0': 'Display all data',
      '1': 'Only display name',
      '2': 'Hide all data',
    };

    const imageStyle = this.props.general.image.length === 0
                         ? null
                         : { backgroundImage: `url(${this.props.general.image})`};

    return (
      <div className={`char-modal f-grow-1 ${toggleActiveClass} ${toggleScrollClass}`}>

        <div className="mb-2">
          <div>Profile Image <span className="font-size-sm text-optional">(optional)</span>:</div>
          <div className="profile-circle d-inline-block" style={imageStyle}></div>
        </div>

        <div className="mb-2 font-size-lg">
          <div>Type:</div>
          <div className="pl-2">{this.props.general.type}</div>
        </div>

        <div className="mb-2 font-size-lg">
          <div>Name:</div>
          <div className="pl-2">{this.props.general.name}</div>
        </div>

        <div className="mb-2 font-size-lg">
          <div>Theme Color:</div>
          <div className="pl-2 d-flex p-relative w-100">
            <div className="inp-clr-circle f-shrink-0" style={{background: this.props.general.color}}></div>
            <div className="pseudo-inp f-grow-1">{this.props.general.color}</div>
          </div>
        </div>

        <div className="mb-2 font-size-lg">
          <div>Privacy Level:</div>
          <div className="pl-2">{privacyText[this.props.general.privacy]}</div>
        </div>

        <div className="mb-2 font-size-lg">
          <div>External Character Sheet Link:</div>
          { this.props.general.link.length === 0
              ? (<div className="pl-2">-</div>)
              : (<a  className="pl-2" href={this.props.general.link} target="_blank" rel='noreferrer noopener'>{this.props.general.link}</a>)}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(General);
