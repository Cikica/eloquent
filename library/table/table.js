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
		var self = this
		return {
			body      : define.body.body,
			append    : define.body.append,
			set_value : function ( set ) {
				define.event_master.stage_event({
					called : "change table",
					as     : function ( state ) {
						var new_state
						new_state = self.define_state({
							class_name : define.class_name,
							with       : {
								data       : {
									view : {
										"main" : set.data
									}
								}
							}
						})
						new_state.view.new_definition = set.data
						return { 
							state : new_state,
							event : {
								target : define.body.body
							}
						}
					}
				})
			}
		}
	},

	define_state : function ( define ) {
		return {
			data : define.with.data || {},
			view : {
				loading_view   : false,
				new_definition : {},
				current_name   : "main",
				history        : {
					position : false,
					record   : [],
				},
			}
		}
	},

	define_event : function ( define ) {
		return [
			{ 
				called : "change table"
			},
			{ 
				called : "change view back",
				that_happens : [
					{
						on : define.body.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) { 
					return heard.event.target.getAttribute("data-button") === "back"
				}
			},
			{ 
				called : "change view forward",
				that_happens : [
					{
						on : define.body.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) { 
					return heard.event.target.getAttribute("data-button") === "forward"
				}
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
					return ( 
						heard.event.target.hasAttribute("data-table-choose-view") &&
						heard.state.view.loading_view === false
					)
				}
			},
		]
	},

	define_listener : function ( define ) {

		var self = this
		return [
			{ 
				for       : "change view back",
				that_does : function ( heard ) {

					if ( heard.state.view.history.record.length > 0 ) {
						return define.event_circle.stage_event({
							called : "change view",
							as     : function ( state ) {
								return { 
									state : state,
									event : { 
										target : {
											getAttribute : function () { 
												return heard.state.view.history.record[heard.state.view.history.record.length-2]
											}
										}
									}
								}
							}
						})
					} else {
						return heard
					}
				}
			},
			{ 
				for       : "change view",
				that_does : function ( heard ) {
					console.log("change baby change")
					var view_name, view_definition, control_text_body

					view_name         = heard.event.target.getAttribute("data-table-choose-view")
					view_definition   = heard.state.data.view[view_name]
					control_text_body = define.body.get("control text").body
					

					if ( view_definition.constructor === Object ) {

						var view_definition_method

						view_definition_method        = view_definition.when.finished
						control_text_body.textContent = "Loading..."
						heard.state.view.loading_view = true

						view_definition.when = {
							finished : function ( given ) {

								var new_table_definition
								new_table_definition = view_definition_method.call({}, given )

								define.event_circle.stage_event({
									called : "change table",
									as     : function ( state ) {
										control_text_body.textContent = "Viewing "+ view_name
										state.view.new_definition     = new_table_definition
										state.view.current_name       = view_name
										state.data.view[view_name]    = new_table_definition
										state.view.loading_view       = false
										state.view.history.record     = state.view.history.record.concat(
											view_name
										)

										return { 
											state : state,
											event : { 
												target : define.body.body
											}
										}
									}
								})
							}
						}
						self.library.transit.to( view_definition )
					}

					// if ( view_definition.constructor === Function ) {}

					return heard
					// return define.event_circle.stage_event({
					// 	called : "change table",
					// 	as     : function ( state ) {

					// 		state.view.new_definition = heard.state.data.view[view_name]
					// 		state.view.current_name   = view_name
					// 		state.view.history.record = state.view.history.record.concat(
					// 			view_name
					// 		)

					// 		return { 
					// 			state : state,
					// 			event : { 
					// 				target : define.body.body
					// 			}
					// 		}
					// 	}
					// })
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
								data   : heard.state.view.new_definition,
								format : define.with.format
							}
						})
					)
					table_body.style.width = ( heard.state.data.view[heard.state.view.current_name].column.length * define.with.format.field.width ) +"px"
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
			"class" : define.class_name.control,
			"child" : [ 
				{ 
					"class"       : define.class_name.control_button,
					"text"        : "Back",
					"data-button" : "back",
					"mark_as"     : "back button",
				},
				{ 
					"class"       : define.class_name.control_button,
					"text"        : "Forward",
					"data-button" : "forward",
					"mark_as"     : "forward button",
				},
				{ 
					"class"   : define.class_name.control_text,
					"mark_as" : "control text",
					"text"    : "Some text here",
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