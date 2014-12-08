define({
	
	define : {
		allow   : "*",
		require : [
			"morph",
			"transistor",
			"event_master",
			"table",
		]
	},

	make : function ( define ) {

		var tab_body, event_circle

		tab_body     = this.make_body( define )
		event_circle = this.library.event_master.make({
			state : this.define_state(
				define
			),
			events : this.define_event({
				body : tab_body,
				with : define
			})
		})
		event_circle.add_listener(
			this.define_listener({
				body         : tab_body,
				event_circle : event_circle,
				class_name   : define.class_name,
				with         : define.with
			})
		)

		this.set_value({
			event_circle : event_circle,
			body         : tab_body,
			what         : {
				data   : define.with.data,
				format : define.with.format
			}
		})

		return this.define_interface({
			body         : tab_body,
			event_circle : event_circle,
		})
	},

	define_interface : function ( define ) {
		var self = this
		return {
			body      : define.body.body,
			append    : function ( to ) { 
				define.body.append( to ) 
			},
			get_state : function () { 
				return define.event_circle.get_state()
			},
			set_value : function ( what ) {

				self.set_value({
					event_circle : define.event_circle,
					what         : what,
					body         : define.body
				})
			}
		}
	},

	set_value : function ( define ) { 
		define.event_circle.stage_event({
			called : "set value",
			as     : function ( state ) {

				if ( define.what.data ) {
					state.data = define.what.data
				} 

				if ( define.what.format ) { 
					state.format = define.what.format
				}

				return { 
					event : { 
						target : define.body.body
					},
					state : state
				}
			}
		})
	},

	define_state : function ( define ) {
		return {
			format : define.with.format,
			data   : define.with.data,
		}
	},

	make_body : function ( define ) { 
		var tab_body
		tab_body = this.library.transistor.make(
			this.define_body( define )
		)
		// this.append_tabs_to_body_and_return_it({
		// 	class_name : define.class_name,
		// 	with       : {
		// 		format : define.with.format,
		// 		data   : define.with.data,
		// 		body   : tab_body.body
		// 	}
		// })
		
		return tab_body
	},

	define_body : function ( define ) {
		var self = this
		return {
			"class" : define.class_name.wrap,
			"child" : [
				this.define_body_tabs( define )
			]
		}
	},

	define_body_tabs : function ( define ) {
		var self = this
		return {
			"class" : "",
			"child" : this.library.morph.index_loop({
				subject : define.with.data,
				else_do : function ( loop ) {
					return loop.into.concat(
						self.define_tab_body({
							class_name : define.class_name,
							format     : define.with.format.tab,
							tab_name   : "tab "+ loop.index,
							field      : self.library.morph.surject_object({
								object : loop.indexed,
								by     : "key",
								with   : ["data"],
							})
						})
					)
				}
			})
		}
	},

	define_tab_body : function ( define ) {

		var self, field_names, field_values

		self         = this,
		field_names  = this.library.morph.get_the_keys_of_an_object( define.field )
		field_values = this.library.morph.get_the_values_of_an_object( define.field )

		return {
			"class"   : define.class_name.body,
			"child"   : [
				{ 
					"class" : define.class_name.field_body,
					"child" : [
						{
							"class" : define.class_name.field_name,
							"child" : this.library.morph.index_loop({
								subject : this.library.morph.surject_array({
									array : field_names,
									with  : ["data"]
								}),
								else_do : function ( loop ) {
									return loop.into.concat({
										"width"    : define.format.field.width +"px",
										"class"    : define.class_name.field_name_field,
										"text"     : loop.indexed,
										"data-tab" : "true",
									})
								}
							})
						},
						{
							"class" : define.class_name.field_value,
							"child" : this.library.morph.index_loop({
								subject : this.library.morph.surject_array({
									array : field_values,
									by    : "index",
									with  : [ field_names.indexOf( "data" ) ]
								}),
								else_do : function ( loop ) {
									return loop.into.concat({
										"width"    : define.format.field.width +"px",
										"class"    : define.class_name.field_value_field,
										"data-tab" : "true",
										"text"     : loop.indexed
									})
								}
							})
						}
					]
				},
				{	
					"class"   : define.class_name.tab_content,
					"display" : "none",
				}
			]
		}
	},

	define_event : function ( define ) {
		return [
			{ 
				called : "set value"
			},
			{ 
				called       : "toggle tab",
				that_happens : [
					{
						on : define.body.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) { 
					return heard.event.target.hasAttribute("data-tab")
				}
			}
		]
	},

	define_listener : function ( define ) {
		var self = this
		return [
			{ 
				for       : "set value",
				that_does : function ( heard ) {

					var tab_bodies, tab_container
					tab_container   = self.library.morph.index_loop({
						subject : heard.event.target.children,
						into    : heard.event.target,
						else_do : function ( loop ) {
							loop.into.removeChild( loop.indexed )
							return loop.into
						} 
					})
					tab_bodies = self.library.transistor.make(
						self.define_body_tabs({
							class_name : define.class_name,
							with       : {
								format : heard.state.format,
								data   : heard.state.data,
							}
						})
					)
					tab_bodies.append( tab_container )

					self.append_tabs_to_body_and_return_it({
						class_name : define.class_name,
						with       : {
							format : heard.state.format,
							data   : heard.state.data,
							body   : tab_container
						}
					})

					return heard
				}
			},
			{
				for       : "toggle tab",
				that_does : function ( heard ) {
					var tab_content
					tab_content = heard.event.target.parentElement.parentElement.nextSibling
					if ( tab_content.style.display === "none" ) {
						tab_content.style.display = "block"
					} else { 
						tab_content.style.display = "none"
					}
					return heard
				}
			}
		]
	},

	append_tabs_to_body_and_return_it : function ( define ) {

		var tab_body, self
		self     = this
		tab_body = define.with.body

		for (var data_index = 0; data_index < define.with.data.length; data_index++) {
			
			var indexed_data, tab_content
			
			indexed_data = define.with.data[data_index].data
			tab_content  = tab_body.firstChild.children[data_index].children[1]

			for ( var table_name in indexed_data ) {
				
				var table_body
				table_body  = self.library.table.make({
					"class_name" : define.class_name.table,
					"with"       : {
						"control" : false,
						"format"  : { 
							"field" : { 
								"width" : define.with.format.tab.field.width,
							}
						},
						"data" : {
							"view" : {
								"main" : { 
									"row"    : indexed_data[table_name],
									"column" : self.library.morph.get_the_keys_of_an_object(
										indexed_data[table_name][0]
									),
								}
							}
						}
					}
				})

				table_body.append( tab_content )
			}
		}

		return define.with.body
	},
})