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
var Charon = function (uploadURL, fileField, other) {
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

    // should we output debug to the console
    , outputDebugging: false

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
     * Pass messages in to be shown on the console.  Will only output if outputDebugging is set to true
     * @param message - the message to output to the console log
     */
    , debug: function (message) {
        if (this.outputDebugging) {
            console.log(message);
        }
    }

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
    , callbackIsSet: function (callbackName) {
        // going to assume the callback is not set.
        var callbackSet = false;

        /**
         * Check to see that the passed in callbackName is a valid callback reference
         * Whilst this makes painful reading, we're going to be using the eval function so don't want anything malicious to be called by this
         * TODO: find a better way of doing this
         */
        /*if (callbackName === 'loadStartCallback'
            || callbackName === 'progressCallback'
            || callbackName === 'abortCallback'
            || callbackName === 'errorCallback'
            || callbackName === 'loadCallback'
            || callbackName === 'timeoutCallback'
            || callbackName === 'loadEndCallback'
            || callbackName === 'readyStateChangeCallback'
        ) {*/
            //var callbackValue = eval(callbackName);
            if (callbackName !== undefined
                && callbackName !== ''
            ) {
                callbackSet = true;
            }
        //}

        return callbackSet;
    }

    /**
     * Check if a particular item is traversable by a for-key-in loop
     * @param objectToTest - the object/item to check when seeing if it is an array
     * @return boolean
     */
    , isTraversable: function (objectToTest) {
        this.debug(Object.prototype.toString(objectToTest));
        this.debug(objectToTest);
        return (Object.prototype.toString(objectToTest) === "[object Array]" ||
            Object.prototype.toString(objectToTest) === "[object Object]");
    }

    /**
     * Upload the file and any additional data which might be needed
     */
    , sendFile: function () {

        // check we have set the URL before we try and do anything
        if (this.url === '')
        {
            throw new Error('No URL set.  Cannot continue');
        }

        // setup a form data variable so we can build the form with the information we need rather than everything.
        var formData = new FormData();

        /**
         * Check that additionalData is an array
         * If it is, get each item and build the form data
         */
        if (this.isTraversable(this.additionalData)) {
            for (key in this.additionalData) {
                // to stop a blank row going in
                if (this.additionalData[key] !== undefined) {
                    // add the item to the form data in the form key, value
                    formData.append(key, this.additionalData[key]);
                }
            }
        }
        else
        {
            this.debug('additionaData is not an array');
        }

        // set the file to upload
        var uploadFile = this.file.files[0];
        formData.append('charonFile', uploadFile)

        // create the XMLHttpRequest object for sending the information
        var xhr = new XMLHttpRequest();

        // open the request, set the URL from that was given to send the file to, and set the transport to be POST
        xhr.open('POST', this.url, true);

        /**
         * Set up the callback functionality for the different events which can be used
         */

        // setup the loadstart listener and functionality
        xhr.addEventListener('loadstart', this.loadStart(event));

        // setup the progress listener and functionality
        xhr.addEventListener('progress', this.progress(event));

        // setup the abort listener and functionality
        xhr.addEventListener('abort', this.abort(event));

        // setup the error listener and functionality
        xhr.addEventListener('error', this.error(event));

        // setup the load listener and functionality
        xhr.addEventListener('load', this.load(event));

        // setup the timeout listener and functionality
        xhr.addEventListener('timeout', this.timeOut(event));

        // setup the loadend listener and functionality
        xhr.addEventListener('loadend', this.loadEnd(event));

        // setup the readystatechange listener and functionality
        xhr.addEventListener('readystatechange', this.readyStateChange(event));

        // we've set up all of the functionality we need, now send the actual form
        xhr.send(formData);
    }

    /**
     * Load start event functionality.
     * This contains the default functionality for handling the loadstart event.
     * Once the default functionality has ran, this will call the loadstart callback defined by the user in loadStartCallback
     * @param loadStartEvent
     */
    , loadStart: function (loadStartEvent) {
        // there is no default functionality for this built in
        this.debug('running loadStart');

        // Check if the loadStart callback is set, and run the function if so
        if (this.callbackIsSet(this.loadStartCallback)) {
            this.debug('Calling user defined function ' + this.loadStartCallback);
            // Call the user defined loadstart function with the loadstart event
            this.debug(typeof this.loadStartCallback);
            if (typeof this.loadStartCallback === 'function')
            {
                this.loadStartCallback(loadStartEvent);
            }
        }
    }

    /**
     * Progress event functionality.
     * This contains the default functionality for handling the progress event.
     * Once the default functionality has ran, this will call the progress callback defined by the user in progressCallback
     * @param progressEvent
     */
    , progress: function (progressEvent) {
        // there is no default functionality for this built in
        this.debug('running progress');

        // Check if the progress callback is set, and run the function if so
        if (this.callbackIsSet(this.progressCallback)) {
            this.debug('Calling user defined function ' + this.progressCallback);
            // Call the user defined progress function with the progress event
            this.debug(typeof this.progressCallback);
            if (typeof this.progressCallback === 'function')
            {
                this.progressCallback(progressEvent);
            }
        }
    }

    /**
     * Abort event functionality.
     * This contains the default functionality for handling the abort event.
     * Once the default functionality has ran, this will call the abort callback defined by the user in abortCallback
     * @param abortEvent
     */
    , abort: function (abortEvent) {
        // there is no default functionality for this built in
        this.debug('running abort');

        // Check if the abort callback is set, and run the function if so
        if (this.callbackIsSet(this.abortCallback)) {
            this.debug('Calling user defined function ' + this.abortCallback);
            // Call the user defined abort function with the abort event
            //eval(this.abortCallback + "( " + abortEvent + ");");
            if (typeof this.abortCallback === 'function')
            {
                this.abortCallback(abortEvent);
            }
        }
    }

    /**
     * Error event functionality.
     * This contains the default functionality for handling the error event.
     * Once the default functionality has ran, this will call the error callback defined by the user in errorCallback
     * @param errorEvent
     */
    , error: function (errorEvent) {
        this.debug('running error');

        // output an error to the console.  We don't want this to be hidden
        console.log('An error occurred when transferring the file');
        // full dump of the error event
        console.log(errorEvent);

        // Check if the error callback is set, and run the function if so
        if (this.callbackIsSet(this.errorCallback)) {
            this.debug('Calling user defined function ' + this.errorCallback);
            // Call the user defined error function with the error event
            this.debug(typeof this.errorCallback);
            if (typeof this.errorCallback === 'function')
            {
                this.errorCallback(errorEvent);
            }
        }
    }

    /**
     * Load event functionality.
     * This contains the default functionality for handling the load event.
     * Once the default functionality has ran, this will call the load callback defined by the user in loadCallback
     * @param loadEvent
     */
    , load: function (loadEvent) {
        this.debug('running load');

        // Check if the load callback is set, and run the function if so
        if (this.callbackIsSet(this.loadCallback)) {
            this.debug('Calling user defined function ' + this.loadCallback);
            // Call the user defined load function with the load event
            this.debug(typeof this.loadCallback);
            if (typeof this.loadCallback === 'function')
            {
                this.loadCallback(loadEvent);
            }
        }
    }

    /**
     * Timeout event functionality.
     * This contains the default functionality for handling the timeout event.
     * Once the default functionality has ran, this will call the timeout callback defined by the user in timeOutCallback
     * @param timeOutEvent
     */
    , timeOut: function (timeOutEvent) {
        this.debug('running timeout');

        // Check if the timeout callback is set, and run the function if so
        if (this.callbackIsSet(this.timeoutCallback)) {
            this.debug('Calling user defined function ' + this.timeoutCallback);
            // Call the user defined timeout function with the timeOut event
            this.debug(typeof this.timeoutCallback);
            if (typeof this.timeoutCallback === 'function')
            {
                this.timeoutCallback(timeOutEvent);
            }
        }
    }

    /**
     * Loadend event functionality.
     * This contains the default functionality for handling the loadend event.
     * Once the default functionality has ran, this will call the loadend callback defined by the user in loadEndCallback
     * @param loadEndEvent
     */
    , loadEnd: function (loadEndEvent) {
        this.debug('running loadend');

        // Check if the loadend callback is set, and run the function if so
        if (this.callbackIsSet(this.loadEndCallback)) {
            this.debug('Calling user defined function ' + this.loadEndCallback);
            // Call the user defined loadend function with the loadEnd event
            this.debug(typeof this.loadEndCallback);
            if (typeof this.loadEndCallback === 'function')
            {
                this.loadEndCallback(loadEndEvent);
            }
        }
    }

    /**
     * readystatechange event functionality.
     * This contains the default functionality for handling the readystatechange event.
     * Once the default functionality has ran, this will call the readystatechange callback defined by the user in readyStateChangeCallback
     * @param loadEndEvent
     */
    , readyStateChange: function (readyStateChangeEvent) {
        this.debug('running readystatechange');

        // Check if the readystatechange callback is set, and run the function if so
        if (this.callbackIsSet(this.readyStateChangeCallback)) {
            this.debug('Calling user defined function ' + this.readyStateChangeCallback);
            // Call the user defined readystatechange function with the readystatechange event
            this.debug(typeof this.readyStateChangeCallback);
            if (typeof this.readyStateChangeCallback === 'function')
            {
                this.readyStateChangeCallback(readyStateChangeEvent);
            }
        }
    }

};