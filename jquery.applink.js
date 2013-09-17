;(function ($, window, document, undefined) {
    var pluginName = 'applink',
        mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent),
        defaults = {
            popup: true,
            desktop: false,
            delegate: null,
            data: pluginName
        };
 
    var Callback = function ($element, settings) {
        var href = $element.attr('href'),
            applink = $element.data(settings.data),
            enabled = (mobile || settings.desktop) ? applink : false;

        enabled = (enabled && (typeof enabled !== 'undefined')) ? true : false;

        if (!enabled) {
            return Link(href, settings);
        }

        window.location = applink;

        var time = +new Date;

        setTimeout(function() {
            if ((+new Date - time) < 400) {
                Link(href, settings);
            }
        }, 300);
    }

    var Link = function (href, settings) {
        if (settings.popup && /^https?:\/\/(www\.)?(facebook|twitter)\.com/i.test(href)) {
            PopUp(href);
        } else {
            window.location = href;
        }
    }

    var PopUp = function (href) {
        var width = (screen.width > 620) ? 600 : screen.width,
            height = (screen.height > 300) ? 280 : screen.height,
            left = (screen.width / 2) - (width / 2),
            top = (screen.height / 2) - (height / 2),
            options = 'location=no,menubar=no,status=no,toolbar=no,scrollbars=no,directories=no,copyhistory=no'
                + ',width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;

        window.open(href, pluginName, options).focus();
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
