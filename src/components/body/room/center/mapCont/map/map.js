import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setMapMode, addMapChar, editMapChar, setCharToPlace, editMapPosition } from '../../../../../../redux/actions/action';
import socket from '../../../../../../socket/socketClient';

// Style
import './map.scss';

// Component
import CharDot from './charDot/charDot';

// Redux Map State To Prop
const mapStateToProps = (state) => {
  return {
    id: state.id,
    roomId: state.roomId,
    charList: state.charList,
    isMobile: state.isMobile,
    mapSetting: state.mapSetting,
    displayPlaceChar: state.displayPlaceChar,
    displayMapGrid: state.displayMapGrid,
    displaySidebar: state.displaySidebar
  };
};

// Redux Map Dispatch To Props
const mapDispatchToProps = (dispatch) => {
  return {
    setMapMode: (mode) => dispatch(setMapMode(mode)),
    addMapChar: (charData) => dispatch(addMapChar(charData)),
    editMapChar: (charData) => dispatch(editMapChar(charData)),
    setCharToPlace: (charId) => dispatch(setCharToPlace(charId)),
    editMapPosition: (left, top) => dispatch(editMapPosition(left, top))
  };
};

class Map extends Component {
  constructor (props){
    super(props);
    this.state = {
      isMapMoveMode: false,
      mouseOffset: {
        offsetX: 0,
        offsetY: 0
      }
    };

    this.handleImageClick = this.handleImageClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
  }

  componentWillUnmount (){
    document.querySelector('.map-img-cont').removeEventListener('mousemove', this.handleMouseMove);
    document.querySelector('.map-img-cont').removeEventListener('touchmove', this.handleTouchMove);
  }

  handleMouseDown (e){
    this.setState({
      isMapMoveMode: true,
      mouseOffset: {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY
      }
    });
    document.querySelector('.map-img-cont').addEventListener('mousemove', this.handleMouseMove);
  }

  handleTouchStart (e){
    const sidebarWidth = this.props.displaySidebar ? 350 : 0;
    this.setState({
      isMapMoveMode: true,
      mouseOffset: {
        offsetX: e.touches[0].pageX - parseInt(e.target.style.left) - sidebarWidth,
        offsetY: e.touches[0].pageY - (parseInt(e.target.style.top) + 140)
      }
    });
    document.querySelector('.map-img-cont').addEventListener('touchmove', this.handleTouchMove);
  }

  handleMouseMove (e){
    if (this.state.isMapMoveMode){
      this.props.editMapPosition(
        e.pageX - document.querySelector('.map-img-cont').getBoundingClientRect().left - this.state.mouseOffset.offsetX,
        e.pageY - document.querySelector('.map-img-cont').getBoundingClientRect().top - this.state.mouseOffset.offsetY
      );
    }
  }

  handleTouchMove (e){
    if (this.state.isMapMoveMode){
      this.props.editMapPosition(
        e.touches[0].pageX - document.querySelector('.map-img-cont').getBoundingClientRect().left - this.state.mouseOffset.offsetX,
        e.touches[0].pageY - document.querySelector('.map-img-cont').getBoundingClientRect().top - this.state.mouseOffset.offsetY
      );
    }
  }

  handleMouseUp (e){
    this.setState({ isMapMoveMode: false });
    document.querySelector('.map-img-cont').removeEventListener('mousemove', this.handleMouseMove);
  }

  handleTouchEnd (e){
    this.setState({ isMapMoveMode: false });
    document.querySelector('.map-img-cont').removeEventListener('touchmove', this.handleTouchMove);
  }


  handleImageClick (e){
    if (this.props.mapSetting.mode === 'placeChar'){
      const charData = {
        charId: this.props.mapSetting.charToPlace,
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      };

      if (this.props.charList.some(char => char.charId === charData.charId && char.onMap)){
        this.props.editMapChar(charData);
      } else {
        this.props.addMapChar(charData);
      }

      socket.emit('mapChar', this.props.roomId, charData);
    }

    this.props.setCharToPlace('');
    this.props.setMapMode('');
  }


  render() {
    const togglePlaceCharClass = this.props.mapSetting.mode === 'placeChar'
      ? 'is-place-char-active'
      : '';

    const toggleMapGridClass = this.props.displayMapGrid
      ? 'is-grid-active'
      : '';

    const mapCharDots = this.props.charList.filter(char => char.map.onMap).map(char => {
      return <CharDot key={char.charId} charData={char} />;
    });

    return (
      <div className="map-img-cont p-relative f-grow-1 p-1">
        <div className={`map-img-overlay font-size-lg font-weight-bold d-inline-block p-absolute align-center ${togglePlaceCharClass} ${toggleMapGridClass}`}  onClick={this.handleImageClick} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd} style={{ left: this.props.mapSetting.image.left, top: this.props.mapSetting.image.top}}>
           {mapCharDots}
           <img className="map-img p-relative align-center" src={this.props.mapSetting.image.src}/>
         </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
