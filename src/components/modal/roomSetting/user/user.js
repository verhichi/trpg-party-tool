import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MODAL_TYPE_EDIT_USER, MODAL_TYPE_ROOM_SETTING, MODAL_TYPE_CONFIRM } from '../../../../constants/constants';
import { showModal, hideModal } from '../../../../redux/actions/modal';
import { removeUser } from '../../../../redux/actions/user';
import socket from '../../../../socket/socketClient';


// Font Awesome Component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Style
import './user.scss';

// Redux Map State To Prop
const mapStateToProps = (state) => {
  return {
    global:   state.global,
    userList: state.userList
  };
};

// Redux Map Dispatch To Props
const mapDispatchToProps = (dispatch) => {
  return {
    showModal:  (modalType, modalProp) => dispatch(showModal(modalType, modalProp)),
    hideModal:  ()                     => dispatch(hideModal()),
    removeUser: (userId)               => dispatch(removeUser(userId))
  };
};

class User extends Component {
  constructor (props){
    super(props);

    this.handleEditClick   = this.handleEditClick.bind(this);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
  }

  handleEditClick (e){
    this.props.showModal(MODAL_TYPE_EDIT_USER, {
      title:        'Edit User',
      displayClose: true
    });
  }

  handleRemoveClick (e){
    this.props.showModal(MODAL_TYPE_CONFIRM, {
      title:        'Kick User',
      displayClose: false,
      confirmText:  `Are you sure you want to kick ${this.props.userData.name} from this room?`,
      accept: [
        this.props.removeUser.bind(null, this.props.userData.id),
        socket.emit.bind(socket, 'delUser', this.props.global.roomId, this.props.userData.id),
        this.props.showModal.bind(null, MODAL_TYPE_ROOM_SETTING, { title: 'Setting', displayClose: true })
      ],
      decline: this.props.showModal.bind(null, MODAL_TYPE_ROOM_SETTING, { title: 'Room Setting' })
    });
  }

  render() {
    return (
      <div className="user-cont d-flex w-100 mb-2">
        <div className="user-stat mr-3 align-center">
          {this.props.userData.host
            ? (<FontAwesomeIcon icon="chess-queen"/>)
            : (<FontAwesomeIcon icon="chess-pawn"/>)
          }
        </div>
        <div className="user-btn mr-3 align-center">
          {this.props.global.id === this.props.userData.id
            ? (<div className="cursor-pointer" onClick={this.handleEditClick}>
                 <FontAwesomeIcon icon="pen-square"/>
               </div>)
            : null
          }
        </div>
        <div className="user-btn mr-3 align-center" >
          {this.props.userList.find((user) => user.id === this.props.global.id).host && this.props.global.id !== this.props.userData.id
            ? (<div className="cursor-pointer" onClick={this.handleRemoveClick}>
                 <FontAwesomeIcon icon="window-close"/>
               </div>)
            : null
          }
        </div>
        <div className="user-name f-grow-1 font-weight-bold">
          {this.props.userData.name} {this.props.userData.id === this.props.global.id ? ('(YOU)') : null}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
