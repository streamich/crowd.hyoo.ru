namespace $ {
	$mol_test({
		
		'Default state'() {
			const store = new $hyoo_crowd_text()
			$mol_assert_like( store.text, '' )
		},
		
		'Auto tokenize'() {
			
			const store = new $hyoo_crowd_text().fork(1)
			store.text = 'foo bar'
			
			$mol_assert_like( store.tokens.length, 2 )
			$mol_assert_like( store.text, 'foo bar' )
			$mol_assert_like( store.root.toJSON().stamps, [ 2000001, 4000001 ] )
			
		},
		
		'Replace with same tokens count'() {
			
			const store = new $hyoo_crowd_text().fork(1)
			store.text = 'foo bar'
			store.text = 'xxx yyy'
			
			$mol_assert_like( store.tokens.length, 2 )
			$mol_assert_like( store.text, 'xxx yyy' )
			$mol_assert_like( store.root.toJSON().stamps, [ 2000001, 4000001 ] )
			
		},
		
		'Replace with more tokens count'() {
			
			const store = new $hyoo_crowd_text().fork(1)
			store.text = 'foo bar'
			store.text = 'foo de bar'
			
			$mol_assert_like( store.tokens.length, 3 )
			$mol_assert_like( store.text, 'foo de bar' )
			$mol_assert_like( store.root.toJSON().stamps, [ 2000001, 6000001, 4000001 ] )
			
		},
		
		'Replace with less tokens count'() {
			
			const store = new $hyoo_crowd_text().fork(1)
			store.text = 'foo de bar'
			store.text = 'foo bar'
			
			$mol_assert_like( store.tokens.length, 2 )
			$mol_assert_like( store.text, 'foo bar' )
			$mol_assert_like( store.root.toJSON().stamps, [ 2000001, 6000001, -7000001 ] )
			
		},
		
		'Cut from end'() {
			
			const store = new $hyoo_crowd_text().fork(1)
			store.text = 'foo bar'
			store.text = 'foo'
			
			$mol_assert_like( store.tokens.length, 1 )
			$mol_assert_like( store.text, 'foo' )
			$mol_assert_like( store.root.toJSON().stamps, [ 4000001, -5000001 ] )
			
		},
		
		'Concurrent changes'() {
			
			const base = new $hyoo_crowd_text()
			base.text = 'Hello World and fun!'
			
			const left = base.fork(1)
			const right = base.fork(2)
			
			left.text = 'Hello Alice and fun!'
			right.text = 'Say: Hello World and fun!'
			
			const left_delta = left.toJSON()
			const right_delta = right.toJSON()
			
			left.apply( right_delta )
			right.apply( left_delta )

			$mol_assert_equal(
				left.text,
				right.text,
				'Say: Hello Alice and fun!',
			)
			
		},
		
	})
}