var request = require( 'request' );
var nude = require( 'nudity' );
module.exports = {
	events: {
		'url:i.imgur.com': function ( bot, url, nick, to ) {
			console.log('ok');
			var path = url.path;
			/*
			 * The script hangs on large images, so rely on Imgur to play nice.
			 * Appending "l" to a filename forces it to be a large thumbnail.
			 */
			if ( path.length === 12 || path.length === 10 ) {
				path = url.path.split( '.' );
				path = path[0] + 'l.' + path[1];
			}
			request( {
				url: url.protocol + '//' + url.host + path,
				headers: {
					accept: 'image/jpeg'
				},
				encoding: null // we want binary
			}, function ( err, res, body ) {
				if ( err ) {
					throw err;
				}
				console.log( res.headers.date );
				nude.scanData( body, function ( err, red ) {
					if ( err ) {
						throw err;
					}
					if ( red ) {
						bot.shout( to, nick + ': lewd' );
					}
				} );
			} );
		}
	}
};