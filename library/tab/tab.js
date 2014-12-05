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

		tab_body = this.library.transistor.make(
			this.define_body( define )
		)
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

		this.library.morph.index_loop({
			subject : define.with.data,
			else_do : function ( loop ) {
				
				var tab_content, table_body

				tab_content = tab_body.get("tab "+ loop.index ).body.children[2]
				self.library.morph.index_loop({
					subject : "",
					else_do : function ( loop ) {}
				})
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
									"row"    : loop.indexed.data["Audit"],
									"column" : self.library.morph.get_the_keys_of_an_object(
										loop.indexed.data["Audit"][0]
									),
								}
							}
						}
					}
				})
				table_body.append( tab_content )

				return []
			}
		})

		return this.define_interface({
			body         : tab_body,
			event_circle : event_circle
		})
	},

	define_interface : function ( define ) {
		return {
			body      : define.body.body,
			append    : function ( to ) { 
				define.body.append( to ) 
			},
			get_state : function () { 
				return define.event_cricle.get_state()
			}
		}
	},

	define_state : function ( define ) {
		return {}
	},

	define_body : function ( define ) {
		var self = this
		return {
			"class" : define.class_name.wrap,
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
		self = this
		return { 
			"class"   : define.class_name.body,
			"mark_as" : define.tab_name,
			"child"   : [
				{
					"class" : define.class_name.field_name,
					"child" : this.library.morph.index_loop({
						subject : this.library.morph.get_the_keys_of_an_object( define.field ),
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
						subject : this.library.morph.get_the_values_of_an_object( define.field ),
						else_do : function ( loop ) {
							return loop.into.concat({
								"width"    : define.format.field.width +"px",
								"class"    : define.class_name.field_value_field,
								"data-tab" : "true",
								"text"     : loop.indexed
							})
						}
					})
				},
				{
					"class" : define.class_name.tab_content,
				}
			]
		}
	},

	define_event : function ( define ) {
		return [
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
		return [
			{
				for       : "toggle tab",
				that_does : function ( heard ) {
					console.log( heard )
					return heard
				}
			}
		]
	},
})