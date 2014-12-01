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
				body         : table_body,
				class_name   : define.class_name,
				with         : define.with,
				event_circle : event_circle
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
					called : "change table",
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
			data                 : define.with.data || {},
			new_table_definition : {}
		}
	},

	define_event : function ( define ) {
		return [
			{ 
				called : "change table"
			},
			{ 
				called : "change view",
				that_happens : [
					{ 
						on : define.body.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) { 
					return heard.event.target.hasAttribute("data-table-choose-view")
				}
			},
		]
	},

	define_listener : function ( define ) {

		var self = this
		return [
			{ 
				for       : "change view",
				that_does : function ( heard ) {
					
					var view_name
					view_name = heard.event.target.getAttribute("data-table-choose-view")

					return define.event_circle.stage_event({
						called : "change table",
						as     : function ( state ) {
							state.new_table_definition = heard.state.data.view[view_name]
							return { 
								state : state,
								event : { 
									target : define.body.body
								}
							}
						}
					})
				}
			},
			{
				for       : "change table",
				that_does : function ( heard ) {

					var table_body, table_content

					table_body    = heard.event.target
					table_content = self.library.transistor.make(
						self.define_row_and_column({
							class_name : define.class_name,
							with       : {
								data   : heard.state.new_table_definition,
								format : define.with.format
							}
						})
					)
					table_body.removeChild( table_body.children[1] )
					table_content.append( table_body )

					return heard
				}
			}
		]
	},

	define_body : function ( define ) {

		var self, content
		
		self    = this
		content = [
			this.define_control_body( define )
		]

		if ( define.with.data ) { 
			content = content.concat([
				this.define_row_and_column({
					class_name : define.class_name,
					with       : {
						data   : define.with.data.view.main,
						format : define.with.format
					}
				})
			])
		}

		return {
			"width" : ( define.with.format.field.width * define.with.data.view.main.column.length ) + "px",
			"class" : define.class_name.wrap,
			"child" : content
		}
	},

	define_control_body : function ( define ) {
		return {
			"class" : "",
			"child" : [ 
				{ 
					"class" : "",
					"text"  : "Back",
					"mark_as" : "",
				},
				{ 
					"class" : "",
					"text"  : "Forward"
				},
				{ 
					"class" : "",
					"text"  : "Some text here"
				}
			]
		}
	},

	define_row_and_column : function ( define ) {

		var self = this
		return {
			"class" : define.class_name.content,
			"child" : [
				this.define_column_name_row({
					class_name : define.class_name,
					with       : { 
						column : define.with.data.column,
						format : define.with.format
					}
				}),
				this.define_row({
					class_name : define.class_name,
					with       : {
						row    : define.with.data.row,
						format : define.with.format
					}
				})
			]
		}
	},

	define_column_name_row : function ( define ) {
		var self = this
		return {
			"class" : define.class_name.head_wrap,
			"child" : this.library.morph.index_loop({
				subject : this.format_column_field_definition( define.with.column ),
				else_do : function ( loop ) {
					return loop.into.concat(
						self.define_column_name_field({
							class_name : define.class_name,
							with       : loop.indexed,
							format     : define.with.format
						})
					)
				}
			})
		}
	},

	define_column_name_field : function ( define ) {
		return {
			"class" : define.class_name.head_name,
			"width" : define.format.field.width + "px",
			"text"  : define.with.text
		}
	},

	format_column_field_definition : function ( definition ) { 
		return this.library.morph.index_loop({
			subject : definition,
			else_do : function ( loop ) {

				var field_definition

				if ( loop.indexed.constructor === String ) { 
					field_definition = { 
						"text" : loop.indexed
					}					
				}

				if ( loop.indexed.constructor === Object ) {
					field_definition = loop.indexed
				}

				return loop.into.concat( field_definition )
			}
		})
	},

	format_row_field_definition : function ( definition ) {
		return this.library.morph.object_loop({
			subject : definition,
			else_do : function ( loop ) {

				var field_definition

				if ( loop.value.constructor === String ) { 
					field_definition = { 
						"text" : loop.value
					}					
				}

				if ( loop.value.constructor === Object ) {
					field_definition = loop.value
				}

				return {
					key   : loop.key,
					value : field_definition,
				}
			}
		})
	},

	define_row_field : function ( define ) { 
		var definition

		definition = {
			"class" : define.class_name.row_name,
			"text"  : define.with.text,
			"width" : define.format.field.width +"px"
		}

		if ( define.with.view ) { 
			definition["data-table-choose-view"] = define.with.view
		}

		return definition
	},

	define_row : function ( define ) {
		var self = this
		return {
			"class" : define.class_name.body_wrap,
			"child" : this.library.morph.index_loop({
				subject : this.library.morph.index_loop({
					subject : define.with.row,
					else_do : function ( format_loop ) { 
						return format_loop.into.concat(
							self.format_row_field_definition( format_loop.indexed )
						)
					}
				}),
				else_do : function ( content_loop ) {

					return content_loop.into.concat({
						"class" : define.class_name.row_wrap,
						"child" : self.library.morph.object_loop({
							"subject" : content_loop.indexed,
							"into?"   : [],
							"else_do" : function ( loop ) {
								return { 
									into : loop.into.concat(
										self.define_row_field({
											class_name : define.class_name,
											format     : define.with.format,
											with       : loop.value
										})
									)
								}
							} 
						})
					})
				}
			})
		}
	},

	convert_string_to_option_name : function ( string ) { 
		return string.toLowerCase().replace(/\s/g, "_")
	}
})