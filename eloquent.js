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
				// "gregor",
			]
		},

		part_name_to_package_name : { 
			"select" : "dropdown",
			"radio"  : "keyswitch",
			"input"  : "shumput",
			"list"   : "list",
			"text"   : "text",
			"tree"   : "tree_option",
			// "date"   : "gregor",
		},

		shared_event : [
			"reset"
		],

		make : function ( define ) {
			

			var self, eloquent_parts, eloquent_body

			self           = this
			eloquent_body  = this.library.transistor.make({
				"class" : define.class_name.wrap
			})
			eloquent_parts = this.library.morph.index_loop({
				subject : define.body.part,
				else_do : function ( loop ) {

					if ( self.part_name_to_package_name.hasOwnProperty( loop.indexed.type ) ) {

						var package_name, package_part

						package_name = self.part_name_to_package_name[loop.indexed.type]
						package_part = self.library[package_name].make({
							class_name : define.class_name[loop.indexed.type],
							with       : loop.indexed.with
						})

						package_part.append( eloquent_body.body )

						return loop.into.concat({
							part_name    : loop.indexed.type,
							package_name : package_name,
							package_part : package_part
						})

					} else { 
						console.warn("part of type \""+ loop.indexed.type +"\" doth not exist")
						return loop.into
					}
				}
			})

			if ( define.body.append_to ) {
				eloquent_body.append(
					define.body.append_to
				)
			}

			return this.define_interface({
				eloquent_body  : eloquent_body,
				eloquent_parts : eloquent_parts
			})
		},

		define_interface : function ( define ) {
			return {
				body      : define.eloquent_body.body,
				part      : define.eloquent_parts,
				get_state : function () {

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