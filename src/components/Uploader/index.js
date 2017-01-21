import React from 'react';
import DropzoneComponent from 'react-dropzone-component';
import styles from './styles.css';

export default class Uploader extends React.Component {
  constructor(props) {
    super(props);

    // For a full list of possible configurations,
    // please consult http://www.dropzonejs.com/#configuration
    this.djsConfig = {
      addRemoveLinks: true,
      acceptedFiles: 'image/jpeg,image/png,image/gif',
      dictDefaultMessage: 'Upload File',
      showFiletypeIcon: false,
      maxFiles: 1,
      params: {
        myParam: 'Hello from a parameter!',
        sizes: JSON.stringify([{ width: 200, height: 200 }, { width: 500, height: 300 }]),
      },
    };


    this.componentConfig = {
      iconFiletypes: ['.jpg', '.png', '.gif'],
      showFiletypeIcon: true,
      postUrl: 'http://localhost:3000/images/upload/',
    };

    // If you want to attach multiple callbacks, simply
    // create an array filled with all your callbacks.
    this.callbackArray = [() => console.log('Hi!'), () => console.log('Ho!')];

    // Simple callbacks work too, of course
    this.callback = () => console.log('Hello!');

    this.success = (file, response) => console.log('uploaded', file, response);

    this.removedfile = file => console.log('removing...', file);

    this.dropzone = null;
  }

  render() {
    const config = this.componentConfig;
    const djsConfig = this.djsConfig;

    // For a list of all possible events (there are many), see README.md!
    const eventHandlers = {
      init: dz => (this.dropzone = dz),
      drop: this.callbackArray,
      addedfile: this.callback,
      success: this.success,
      removedfile: this.removedfile,
    };

    return (
      <DropzoneComponent
        className={styles.filepicker}
        config={config}
        eventHandlers={eventHandlers}
        djsConfig={djsConfig}
      />
    );
  }
}
