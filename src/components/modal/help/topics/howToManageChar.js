import React, { Component, Fragment } from 'react';

// Font Awesome Component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class HowToManageChar extends Component {
  render() {
    return (
      <Fragment>
        <div className="mb-3">
          <div className="border-bottom mb-2">
            <h2 className="m-0">How do I view my characters?</h2>
          </div>
          <div>
            Easy! Click the <FontAwesomeIcon icon="columns"/> to toggle the sidebar.
            <br/>Then click the <FontAwesomeIcon icon="address-card"/> tab to display the character view.
            <br/>All characters made by users in the room will be listed here(unless the user doesn't want to share it).
          </div>
        </div>

        <div className="mb-3">
          <div className="border-bottom mb-2">
            <h2 className="m-0">How do I create a character?</h2>
          </div>
          <div>
            Just click the "Create Character" button!
            <br/>Once clicked, a character creation menu will open.
            <br/>Users will be able to create their own character.
          </div>
        </div>

        <div className="mb-3">
          <div className="border-bottom mb-2">
            <h2 className="m-0">How do I edit a character?</h2>
          </div>
          <div>
            Just click the <FontAwesomeIcon icon="pen-square"/> button!
            <br/>Once clicked, a character edit menu will open.
            <br/>Where users will be able to edit their own character.
          </div>
        </div>

        <div className="mb-3">
          <div className="border-bottom mb-2">
            <h2 className="m-0">How do I delete a character?</h2>
          </div>
          <div>
            Just click the <FontAwesomeIcon icon="window-close"/> button!
            <br/>Once clicked, a confirm window will open.
            <br/>Your character will be deleted after you confirm your deletion.
          </div>
        </div>

        <div className="mb-3">
          <div className="border-bottom mb-2">
            <h2 className="m-0">How do I copy a character?</h2>
          </div>
          <div>
            Just click the <FontAwesomeIcon icon="copy"/> button!
            <br/>Once clicked, a confirm window will open.
            <br/>Your character will be copied after you confirm your deletion.
          </div>
        </div>

        <div className="mb-3">
          <div className="border-bottom mb-2">
            <h2 className="m-0">How do I export a character?</h2>
          </div>
          <div>
            Just click the <FontAwesomeIcon icon="file-export"/> button!
            <br/>Once clicked, the download will start.
          </div>
        </div>

        <div className="mb-3">
          <div className="border-bottom mb-2">
            <h2 className="m-0">How do I import a character?</h2>
          </div>
          <div>
            Just click the <FontAwesomeIcon icon="file-import"/> button!
            <br/>Once clicked, an upload window will open.
            <br/>Upload your character file.
          </div>
        </div>
      </Fragment>
    );
  }
}

export default HowToManageChar;
