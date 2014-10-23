define({

	define : {
		allow   : "*",
		require : ["morph"]
	},

	make : function () {
		
		var tabular_body, event_circle

		tabular_body = tabular_body
		return this.define_interface({
			body         : tabular_body,
			event_master : event_circle
		})
	},

	define_interface : function ( define ) {
		return {
			body      : define.body.body,
			append    : define.body.append,
			get_state : function () { 
				return define.event_master.get_state()
			},
			reset     : function () {
				define.event_master.stage_event({
					called : "reset",
					as     : function ( state ) { 
						return { 
							event : { 
								target : define.body.body
							},
							state : state
						}
					}
				})
			}
		}
	},

	define_body : function ( define ) {
		var self
		self = this
		return { 
			"class" : define.class_name.wrap,
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