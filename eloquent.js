(function ( window, module ) {

	if ( window.define && window.define.amd ) {
		define(module)
	} else { 

		var current_scripts, this_script, module_name

		current_scripts     = document.getElementsByTagName("script")
		this_script         = current_scripts[current_scripts.length-1]
		module_name         = this_script.getAttribute("data-module-name") || module.define.name
		window[module_name] = module
	}
})( 
	window,
	{
		define : {
			allow   : "*",
			require : [
				"morph",
				"event_master",
				"transistor",
				"keyswitch",
				"text",
				"shumput",
				"dropdown",
				"list",
				"tree_option",
				"gregor",
				"button",
				"tabular"
			]
		},

		part_name_to_package_name : { 
			"radio"  : "keyswitch",
			"text"   : "text",
			"input"  : "shumput",
			"list"   : "list",
			"select" : "dropdown",
			"tree"   : "tree_option",
			"date"   : "gregor",
			"button" : "button",
			"table"  : "tabular"
		},

		shared_event : [
			"reset"
		],

		make : function ( define ) {
			

			var self, body, event_circle, define_event, event_by_parent_definition

			self                       = this
			define.append_to           = define.part.append_to
			define.part                = ( define.part.part ? define.part.part : define.part )
			body                       = this.library.transistor.make( this.define_body({
				class_name : define.class_name,
				part       : define.part,
			}))
			event_by_parent_definition = this.define_event_by_parent_definition_map({
				class_name : define.class_name,
				body       : body.body
			})
			event_circle               = Object.create( this.library.event_master ).make({
				state  : {
					option : this.define_state_option({
						part : define.part,
						body : body
					}),
				},
				events : this.define_event( 
					event_by_parent_definition 
				)
			})
			event_circle.add_listener( this.define_listener({
				class_name   : define.class_name,
				part_name    : this.library.morph.get_the_keys_of_an_object( this.part_name_to_package_name ),
				package_name : this.library.morph.get_the_values_of_an_object( this.part_name_to_package_name ),
				with         : {}
			}))

			if ( define.append_to ) { 
				body.append(
					define.append_to
				)
			}

			return this.define_interface({
				body                       : body,
				event_circle               : event_circle,
				event_by_parent_definition : event_by_parent_definition,
				shared_event               : this.shared_event
			})
		},

		define_interface : function ( define ) {
			var self = this
			return {
				body    : define.body,
				state   : function () {
					return define.event_circle.get_state()
				},
				stage : function ( what ) {
					if ( define.shared_event.indexOf( what ) > -1 ) { 
						self.stage_shared_events({
							event_circle               : define.event_circle,
							event_by_parent_definition : define.event_by_parent_definition,
							event                      : what,
						})
					} else { 
						console.warn("event "+ what +" is not a shared event")
					}
				}
			}
		},

		stage_shared_events : function ( what ) {

			this.library.morph.object_loop({
				"subject" : what.event_by_parent_definition,
				"into?"   : [],
				else_do   : function ( loop ) {

					if ( loop.value.hasOwnProperty( what.event ) ) {
						what.event_circle.stage_event({
							called : loop.value[what.event].called 
						})
					}

					return []
				}
			})
		},

		define_state_option : function ( define ) {

			var self = this

			return this.library.morph.index_loop({
				subject : define.part,
				into    : {},
				else_do : function ( loop ) {
					
					var package_name, package_object
					
					package_name   = self.part_name_to_package_name[loop.indexed.type]
					package_object = self.library[package_name]

					if ( package_object.hasOwnProperty("define_event") ) {
						var option_name        = self.convert_text_to_option_name( loop.indexed.name )
						loop.into[option_name] = package_object.define_state({
							for  : option_name,
							with : loop.indexed.with,
							body : define.body
						})
					}
					return loop.into
				}
			})
		},

		define_event : function ( event_by_parent_definition ) {

			var self
			self = this

			return this.library.morph.object_loop({
				"subject" : event_by_parent_definition,
				"into?"   : [],
				else_do   : function ( loop ) {
					return { 
						into : loop.into.concat(
							self.library.morph.object_loop({
								"subject" : loop.value,
								"into?"   : [],
								else_do   : function ( loop ) {
									return { 
										into : loop.into.concat(loop.value)
									}
								}
							})
						)
					}
				}
			})
		},

		define_event_by_parent_definition_map : function ( define_with ) {

			var self = this

			return this.library.morph.index_loop({
				"subject" : this.library.morph.get_the_values_of_an_object(
					this.part_name_to_package_name
				),
				"into"    : {},
				"if_done" : function ( loop ) { 
					return loop.into
				},
				"else_do" : function ( loop ) {

					if ( self.library[loop.indexed].hasOwnProperty("define_event") ) {
						loop.into[loop.indexed] = self.library.morph.index_loop({
							"subject" : self.library[loop.indexed].define_event({
								with : define_with
							}),
							into      : {},
							"if_done" : function ( event_loop ) {
								return event_loop.into
							},
							"else_do" : function ( event_loop ) {

								var original_name
								original_name                  = event_loop.indexed.called
								event_loop.indexed.called      = loop.indexed +" "+ event_loop.indexed.called
								event_loop.into[original_name] = event_loop.indexed
								return event_loop.into
							}
						})
					}

					return loop.into
				}
			})
		},

		define_listener : function ( define ) {
			
			var self = this

			return this.library.morph.index_loop({
				subject : define.package_name,
				else_do : function ( loop ) {

					if ( self.library[loop.indexed].hasOwnProperty("define_listener") ) {

						return loop.into.concat(
							self.library.morph.index_loop({
								"subject" : self.library[loop.indexed].define_listener({
									class_name : define.class_name[define.part_name[loop.index]],
									with       : define.with
								}),
								"else_do" : function ( listener_loop ) { 
									listener_loop.indexed.for = loop.indexed +" "+ listener_loop.indexed.for
									return listener_loop.into.concat( listener_loop.indexed )
								}
							})
						)

					} else {
						return loop.into
					}
				}
			})
		},

		define_body : function ( define ) {
			
			var self = this

			return {
				"class" : define.class_name.wrap,
				"child" : this.loop_through_parts_and_perform_action({
					define : define,
					action : function ( loop ) {
						var definition     = loop.package_object.define_body({
							name       : self.convert_text_to_option_name( loop.definition.name || "" ),
							with       : loop.definition.with,
							class_name : define.class_name[loop.definition.type]
						})
						definition.mark_as = loop.package_name
						return definition
					}
				})
			}
		},

		loop_through_parts_and_perform_action : function ( through ) { 
			
			var self = this

			return this.library.morph.index_loop({
				subject : through.define.part,
				else_do : function ( loop ) {

					if ( self.part_name_to_package_name.hasOwnProperty( loop.indexed.type ) ) {
						var package_name
						package_name = self.part_name_to_package_name[loop.indexed.type]
						return loop.into.concat( through.action.call({}, {
							package_name   : package_name,
							package_object : self.library[package_name],
							class_name     : through.define.class_name,
							definition     : loop.indexed,
						}) )

					} else { 
						console.warn("Part type : "+ loop.indexed.type +" doth not exist")
						return loop.into
					}
				}
			})
		},

		convert_text_to_option_name : function ( text ) { 
			return text.replace(/\s/g, "_").toLowerCase()
		}
	}
)