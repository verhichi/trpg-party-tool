import React, { Component } from 'react';
import { connect } from 'react-redux';
import { editMapChar } from '../../../../../../../redux/actions/action';
import socket from '../../../../../../../socket/socketClient';

// Style
import './charDot.scss';

// Redux Map State To Prop
const mapStateToProps = (state) => {
  return {
    id:     state.id,
    roomId: state.roomId
  };
};

const mapDispatchToProps = (dispatch) => {
  return { editMapChar: (charData) => dispatch(editMapChar(charData)) };
}

class CharDot extends Component {
  constructor (props){
    super(props);
    this.state = {
      isCharMoveMode: false,
      offsetX: 0,
      offsetY: 0
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  componentWillUnmount (){
    document.querySelector('.map-img-overlay').removeEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseDown (e){
    e.stopPropagation();
    if (this.props.id === this.props.charData.ownerId){
      this.setState({
        isCharMoveMode: true,
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY
      });
      document.querySelector('.map-img-overlay').addEventListener('mousemove', this.handleMouseMove);
    }
  }

  handleMouseMove (e){
    e.stopPropagation();
    if (this.state.isCharMoveMode){
      this.props.editMapChar({
        charId: this.props.charData.charId,
        x: e.pageX - document.querySelector('.map-img-overlay').getBoundingClientRect().left - this.state.offsetX,
        y: e.pageY - document.querySelector('.map-img-overlay').getBoundingClientRect().top - this.state.offsetY
      });
    }
  }

  handleMouseUp (e){
    e.stopPropagation();
    if (this.state.isCharMoveMode){
      socket.emit('mapChar', this.props.roomId, {
        charId: this.props.charData.charId,
        x: this.props.charData.map.x,
        y: this.props.charData.map.y
      });
    }
    document.querySelector('.map-img-overlay').removeEventListener('mousemove', this.handleMouseMove);
    this.setState({ isCharMoveMode: false });
  }



  render() {
    const isOwnCharacter = this.props.id === this.props.charData.ownerId;
    const toggleGrabClass = isOwnCharacter ? 'cursor-grabbable' : '';

    const showName = this.props.charData.general.privacy <= 1 || this.props.charData.ownerId === this.props.id;
    const showStat = this.props.charData.general.privacy <= 0 || this.props.charData.ownerId === this.props.id;

    const charName = showName ? this.props.charData.general.name : 'UNKNOWN';

    const statList = this.props.charData.status.map(status => {
      if (status.type === 'value'){
        return(<div className="font-size-sm one-line-ellipsis">{status.label}: {showStat ? status.value : '???'}</div>);
      } else {
        return(<div className="font-size-sm one-line-ellipsis">{status.label}: {showStat ? status.value : '???'} / {showStat ? status.maxValue : '???'}</div>);
      }
    });

    return (
      <div className={`map-char-profile ${toggleGrabClass}`} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onMouseMove={this.handleMouseMove} style={{borderColor: this.props.charData.general.color, backgroundImage: `url(${this.props.charData.general.image})`, left: this.props.charData.map.x, top: this.props.charData.map.y}}>
        <div className="map-char-balloon p-absolute p-1 align-left cursor-default">
          <div className="font-size-md font-weight-bold pb-1 one-line-ellipsis">{charName}</div>
          { statList }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CharDot);
