import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';
import { addToChatLog, hideModal, editMapImage, editMapPosition, removeAllMapChar } from '../../../redux/actions/action';
import socket from '../../../socket/socketClient';


// Font Awesome Component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Style
import './uploadImg.scss';

// Redux Map State To Prop
const mapStateToProps = (state) => {
  return {
    id:           state.id,
    roomId:       state.roomId,
    userList:     state.userList,
    modalSetting: state.modalSetting
  };
};

// Redux Map Dispatch To Props
const mapDispatchToProps = (dispatch) => {
  return {
    hideModal: () => dispatch(hideModal()),
    addToChatLog: (content) => dispatch(addToChatLog(content)),
    editMapImage: (src) => dispatch(editMapImage(src)),
    editMapPosition: (left, top) => dispatch(editMapPosition(left, top)),
    removeAllMapChar: () => dispatch(removeAllMapChar())
  };
};


class UploadImg extends Component {
  constructor (props){
    super(props);

    this.state = {
      fileExist: false,
      fileSizeError: false,
      fileTypeError: false,
      src: '',
      height: 0,
      width: 0
    };

    this.fileInput = React.createRef();
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  handleButtonClick (e){

    if (this.props.modalSetting.modalProp.type === 'chat'){
      const name = this.props.userList.find((user) => this.props.id === user.id).name;
      const imgData = {
        type: 'image',
        src: this.state.src,
        height: this.state.height,
        width: this.state.width,
        name
      };

      this.props.addToChatLog({ ...imgData, self: true });
      socket.emit('chat', this.props.roomId, { ...imgData, self: false });
    } else {
      const backgroundData = {
        id: uuid.v4(),
        src: this.state.src,
        height: this.state.height,
        width: this.state.width,
        left: 0,
        top: 0
      };

      this.props.editMapImage(backgroundData);
      socket.emit('mapImage', this.props.roomId, backgroundData);

      this.props.removeAllMapChar();
      socket.emit('removeAllMapChar');
    }

    this.props.hideModal();
  }

  handleFileChange (e){
    e.preventDefault();
    const imagePattern = /\.(jpg|jpeg|png|gif)$/i;
    const file = this.fileInput.current.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(this.fileInput.current.files[0]);

    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        this.setState({
          fileExist: file.name.length !== 0,
          fileTypeError: !imagePattern.test(file.name),
          fileSizeError: file.size > 1000000,
          src: reader.result,
          height: image.height,
          width: image.width,
        });
      };
      image.src = reader.result;
    }
  }

  render() {
    const isDisabled = !this.state.fileExist || this.state.fileTypeError || this.state.fileSizeError;

    return (
      <div className="d-flex f-dir-col f-grow-1">
        <div className="f-grow-1 font-size-lg">
          <div>Select an image to send(max 1MB):</div>
          <label class="inp-file-cont d-flex w-100 cursor-pointer">
            <FontAwesomeIcon icon="upload"/>
            <div className="inp-file-text f-grow-1 pl-3">{this.fileInput.current ? this.fileInput.current.files[0].name : 'Choose an image...'}</div>
            <input id="imageInput" className="d-none" type="file" accept="image/*" ref={this.fileInput} onChange={this.handleFileChange}/>
          </label>
        </div>
        {this.state.fileTypeError
          ? (<div className="text-danger">File must be in jpg/png/gif format</div>)
          : null}
        {this.state.fileSizeError
          ? (<div className="text-danger">File must be smaller than 1MB</div>)
          : null}
        <button className="btn btn-hot cursor-pointer" disabled={isDisabled} onClick={this.handleButtonClick}>
          <FontAwesomeIcon icon="check"/>
          <div className="btn-text">Submit</div>
        </button>
      </div>
    );
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(UploadImg);
