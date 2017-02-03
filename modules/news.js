var parse5 = require( 'parse5' );
var oldnews = {};

function isEqualObj( a, b ) {
	// hack because two identical objects aren't
	return JSON.stringify( a ) === JSON.stringify( b );
}

module.exports = {
	events: {
		/**
		 * The rawnews event is defined in plugins/news.js, and triggers on each poll
		 * of the BBC News API. Here, we extract useable data from the rather idiosyncratic API
		 * and send it to the news event.
		 */
		rawnews: function ( bot, html ) {
			// The BBC sends a JSON file with strings of HTML; we need to drill down
			// two levels to the important bit (this is terrible)
			var nodes = parse5.parseFragment( html ).childNodes[0].childNodes[1].childNodes;
			var news = {};
			var body = null;

			for ( var i = 0; i < nodes.length; i++ ) {
				var curr = nodes[i];
				if ( curr.tagName === 'a' ) {
					for ( var j = 0; j < curr.attrs.length; j++ ) {
						if ( curr.attrs[j].name === 'href' ) {
							news.url = curr.attrs[j].value;
						} else if ( curr.attrs[j].name === 'data-asset-id' ) {
							news.id = curr.attrs[j].value;
						}
					}
					body = curr.childNodes;
					continue;
				}
			}

			for ( i = 0; i < body.length; i++ ) {
				if ( body[i].tagName === 'h2' ) {
					news.prompt = body[i].childNodes[0].value;
				} else if ( body[i].tagName === 'p' ) {
					news.text = body[i].childNodes[0].value;
				}
			}

			bot.fireEvents( 'news', news );
		},
		news: function ( bot, news ) {
			if ( !oldnews[news.id] || !isEqualObj( oldnews[news.id], news ) ) {
				var str = '\u000305' + news.prompt + ':\x0F ' + news.text;
				str += ' ' + 'http://bbc.co.uk' + news.url;

				bot.notice( bot.config.irc.control, str );
				oldnews[news.id] = news;
			}

		}
	}
};
