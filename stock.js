var Stock = function(ticker) {
    this.ticker = ticker.toUpperCase();
    this.data = null;
    this._listeners = {}
}
Stock.prototype.fetchQuote = function(){
    var stock = this;
    $.ajax({
        type: 'GET',
        async: false,
        url: 'http://dev.markitondemand.com/Api/Quote/jsonp?symbol='+stock.ticker+'&jsoncallback=process',
        jsonp: true,
        contentType: "application/json",
        dataType: 'jsonp',
        jsonpCallback: "process"
    }).done(function(data) {
        stock.data = data.Data;
        this.fire("loaded");
    });
};

// Event listener code pulled from here
// http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/
Stock.prototype.addListener =  function(type, listener){
    if (typeof this._listeners[type] == "undefined"){
        this._listeners[type] = [];
    }

    this._listeners[type].push(listener);
};
Stock.prototype.fire = function(event){
    if (typeof event == "string"){
        event = { type: event };
    }
    if (!event.target){
        event.target = this;
    }

    if (!event.type){  //falsy
        throw new Error("Event object missing 'type' property.");
    }

    if (this._listeners[event.type] instanceof Array){
        var listeners = this._listeners[event.type];
        for (var i=0, len=listeners.length; i < len; i++){
            listeners[i].call(this, event);
        }
    }
};
Stock.prototype.removeListener = function(type, listener){
    if (this._listeners[type] instanceof Array){
        var listeners = this._listeners[type];
        for (var i=0, len=listeners.length; i < len; i++){
            if (listeners[i] === listener){
                listeners.splice(i, 1);
                break;
            }
        }
    }
};