import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setMapMode, addMapChar, editMapChar, setCharToPlace } from '../../../../../../redux/actions/action';
import socket from '../../../../../../socket/socketClient';

// Font Awesome Component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Style
import './map.scss';

// Redux Map State To Prop
const mapStateToProps = (state) => {
  return {
    id: state.id,
    roomId: state.roomId,
    charList: state.charList,
    isMobile: state.isMobile,
    mapSetting: state.mapSetting,
    displayPlaceChar: state.displayPlaceChar,
    displayMapGrid: state.displayMapGrid
  };
};

// Redux Map Dispatch To Props
const mapDispatchToProps = (dispatch) => {
  return {
    setMapMode: (mode) => dispatch(setMapMode(mode)),
    addMapChar: (charData) => dispatch(addMapChar(charData)),
    editMapChar: (charData) => dispatch(editMapChar(charData)),
    setCharToPlace: (charId) => dispatch(setCharToPlace(charId))
  };
};

class Map extends Component {
  constructor (props){
    super(props);
    this.handleImageClick = this.handleImageClick.bind(this);
  }

  handleImageClick (e){

    const charData = {
      ownerId: this.props.id,
      charId: this.props.mapSetting.charToPlace,
      x: e.nativeEvent.offsetX - 12.5, // character dot is 25px, -12.5px to place dot in center of click.
      y: e.nativeEvent.offsetY - 12.5  // character dot is 25px, -12.5px to place dot in center of click.
    };

    if (this.props.mapSetting.mode === 'placeChar'){
      if (this.props.mapSetting.charList.some((char) => char.charId === charData.charId)){
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

    const mapChar = this.props.mapSetting.charList.map((char, idx) => {
      return (<div className="map-char" style={{left: char.x, top: char.y}}></div>);
    });

    return (
      <div className="map-img-cont h-100 align-center p-2">
        {this.props.mapSetting.image.src.length === 0
          ? null
          : (<div className={`map-img-overlay font-size-lg font-weight-bold d-inline-block p-relative ${togglePlaceCharClass} ${toggleMapGridClass}`}  onClick={this.handleImageClick}>
               {mapChar}
               <img className="p-relative align-center" src={this.props.mapSetting.image.src}/>
             </div>)}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
