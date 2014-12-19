jquery.applink
==============

Create links to native apps from mobile (or minor cases from desktop) browsers.

HTML links should have the web url as default, but you can add an alternate link using the registered app protocol to invoke apps like Facebook, Twitter, Foursquare, etc...

Example:

```html
<a href="https://facebook.com/me" data-applink="fb://profile">My Facebook Profile</a>
```

Also, you can use it to share your page, like:

```html
<a href="http://twitter.com/intent/tweet?url=<?php echo $url; ?>&amp;text=<?php echo urlencode($text); ?>" data-applink="twitter://post?url=<?php echo $url; ?>&amp;text=<?php echo urlencode($text); ?>">Share My Web in Twitter</a>
```

This action will try to open the Twitter mobile app, and if is not available, it will open the default share modal at browser.

You have a extended schemes list available at http://wiki.akosma.com/IPhone_URL_Schemes and http://handleopenurl.com/scheme

To enable the plugin:

```javascript
$(document).ready(function () {
	$('a[data-applink]').applink();
});
```

All options and default values:

```javascript
$(document).ready(function () {
	$('a[data-applink]').applink({
		popup: 'auto', // disable/enable share popup created by plugin. If auto, olny will be enabled to facebook and twitter domains
		desktop: false, // disable/enable native app check for no mobile devices
		data: 'applink' // load native links from data-XXXXXX attribute,
		timeout: 1500 // time in ms to detect app before launch HTTP link (only when is mobile and desktop is false)
	});
});
```

Also, if you are using this plugin to set native links to a large list, you can use the delegate function to get the best performance:

```javascript
$(document).ready(function () {
	$('.links-list').applink({
		popup: 'auto', // disable/enable share popup created by plugin. If auto, olny will be enabled to facebook and twitter domains
		desktop: false, // disable/enable native app check for no mobile devices
		delegate: 'a[data-applink]', // Delegate action into the parent element (default is null)
		data: 'applink' // load native links from data-XXXXXX attribute,
		timeout: 1500 // time in ms to detect app before launch HTTP link (only when is mobile and desktop is false)
	});
});
```

Enjoy!
