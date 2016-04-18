/**
 * A library for uploading files and sending them to a server without submitting a full page
 * @author Gary Bell
 */

/**
 * Constructor for Charon
 * @param uploadURL - the URL to upload the file to
 * @param fileField - the field to use for getting the file for upload
 * @param other - an array of data to be sent with the file upload
 */
var Charon = function(uploadURL, fileField, other) {
    this.url = uploadURL;
    this.file = fileField;
    this.additionalData = other;
};

/**
 * The prototype for the Charon object.
 * All functionality will be in here
 * @type {{url: string, file: string, additionalData: string}}
 */
Charon.prototype = {

    /**
     * Define variables for the upload sending
     */
    // URL to post the files to
    url: ''

    // file input field to upload
    , file: ''

    // other information to submit at the same time as the file
    , additionalData: ''

    /**
     * User defined callbacks for different events.
     * This will allow the using application to customise the way they handle each events.
     */
    // the callback to run when progress has begun
    , loadStartCallback: ''

    // the callback to run when the operation is in progress
    , progressCallback: ''

    // the callback to run when the loading of the file has been aborted
    , abortCallback: ''

    // the callback to run when a resource failed to load
    , errorCallback: ''

    // the callback to run when a resource and its dependents have finished loading
    , loadCallback: ''

    // the callback to run when a resource has timed out
    , timeoutCallback: ''

    // the callback to run when progression has stopped.  This is called after error, abort or load
    , loadEndCallback: ''

    // the callback to run whenever the readyState of the resource load has changed
    , readyStateChangeCallback: ''

    /**
     * Check to see is a particular user callback is set.  If so, we know we can make a function call
     * @param callbackName - the name of the callback to use.  This will be one of:
     *  - loadStartCallback
     *  - progressCallback
     *  - abortCallback
     *  - errorCallback
     *  - loadCallback
     *  - timeoutCallback
     *  - loadEndCallback
     *  - readyStateChangeCallback
     * @return boolean - true is the callback is set.  False if it is not.
     */
    , callbackIsSet: function(callbackName) {
        // going to assume the callback is not set.
        var callbackSet = false;

        /**
         * Check to see that the passed in callbackName is a valid callback reference
         * Whilst this makes painful reading, we're going to be using the eval function so don't want anything malicious to be called by this
         * TODO: find a better way of doing this
         */
        if (callbackName === 'loadStartCallback'
            || callbackName === 'progressCallback'
            || callbackName === 'abortCallback'
            || callbackName === 'errorCallback'
            || callbackName === 'loadCallback'
            || callbackName === 'timeoutCallback'
            || callbackName === 'loadEndCallback'
            || callbackName === 'readyStateChangeCallback'
        ) {
            var callbackValue = eval(callbackName);
            if (callbackValue !== undefined
                && callbackValue !== ''
            ){
                callbackSet = true;
            }
        }


        return callbackSet;
    }

};