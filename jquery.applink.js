;(function ($, window, document, undefined) {
    var pluginName = 'applink',
        defaults = {
            popup: 'auto',
            desktop: false,
            delegate: null,
            data: pluginName
        },

        popupOpened = false,

        agent = navigator.userAgent,

        IS_IPAD = agent.match(/iPad/i) !== null,
        IS_IPHONE = !IS_IPAD && ((agent.match(/iPhone/i) !== null) || (agent.match(/iPod/i) !== null)),
        IS_IOS = IS_IPAD || IS_IPHONE,
        IS_ANDROID = !IS_IOS && agent.match(/android/i) !== null,
        IS_MOBILE = IS_IOS || IS_ANDROID;

    var Callback = function ($element, settings) {
        var href = $element.attr('href'),
            applink = $element.data(settings.data);

        var enabled = (IS_MOBILE || settings.desktop) ? applink : false;
        enabled = ((typeof enabled !== 'undefined') && enabled) ? true : false;

        var popup = $element.data('popup');

        if ((typeof popup === 'undefined') || !popup) {
            popup = settings.popup;
        } else {
            popup = (popup.toString() === 'false') ? false : popup;
        }

        if (!enabled) {
            return Link(href, popup);
        }

        PopUp(applink);

        setTimeout(function() {
            if (BrowserHidden()) {
                popupOpened.close();
            } else {
                Link(href, popup);
            }
        }, 300);
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

    var Link = function (href, popup) {
        if ((popup === 'auto') && /^https?:\/\/(www\.)?(facebook|twitter)\.com/i.test(href)) {
            return PopUp(href);
        } else if ((popup !== 'auto') && popup) {
            return PopUp(href);
        }

        if (popupOpened && !popupOpened.closed) {
            popupOpened.close();
        }

        window.location = href;
    }

    var PopUp = function (href) {
        if (popupOpened && !popupOpened.closed) {
            popupOpened.location.replace(href);
            popupOpened.focus();

            return popupOpened;
        }

        var width = (screen.width > 620) ? 600 : screen.width,
            height = (screen.height > 300) ? 280 : screen.height,
            left = (screen.width / 2) - (width / 2),
            top = (screen.height / 2) - (height / 2),
            options = 'location=no,menubar=no,status=no,toolbar=no,scrollbars=no,directories=no,copyhistory=no'
                + ',width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;

        popupOpened = window.open(href, pluginName, options);
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

            $element.on('click.' + pluginName, this.settings.delegate, function (event) {
                event.preventDefault();
                Callback($(this), that.settings);
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
