;(function ($, window, document, undefined) {
    var pluginName = 'applink',
        defaults = {
            popup: 'auto',
            popupDomains: 'facebook|twitter',
            desktop: false,
            delegate: null,
            timeout: 1500,
            data: pluginName
        },

        popupOpened = false,

        agent = navigator.userAgent,

        IS_IPAD = agent.match(/iPad/i) !== null,
        IS_IPHONE = !IS_IPAD && ((agent.match(/iPhone/i) !== null) || (agent.match(/iPod/i) !== null)),
        IS_IOS = IS_IPAD || IS_IPHONE,
        IS_ANDROID = !IS_IOS && agent.match(/android/i) !== null,
        IS_MOBILE = IS_IOS || IS_ANDROID;

    var setSettings = function ($element, s) {
        s.href = $element.attr('href');
        s.applink = $element.data(s.data);
        s.popup = $element.data('popup');
        s.desktop = $element.data('desktop');
        s.target = $element.attr('target');

        if ((typeof s.desktop === 'undefined') || !s.desktop) {
            s.desktop = defaults.desktop;
        } else {
            s.desktop = (s.desktop.toString() === 'true');
        }

        s.enabled = (IS_MOBILE || s.desktop) ? s.applink : false;
        s.enabled = ((typeof s.enabled !== 'undefined') && s.enabled) ? true : false;

        if (typeof s.popupDomains === 'undefined') {
            s.popupDomains = defaults.popupDomains;
        }

        if ((typeof s.popup === 'undefined') || !s.popup) {
            s.popup = defaults.popup;
        } else {
            s.popup = (s.popup.toString() === 'false') ? false : s.popup;
        }

        checkPopup = new RegExp('\/\/([a-z]+\.)?(' + s.popupDomains + ')\.', 'i');

        if ((s.popup === 'auto') && checkPopup.test(s.href)) {
            s.popup = true;
        } else if ((s.popup !== 'auto') && s.popup) {
            s.popup = true;
        } else {
            s.popup = false;
        }

        return s;
    }

    var Callback = function (s) {
        setTimeout(function () {
            if (!BrowserHidden()) {
                Link(s);
            } else if (popupOpened) {
                popupOpened.close();
            }
        }, s.timeout);

        window.location = s.applink;
    }

    var BrowserHidden = function () {
        if (typeof document.hidden !== 'undefined') {
          return document.hidden;
        } else if (typeof document.mozHidden !== 'undefined') {
          return document.mozHidden;
        } else if (typeof document.msHidden !== 'undefined') {
          return document.msHidden;
        } else if (typeof document.webkitHidden !== 'undefined') {
          return document.webkitHidden;
        }

        return false;
    }

    var Link = function (s) {
        if (s.popup) {
            return PopUp(s);
        }

        if (popupOpened && !popupOpened.closed) {
            popupOpened.close();
        }

        if (s.target === '_blank') {
            window.open(s.href, '_blank');
        } else {
            window.location = s.href;
        }
    }

    var PopUp = function (s) {
        if (popupOpened && !popupOpened.closed) {
            popupOpened.location.replace(s.href);
            popupOpened.focus();

            return popupOpened;
        }

        var width = (screen.width > 620) ? 600 : screen.width,
            height = (screen.height > 320) ? 300 : screen.height,
            left = (screen.width / 2) - (width / 2),
            top = (screen.height / 2) - (height / 2),
            options = 'location=no,menubar=no,status=no,toolbar=no,scrollbars=no,directories=no,copyhistory=no'
                + ',width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;

        popupOpened = window.open(s.href, pluginName, options);
        popupOpened.focus();

        return popupOpened;
    }

    var Plugin = function (element, options) {
        this.element = element;

        this.settings = $.extend({}, defaults, options);

        this.init();
    }

    Plugin.prototype = {
        init: function () {
            var $element = $(this.element), that = this;

            $element.on('click.' + pluginName, this.settings.delegate, function (e) {
                e.preventDefault();

                var s = setSettings($(this), that.settings);

                if (!s.enabled) {
                    return Link(s);
                }

                Callback(s);
            });
        },

        destroy: function () {
            $(this.element).off('.' + pluginName);
        }
    };

    $.fn[pluginName] = function (options) {
        if ((options === undefined) || (typeof options === 'object')) {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        }

        if ((typeof options !== 'string') || (options[0] === '_') || (options === 'init')) {
            return true;
        }

        var returns, args = arguments;

        this.each(function () {
            var instance = $.data(this, 'plugin_' + pluginName);

            if ((instance instanceof Plugin) && (typeof instance[options] === 'function')) {
                returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            }

            if (options === 'destroy') {
                $.data(this, 'plugin_' + pluginName, null);
            }
        });

        return (returns !== undefined) ? returns : this;
    };
})(jQuery, window, document);
