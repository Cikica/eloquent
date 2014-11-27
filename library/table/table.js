define({

	define : {
		allow   : "*",
		require : [
			"morph",
			"transistor",
			"transit",
			"event_master"
		]
	},

	make : function ( define ) {

		var table_body, event_circle

		table_body = this.library.transistor.make(
			this.define_body( define )
		)

		event_circle = this.library.event_master.make({
			state  : this.define_state( define ),
			events : this.define_event({
				body : table_body,
				with : define
			})
		})
		event_circle.add_listener(
			this.define_listener({
				body       : table_body,
				class_name : define.class_name,
				with       : define.with
			})
		)

		return this.define_interface({
			body         : table_body,
			event_master : event_circle
		})
	},

	define_interface : function ( define ) {
		return {
			body      : define.body.body,
			append    : define.body.append,
			set_value : function ( set ) {
				define.event_master.stage_event({
					called : "set table",
					as     : function ( state ) {
						return { 
							state : {
								data : set.data
							},
							event : define.body.body
						}
					}
				})
			}
		}
	},

	define_state : function ( define ) {
		return {
			table : define.with.data || {}
		}
	},

	define_event : function ( define ) {
		return [
			{ 
				called : "set table"
			}
		]
	},

	define_listener : function ( define ) {
		var self = this
		return [
			{
				for       : "set table",
				that_does : function ( heard ) {
					
					var table_state, table_body, table_content

					table_body    = define.body.body
					table_state   = heard.state
					table_content = this.library.transistor.make(
						self.define_row_and_column({
							class_name : define.class_name,
							date       : heard.state.date
						})
					)

					console.log( table_body )
					return heard
				}
			}
		]
	},

	define_body : function ( define ) {

		var self, content
		
		self    = this
		content = []

		if ( define.with.data ) { 
			content = []
		}

		return { 
			"class" : define.class_name.wrap,
			"child" : []
		}
	},

	define_row_and_column : function ( define ) {

		return {
			"class" : define.class_name.content,
			"child" : [
				{ 
					"class" : define.class_name.head_wrap,
					"child" : this.library.morph.index_loop({
						subject : define.with.column,
						else_do : function ( loop ) {
							return loop.into.concat({ 
								"class" : define.class_name.head_name,
								"text"  : loop.indexed
							})
						}
					})
				},
				{
					"class" : define.class_name.body_wrap,
					"child" : this.library.morph.index_loop({
						subject : define.with.row,
						else_do : function ( loop ) {
							return loop.into.concat(self.define_row({
								class_name : define.class_name,
								column     : define.with.column,
								row        : loop.indexed
							}))
						}
					})
				}
			]
		}
	},

	define_row : function ( define ) {
		var self = this
		return { 
			"class" : define.class_name.row_wrap,
			"child" : this.library.morph.index_loop({
				subject : this.library.morph.index_loop({
					subject : define.column,
					if_done : function ( loop ) {
						return loop.into
					},
					else_do : function ( loop ) {
						var title_name_as_option = self.convert_string_to_option_name( loop.indexed )
						return loop.into.concat(define.row[title_name_as_option])
					}
				}),
				else_do : function ( loop ) {
					return loop.into.concat({
						"class" : define.class_name.row_name,
						"text"  : loop.indexed
					})
				}
			})
		}
	},

	convert_string_to_option_name : function ( string ) { 
		return string.toLowerCase().replace(/\s/g, "_")
	}
})