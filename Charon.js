/**
 * A library for uploading files and sending them to a server without submitting a full page
 * @author Gary Bell
 */

/**
 * Constructor for Charon
 * @param setupObject - An object with values to override the default Charon values
 */
var Charon = function (setupObject) {

    // Loop through each set object item and set it against the relevant item on the prototype object
    for (var key in setupObject)
    {
        //this.key = setupObject.key
        eval('Charon.prototype.' + key + ' = setupObject. ' + key);
    }

    return Charon.prototype;

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
    , progressCallback: null

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

        try {
            // set the file to upload
            var uploadFile = this.file.files[0];
            formData.append('charonFile', uploadFile);
        }
        catch(e)
        {
            throw new Error('No file set for upload.  Cannot continue');
        }

        // create the XMLHttpRequest object for sending the information
        var xhr = new XMLHttpRequest();

        // open the request, set the URL from that was given to send the file to, and set the transport to be POST
        xhr.open('POST', this.url, true);

        /**
         * Set up the callback functionality for the different events which can be used
         */

        // setup the loadstart listener and functionality
        xhr.addEventListener('loadstart', this.charonLoadStart);

        // setup the progress listener and functionality
        xhr.addEventListener('progress', this.charonProgress);

        // setup the abort listener and functionality
        xhr.addEventListener('abort', this.charonAbort);

        // setup the error listener and functionality
        xhr.addEventListener('error', this.charonError);

        // setup the load listener and functionality
        xhr.addEventListener('load', this.charonLoad);

        // setup the timeout listener and functionality
        xhr.addEventListener('timeout', this.charonTimeOut);

        // setup the loadend listener and functionality
        xhr.addEventListener('loadend', this.charonLoadEnd);

        // setup the readystatechange listener and functionality
        xhr.addEventListener('readystatechange', this.charonReadyStateChange);

        // we've set up all of the functionality we need, now send the actual form
        xhr.send(formData);
    }

    /**
     * Load start event functionality.
     * This contains the default functionality for handling the loadstart event.
     * Once the default functionality has ran, this will call the loadstart callback defined by the user in loadStartCallback
     * @param loadStartEvent
     */
    , charonLoadStart: function (loadStartEvent) {
        // there is no default functionality for this built in
        Charon.prototype.debug('running loadStart');

        // Check if the loadStart callback is set, and run the function if so
        if (Charon.prototype.callbackIsSet(Charon.prototype.loadStartCallback)) {
            Charon.prototype.debug('Calling user defined function ' + Charon.prototype.loadStartCallback);
            // Call the user defined loadstart function with the loadstart event
            Charon.prototype.debug(typeof Charon.prototype.loadStartCallback);
            if (typeof Charon.prototype.loadStartCallback === 'function')
            {
                Charon.prototype.loadStartCallback(loadStartEvent);
            }
        }
    }

    /**
     * Progress event functionality.
     * This contains the default functionality for handling the progress event.
     * Once the default functionality has ran, this will call the progress callback defined by the user in progressCallback
     * @param progressEvent
     */
    , charonProgress: function (progressEvent) {
        // there is no default functionality for this built in
        Charon.prototype.debug('running progress');
        
        // Check if the progress callback is set, and run the function if so
        if (Charon.prototype.callbackIsSet(Charon.prototype.progressCallback)) {
            Charon.prototype.debug('Calling user defined function ' + Charon.prototype.progressCallback);
            // Call the user defined progress function with the progress event
            Charon.prototype.debug(typeof Charon.prototype.progressCallback);
            if (typeof Charon.prototype.progressCallback === 'function')
            {
                Charon.prototype.progressCallback(progressEvent);
            }
        }
    }

    /**
     * Abort event functionality.
     * This contains the default functionality for handling the abort event.
     * Once the default functionality has ran, this will call the abort callback defined by the user in abortCallback
     * @param abortEvent
     */
    , charonAbort: function (abortEvent) {
        // there is no default functionality for this built in
        Charon.prototype.debug('running abort');

        // Check if the abort callback is set, and run the function if so
        if (Charon.prototype.callbackIsSet(Charon.prototype.abortCallback)) {
            Charon.prototype.debug('Calling user defined function ' + Charon.prototype.abortCallback);
            // Call the user defined abort function with the abort event
            //eval(this.abortCallback + "( " + abortEvent + ");");
            if (typeof Charon.prototype.abortCallback === 'function')
            {
                Charon.prototype.abortCallback(abortEvent);
            }
        }
    }

    /**
     * Error event functionality.
     * This contains the default functionality for handling the error event.
     * Once the default functionality has ran, this will call the error callback defined by the user in errorCallback
     * @param errorEvent
     */
    , charonError: function (errorEvent) {
        Charon.prototype.debug('running error');

        // output an error to the console.  We don't want this to be hidden
        console.log('An error occurred when transferring the file');
        // full dump of the error event
        console.log(errorEvent);

        // Check if the error callback is set, and run the function if so
        if (Charon.prototype.callbackIsSet(Charon.prototype.errorCallback)) {
            Charon.prototype.debug('Calling user defined function ' + Charon.prototype.errorCallback);
            // Call the user defined error function with the error event
            Charon.prototype.debug(typeof Charon.prototype.errorCallback);
            if (typeof Charon.prototype.errorCallback === 'function')
            {
                Charon.prototype.errorCallback(errorEvent);
            }
        }
    }

    /**
     * Load event functionality.
     * This contains the default functionality for handling the load event.
     * Once the default functionality has ran, this will call the load callback defined by the user in loadCallback
     * @param loadEvent
     */
    , charonLoad: function (loadEvent) {
        Charon.prototype.debug('running load');

        // Check if the load callback is set, and run the function if so
        if (Charon.prototype.callbackIsSet(Charon.prototype.loadCallback)) {
            Charon.prototype.debug('Calling user defined function ' + Charon.prototype.loadCallback);
            // Call the user defined load function with the load event
            Charon.prototype.debug(typeof Charon.prototype.loadCallback);
            if (typeof Charon.prototype.loadCallback === 'function')
            {
                Charon.prototype.loadCallback(loadEvent);
            }
        }
    }

    /**
     * Timeout event functionality.
     * This contains the default functionality for handling the timeout event.
     * Once the default functionality has ran, this will call the timeout callback defined by the user in timeOutCallback
     * @param timeOutEvent
     */
    , charonTimeOut: function (timeOutEvent) {
        Charon.prototype.debug('running timeout');

        // Check if the timeout callback is set, and run the function if so
        if (Charon.prototype.callbackIsSet(Charon.prototype.timeoutCallback)) {
            Charon.prototype.debug('Calling user defined function ' + Charon.prototype.timeoutCallback);
            // Call the user defined timeout function with the timeOut event
            Charon.prototype.debug(typeof Charon.prototype.timeoutCallback);
            if (typeof Charon.prototype.timeoutCallback === 'function')
            {
                Charon.prototype.timeoutCallback(timeOutEvent);
            }
        }
    }

    /**
     * Loadend event functionality.
     * This contains the default functionality for handling the loadend event.
     * Once the default functionality has ran, this will call the loadend callback defined by the user in loadEndCallback
     * @param loadEndEvent
     */
    , charonLoadEnd: function (loadEndEvent) {
        Charon.prototype.debug('running loadend');

        // Check if the loadend callback is set, and run the function if so
        if (Charon.prototype.callbackIsSet(Charon.prototype.loadEndCallback)) {
            Charon.prototype.debug('Calling user defined function ' + Charon.prototype.loadEndCallback);
            // Call the user defined loadend function with the loadEnd event
            Charon.prototype.debug(typeof Charon.prototype.loadEndCallback);
            if (typeof Charon.prototype.loadEndCallback === 'function')
            {
                Charon.prototype.loadEndCallback(loadEndEvent);
            }
        }
    }

    /**
     * readystatechange event functionality.
     * This contains the default functionality for handling the readystatechange event.
     * Once the default functionality has ran, this will call the readystatechange callback defined by the user in readyStateChangeCallback
     * @param loadEndEvent
     */
    , charonReadyStateChange: function (readyStateChangeEvent) {
        Charon.prototype.debug('running readystatechange');

        // Check if the readystatechange callback is set, and run the function if so
        if (Charon.prototype.callbackIsSet(Charon.prototype.readyStateChangeCallback)) {
            Charon.prototype.debug('Calling user defined function ' + Charon.prototype.readyStateChangeCallback);
            // Call the user defined readystatechange function with the readystatechange event
            Charon.prototype.debug(typeof Charon.prototype.readyStateChangeCallback);
            if (typeof Charon.prototype.readyStateChangeCallback === 'function')
            {
                Charon.prototype.readyStateChangeCallback(readyStateChangeEvent);
            }
        }
    }

};