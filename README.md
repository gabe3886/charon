# Charon
Named after the ferryman for the river Styx in Greek mythology, this will transport files and other data to a server via http/s without submitting the full page.

## Usage
### Set up
Setting up Charon for use is simple.  Include the Charon.js script in your web page and then create a new Charon instance, `var charon = new Charon()`

When creating the instance, you can set the properties required to do what you need:

    var charon = new Charon({
        url: '/upload.php', // upload location
        file: document.getElementById('file1'), // file field
    });

The following properties can be set when creating a new charon instance:

*  url - the URL to post the files to e.g. `url: 'uplaod.php'`
*  file - the field of the file upload input e.g. `file: document.getElementById('file1')`
*  additionalData - any additional data to post with the file upload e.g `additionalData: {fileDescription: 'a description of the file'}`
*  outputDebugging - should the debugging be output to the javascript console (defaults to false) `outputDebugging: true`
*  loadStartCallback - the callback function to use when the loadstart event is triggered e.g. `loadStartCallback: myLoadStartFunction`
*  progressCallback - the callback function to use when the progress event is triggered e.g. `progressCallback: myProgressFunction`
*  abortCallback - the callback function to use when the abort event is triggered e.g. `abortCallback: myAbortFunction`
*  errorCallback - the callback function to use when the error event is triggered e.g. `errorCallback: myErrorFunction`
*  loadCallback - the callback function to use when the load event is triggered e.g. `loadCallback: myLoadFunction`
*  timeoutCallback - the callback function to use when the timeout event is triggered e.g. `timeoutCallback: myTimeoutFunction`
*  loadEndCallback - the callback function to use when the loadend event is triggered e.g. `loadEndCallback: myLoadEndFunction`
*  readyStateChangeCallback - the callback function to use when the readstatechange event is triggered e.g. `readyStateChangeCallback: myReadyStateChangeFunction`

### Uploading the file
Once Charon has been set up, the upload can be started by calling `sendFile()` function in Charon.  If Charon was created by `var charon = new Charon({...})`, then the upload can be done with `charon.sendFile()`.