namespace $ {
	
	const tokenizer = $mol_regexp.from({
		token: {
			'line-break' : /(?:\r?\n|\r)/ ,
			'word+' : /[A-ZА-ЯЁ0-9\u0301\u0331]*[a-zа-яё0-9\u0301\u0331]+[-~`!@#$%&*()_+=\[\]{};':"\\\/|?<>,.^]*[^\S\n\r]*/ ,
			'separator' : /[-~`!@#$%&*()_+=\[\]{};':"\\\/|?<>,.^]+[^\S\n\r]*/ ,
		},
	} )
	
	export class $hyoo_crowd_text extends $hyoo_crowd_tuple.of({
		flow: $hyoo_crowd_dict.of( $hyoo_crowd_list ),
		token: $hyoo_crowd_dict.of( $hyoo_crowd_reg ),
	}) {
		
		get root() {
			return this.for( 'flow' ).for( null )
		}
		
		get tokens() {
			return this.root.items as string[]
		}
		
		value_of( token: string ) {
			return this.for( 'token' ).for( token )!.str
		}
		
		get text() {
			const tokens = this.for( 'token' )
			return this.tokens.map( id => tokens.for( id )!.str ).join( '' )
		}
		set text( next: string ) {
			this.splice_line( null, 0, this.root.count, next )
		}
		
		splice_line( id: string | null, from: number, to: number, text: string ) {
			
			const flow = this.for( 'flow' ).for( id )
			const token_ids = flow.items_internal
			const tokens = this.for( 'token' )
			const words = [ ... tokenizer.parse( text ) ]
			
			while( from < to || words.length > 0 ) {
				
				const prev = from < token_ids.length ? tokens.for( token_ids[ from ] ).str : null
				const next = words.length ? words[0].token ?? words[0][0] : ''
				
				if( prev === next ) {
					
					++ from
					words.shift()
					
				} else if( words.length > to - from ) {
					
					const key = $mol_guid( 4, id => tokens.has( id ) )
					tokens.for( key ).str = next
					
					flow.insert( key, from )
					
					words.shift()
					++ from
					++ to
					
				} else if( words.length < to - from ) {
					
					flow.cut( token_ids[ from ] )
					-- to
					
				} else {
					
					tokens.for( token_ids[ from ] ).str = next
					++ from
					words.shift()
					
				}
				
			}
			
		}
		
	}
	
}
