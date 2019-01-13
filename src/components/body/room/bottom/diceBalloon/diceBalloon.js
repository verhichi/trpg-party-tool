import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addToChatLog, hideDiceBubble } from '../../../../../redux/actions/action';
import socket from '../../../../../socket/socketClient';
import { getDiceRollResult } from './roll';

// Style
import './diceBalloon.scss';

// Redux Map State To Prop
const mapStateToProps = (state) => {
  return {
    id: state.id,
    roomId: state.roomId,
    displayDiceSetting: state.displayDiceSetting,
    userList: state.userList
  };
};

// Redux Map Dispatch To Props
const mapDispatchToProps = (dispatch) => {
  return {
    addToChatLog: content => dispatch(addToChatLog(content)),
    hideDiceBubble: () => dispatch(hideDiceBubble())
  };
};

class DiceBalloon extends Component {
  constructor (props){
    super(props);
    this.state = {
      diceNumber: 2,
      diceType: 6,
      symbol: '+',
      modifier: 0,
      private: false
    };

    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleDiceNumberChange = this.handleDiceNumberChange.bind(this);
    this.handleDiceTypeChange = this.handleDiceTypeChange.bind(this);
    this.handleSymbolChange = this.handleSymbolChange.bind(this);
    this.handleModifierChange = this.handleModifierChange.bind(this);
    this.handlePrivateChange = this.handlePrivateChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }


  handleOutsideClick (e){
    if (this.diceNode.contains(e.target)) return;
    this.props.hideDiceBubble();
  }

  handleDiceNumberChange (e){
    this.setState({ diceNumber: e.target.value });
  }

  handleDiceTypeChange (e){
    this.setState({ diceType : e.target.value });
  }

  handleSymbolChange (e){
    this.setState({ symbol: e.target.value });
  }

  handleModifierChange (e){
    this.setState({ modifier: e.target.value });
  }

  handlePrivateChange (e){
    this.setState({ private: !this.state.private });
  }

  handleButtonClick (e){
    const result = getDiceRollResult(this.state);
    const name = this.props.userList.find((user) => this.props.id === user.id).name;
    const rollData = {
      type: 'roll',
      private: this.state.private,
      diceSetting: this.state.diceNumber + 'd' + this.state.diceType,
      name,
      ...result
    };

    this.props.addToChatLog(rollData);

    if (!this.state.private){
      socket.emit('chat', this.props.roomId, rollData);
    }

    this.props.hideDiceBubble();
  }

  render (){

    const toggleClass = this.props.displayDiceSetting ? '' : 'd-none';

    return (
      <div className={`dice-help-balloon font-weight-bold font-size-md ${toggleClass}`} ref={node => this.diceNode = node}>
        <div className="dice-setting">
          Dice:
          <div className="sel-cont">
            <select name="dice-number" value={this.state.diceNumber} onChange={this.handleDiceNumberChange}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          d
          <div className="sel-cont">
            <select name="dice-type" value={this.state.diceType} onChange={this.handleDiceTypeChange}>
              <option value="4">4</option>
              <option value="6">6</option>
              <option value="8">8</option>
              <option value="10">10</option>
              <option value="12">12</option>
              <option value="20">20</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        <div className="dice-setting">
          Bonus:
          <div className="sel-cont">
            <select name="symbol" value={this.state.symbol} onChange={this.handleSymbolChange}>
              <option value="+">+</option>
              <option value="-">-</option>
            </select>
          </div>
          <div className="sel-cont">
            <select name="modifier" value={this.state.modifier} onChange={this.handleModifierChange}>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
        </div>
        <div>
          <label><input type="checkbox" checked={this.state.private} onChange={this.handlePrivateChange}/> Do not share result</label>
        </div>
        <button className="btn btn-hot w-100 cursor-pointer" onClick={this.handleButtonClick}>
          <div className="btn-text font-weight-bold">Roll</div>
        </button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiceBalloon);