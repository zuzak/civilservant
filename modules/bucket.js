// inspired by xkcd's bucket :)
var inventory = [];
var inventoryLimit = 20;
var write = require( 'fs' ).writeFile;

try {
	inventory = require( __rootdir + '/data/inventory.json' ) || [];
} catch ( e ) {
	//
}

function saveInventory() {
	write( __rootdir + '/data/inventory.json', JSON.stringify( inventory ) );
}

function dropItem() {
	return inventory.splice( Math.floor( Math.random() * inventory.length ), 1);
}

function addToInventory( item ) {
	if ( inventory.push( item ) > inventoryLimit ) {
		return dropItem();
	}
}

module.exports = {
	events: {
		action: function ( bot, nick, to, text ) {
			var synonyms = {
				'give': [
					'awards',
					'gives',
					'hands',
					'lends',
					'passes',
					'throws'
				],
				'discard': [
					'discards',
					'dispenses with',
					'ditches',
					'drops',
					'dumps',
					'forsakes',
					'jettisons',
					'relinquishes',
					'sheds',
					'throws away',
				]
			};
			var regex = new RegExp( '(' + synonyms.give.join( '|' ) + ') ' + bot.nick + ' (.+)' );

			var matches = regex.exec( text );
			console.log( matches );

			if ( matches ) {
				var newItem = matches[2];
				var oldItem = addToInventory( newItem );

				if ( oldItem ) {
					bot.action( to,
							'picks up ' +
							newItem +
							' and ' +
							synonyms.discard[Math.floor( Math.random() * synonyms.discard.length )] +
							' ' +
							oldItem
						);
				} else {
					bot.action( to, 'picks up ' + newItem );
				}
				saveInventory();
			}
		}
	},
	message: function ( bot, nick, to ) {
		if ( Math.random() < 0.01 ) {
			var item = dropItem();
			if ( item ) {
				bot.action( to, 'drops ' + item );
			}
		}
	},
	commands: {
		inventory: {
			help: 'Displays the inventory of the bot',
			command: function () {
				return 'I\'m holding ' + inventory.join( ' and ' );
			}
		},
		drop: {
			help: 'Drop an item from inventory',
			command: function () {
				var item = dropItem();
				if ( item ) {
					if ( item === 'apple' ) {
						return 'Core dumped.';
					}
					return 'dropped ' + item;
				}
				return 'shan\'t!';
			}
		},
		inventorylimit: {
			help: 'Sets the inventory limit of the bot',
			privileged: true,
			usage: [ 'limit' ],
			command: function ( bot, msg ) {
				var old = inventoryLimit;
				var newLimit = parseInt( msg.args.limit, 10 );
				if ( typeof newLimit !== 'number' ) {
					return 'cannae do that cap\'n';
				}
				inventoryLimit = newLimit;
				return 'Changed limit from ' + old + ' to ' + inventoryLimit;
			}
		}
	}
};

