var FireBean = /** @class */ (function () {
    function FireBean() {
        this._debug = false;
    }
    FireBean.prototype.debug = function (val) {
        if (val === void 0) { val = true; }
        this._debug = val;
        return this;
    };
    ;
    FireBean.prototype.log = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        if (!this._debug)
            return;
        if (window.opener)
            (_a = window.opener.console).log.apply(_a, ['From Child:'].concat(msg));
        console.log.apply(console, msg);
        var _a;
    };
    ;
    FireBean.prototype.parse = function (url) {
        this.log("parse " + url);
        if (FireBean.checkUrl(url)) {
            this.data = FireBean.parseData(url);
            this.log("parsed " + this.data._type);
        }
        else {
            this.log('parse fail');
        }
        ;
        return this;
    };
    FireBean.prototype.getData = function () {
        return this.data;
    };
    FireBean.prototype.exec = function (data) {
        if (data === void 0) { data = this.data; }
        if (data) {
            if (data._type in FireBean.Actions) {
                FireBean.Actions[data._type](data);
                this.log("exec #" + data._type);
            }
            else {
                this.log("not found type \"" + data._type + "\"");
            }
        }
        else {
            this.log('no data, ignore exec');
        }
        ;
        return this;
    };
    ;
    FireBean.prototype.redirect = function (data) {
        var _this = this;
        if (data === void 0) { data = this.data; }
        if (data) {
            var redirectUrl_1 = data._redirect || '/';
            if (data._close === '1') {
                this.log("try close");
                window.close();
                setTimeout(function () {
                    _this.log("close timeout, redirect " + redirectUrl_1);
                    window.open(redirectUrl_1, '_self');
                });
            }
            else {
                this.log("redirect #" + redirectUrl_1);
                window.open(redirectUrl_1, '_self');
            }
            ;
        }
        else {
            this.log('no data, ignore redirect');
        }
        ;
        return this;
    };
    ;
    FireBean.prototype.run = function (debug) {
        if (debug === void 0) { debug = false; }
        return this.debug(debug).parse(location.href).exec().redirect();
    };
    ;
    FireBean.parseData = function (url) {
        var data = {};
        for (var _i = 0, _a = url.split('?').pop().split('&'); _i < _a.length; _i++) {
            var item = _a[_i];
            var _b = item.split('='), key = _b[0], value = _b[1];
            data[decodeURIComponent(key)] = decodeURIComponent(value);
        }
        ;
        return data;
    };
    ;
    FireBean.checkUrl = function (url) {
        return url.split('/').pop().split('?').shift() === '_firebean'
            || url.split('/').pop().split('?').pop().indexOf('_firebean=1') !== -1;
    };
    ;
    FireBean.Actions = {
        set_storage: function (data) {
            localStorage.setItem(data.key, data.value);
        },
        remove_storage: function (data) {
            localStorage.removeItem(data.key);
        },
    };
    return FireBean;
}());
;
if (typeof module !== 'undefined')
    module.exports = FireBean;
