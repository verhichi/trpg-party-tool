import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';
import { CHAR_PRIVACY_LEVEL_ZERO, CHAR_PRIVACY_LEVEL_ONE, CHAR_PRIVACY_LEVEL_THREE, MODAL_TYPE_VIEW_CHAR, MODAL_TYPE_CONFIRM, MODAL_TYPE_EDIT_CHAR, STATUS_TYPE_VALUE, STATUS_TYPE_PARAM } from '../../../../../../../constants/constants'
import { showModal, hideModal } from '../../../../../../../redux/actions/modal';
import { removeMapChar, removeSelCharFromAllMap } from '../../../../../../../redux/actions/mapChar';
import { addChar, removeChar, editCharStat } from '../../../../../../../redux/actions/char';
import { checkSendAsUser, editSendAs } from '../../../../../../../redux/actions/chatSetting';
import { deleteCharMessage, editCharModalTitle, viewCharModalTitle, copyCharMessage } from './char.i18n';
import socket from '../../../../../../../socket/socketClient';
import jszip from 'jszip';
import { saveAs } from 'file-saver';

// Font Awesome Component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Style
import './char.scss';

// Component
import StatusMeter from '../../../../../../partials/statusMeter/statusMeter';
import StatusInput from '../../../../../../partials/statusInput/statusInput';

// Redux Map State To Prop
const mapStateToProps = (state) => {
  return {
    global:         state.global,
    userList:       state.userList,
    displaySetting: state.displaySetting,
    chatSetting:    state.chatSetting,
    mapSetting:     state.mapSetting
  };
};

// Redux Map Dispatch To Props
const mapDispatchToProps = (dispatch) => {
  return {
    showModal:               (modalType, modalProp)  => dispatch(showModal(modalType, modalProp)),
    hideModal:               ()                      => dispatch(hideModal()),
    addChar:                 (charData)              => dispatch(addChar(charData)),
    removeChar:              (charId)                => dispatch(removeChar(charId)),
    removeMapChar:           (mapId, charId)         => dispatch(removeMapChar(mapId, charId)),
    checkSendAsUser:         ()                      => dispatch(checkSendAsUser()),
    editSendAs:              (charId)                => dispatch(editSendAs(charId)),
    removeSelCharFromAllMap: (charId)                => dispatch(removeSelCharFromAllMap(charId)),
    editCharStat:            (charId, statId, value) => dispatch(editCharStat(charId, statId, value))
  };
};

class Char extends Component {
  constructor (props){
    super(props);

    this.handleRemoveClick    = this.handleRemoveClick.bind(this);
    this.handleRemoveConfirm  = this.handleRemoveConfirm.bind(this);
    this.handleEditClick      = this.handleEditClick.bind(this);
    this.handleViewClick      = this.handleViewClick.bind(this);
    this.resetSendAsState     = this.resetSendAsState.bind(this);
    this.handleCopyClick      = this.handleCopyClick.bind(this);
    this.handleCopyConfirm    = this.handleCopyConfirm.bind(this);
    this.handleValueChange    = this.handleValueChange.bind(this);
    this.handleValueChangeEnd = this.handleValueChangeEnd.bind(this);
    this.createExportFile     = this.createExportFile.bind(this);
  }

  createExportFile (){
    const file = new Blob([JSON.stringify({ ...this.props.charData, ownerId: '', charId: '' })], {type: 'application/json'});
    const zip = jszip().file(`char_${this.props.charData.general.name}.json`, file)
    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, `char_${this.props.charData.general.name}.zip`)
    })
  }

  handleRemoveClick (charId, e){
    this.props.showModal(MODAL_TYPE_CONFIRM, {
      title:        '',
      displayClose: false,
      confirmText:  `${deleteCharMessage[this.props.global.lang]} "${this.props.charData.general.name}"?`,
      accept:       this.handleRemoveConfirm,
      decline:      this.props.hideModal
    });
  }

  handleRemoveConfirm (){
    this.props.removeSelCharFromAllMap(this.props.charData.charId);
    this.props.removeChar(this.props.charData.charId);

    this.resetSendAsState();
    socket.emit('delChar', this.props.global.roomId, this.props.charData.charId);
    this.props.hideModal();
  }

  resetSendAsState (){
    if (this.props.charData.charId === this.props.chatSetting.sendAs.sendAsCharacter){
      this.props.checkSendAsUser();
      this.props.editSendAs('');
    }
  }

  handleEditClick (e){
    this.props.showModal(MODAL_TYPE_EDIT_CHAR, {
      title:        editCharModalTitle[this.props.global.lang],
      size:         'lg',
      displayClose: true,
      charId:       this.props.charData.charId
    });
  }

  handleViewClick (e){
    this.props.showModal(MODAL_TYPE_VIEW_CHAR, {
      title:        viewCharModalTitle[this.props.global.lang],
      size:         'lg',
      displayClose: true,
      charId:       this.props.charData.charId
    });
  }

  handleCopyClick (e){
    this.props.showModal(MODAL_TYPE_CONFIRM, {
      title:        '',
      displayClose: false,
      confirmText:  `${copyCharMessage[this.props.global.lang]} "${this.props.charData.general.name}"?`,
      accept:       this.handleCopyConfirm,
      decline:      this.props.hideModal
    });
  }

  handleCopyConfirm (){
    const newCharData = { ...this.props.charData, charId: uuid.v4()};
    this.props.addChar(newCharData);

    if (this.props.charData.general.privacy !== CHAR_PRIVACY_LEVEL_THREE){
      socket.emit('char', this.props.global.roomId, newCharData);
    }

    this.props.hideModal();
  }

  handleValueChange (statId, value){
    this.props.editCharStat(this.props.charData.charId, statId, value);
  }

  handleValueChangeEnd (statId, value){
    socket.emit('editCharStat', this.props.global.roomId,
      this.props.charData.charId,
      statId,
      value
    );
  }


  render() {
    const isOwnChar = this.props.charData.ownerId === this.props.global.id;
    const showName = this.props.charData.general.privacy <= CHAR_PRIVACY_LEVEL_ONE || isOwnChar;
    const showStat = this.props.charData.general.privacy <= CHAR_PRIVACY_LEVEL_ZERO || isOwnChar;
    const charName = showName ? this.props.charData.general.name : 'UNKNOWN';
    const userName = this.props.userList.find(user => user.id === this.props.charData.ownerId).name;

    const charDataType = {
      [STATUS_TYPE_VALUE]: (status) => (<div className="char-data"><span className="font-weight-bold">{status.label}</span>: {isOwnChar ? <StatusInput statId={status.id} value={status.value} onChange={this.handleValueChange} onChangeEnd={this.handleValueChangeEnd}/> : showStat ? status.value : '???'}</div>),
      [STATUS_TYPE_PARAM]: (status) => (
        <div className="char-data">
          <div><span className="font-weight-bold">{status.label}</span>: {isOwnChar ? <StatusInput statId={status.id} value={status.value} onChange={this.handleValueChange} onChangeEnd={this.handleValueChangeEnd}/> : showStat ? status.value : '???'} / {isOwnChar || showStat ? status.maxValue : '???'}</div>
          { showStat && <StatusMeter statId={status.id} value={status.value} maxValue={status.maxValue} color={this.props.charData.general.color} editable={isOwnChar && !(isNaN(status.value) || isNaN(status.maxValue))} onChange={this.handleValueChange} onChangeEnd={this.handleValueChangeEnd}/> }
        </div>
      )
    }

    const statList   = this.props.charData.status.map(status => charDataType[status.type](status));
    const imageStyle = this.props.charData.general.image.length === 0
                         ? null
                         : { backgroundImage: `url(${this.props.charData.general.image})`};

    return(
      <div className="char-cont d-flex" style={{background: `linear-gradient(135deg, ${this.props.charData.general.color} 10%, #fff 0)`}}>
        <div className="char-profile-circle f-shrink-0" style={imageStyle}></div>
        <div className="char-data-cont d-flex f-dir-col f-grow-1 p-1">
          <div className="char-owner one-line-ellipsis font-size-sm font-weight-bold">{userName}</div>
          <div className="one-line-ellipsis font-weight-bold pb-1">{charName}</div>
          { statList }
        </div>
        <div className="d-flex f-dir-col f-shrink-0 pr-1 pt-1">
          {isOwnChar
            && (<div className="char-btn cursor-pointer align-center" onClick={this.handleRemoveClick}>
                 <FontAwesomeIcon icon="window-close"/>
                </div>)}
          {isOwnChar
            ? (<div className="cursor-pointer char-btn align-center f-shrink-0" onClick={this.handleEditClick}>
                 <FontAwesomeIcon icon="pen-square"/>
               </div>)
            : (<div className="cursor-pointer char-btn align-center f-shrink-0" onClick={this.handleViewClick}>
                 <FontAwesomeIcon icon="eye"/>
               </div>)}
          {isOwnChar
            && (<div className="cursor-pointer char-btn align-center f-shrink-0" onClick={this.handleCopyClick}>
                 <FontAwesomeIcon icon="copy"/>
               </div>)}
          {(isOwnChar || this.props.charData.general.privacy === CHAR_PRIVACY_LEVEL_ZERO)
             && (<div className="cursor-pointer char-btn align-center f-shrink-0" onClick={this.createExportFile}>
               <FontAwesomeIcon icon="file-export"/>
              </div>)}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Char);
