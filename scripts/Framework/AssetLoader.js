class AssetLoader {

    static errorOccured = false;
    static errorMessage = "";

    static images = {};

    static jsonFiles = {};

    static totalRequests = 0;
    static finishedRequests = 0;

    constructor() {
    }

    static loadImage(name, url, callback, context) {
        // If an image is already loaded, skip this call
        if(this.images[name]) {
            throw "AssetLoader: An image is already assigned with name: " + name;
        }

        var img = new Image();
        img.src = url;

        let _this = this;
        img.addEventListener("load", this._onImageLoad);
        img.addEventListener("error", function() { _this._onImageError(event, name); });

        // Event handler für den aufrufer
        img.addEventListener("load", function() { callback.call(context) });


        this.images[name] = img;

        this.totalRequests++;
    }

    static getImage(name) {
        let image = this.images[name] || null;
        return image;
    }

    static resetStats() {
        this.finishedRequests = 0;
        this.totalRequests = 0;
    }

    // EVENT HANDLER

    static _onImageLoad(event) {
        AssetLoader.finishedRequests++;
    }
    static _onImageError(event) {
        this.finishedRequests++;
        this.errorOccured = true;
        this.errorMessage = "Unable to load all ressources";
        event.preventDefault();
    }
}