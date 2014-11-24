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
				"table",
				"gregor",
			]
		},

		part_name_to_package_name : { 
			"select" : "dropdown",
			"radio"  : "keyswitch",
			"input"  : "shumput",
			"list"   : "list",
			"text"   : "text",
			"tree"   : "tree_option",
			"table"  : "table",
			"date"   : "gregor",
		},

		shared_event : [
			"reset"
		],

		make : function ( define ) {
			

			var self, eloquent_parts, eloquent_body, eloquent_interface

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
							with       : loop.indexed.with, 
							given      : { 
								reset : function () { 
									console.log("some reset here")		
								}
							}
						})

						package_part.append( eloquent_body.body )

						return loop.into.concat({
							package_part_name : loop.indexed.type,
							package_name      : package_name,
							part_name         : loop.indexed.name || loop.index,
							package_part      : package_part
						})

					} else { 
						console.warn("part of type \""+ loop.indexed.type +"\" doth not exist")
						return loop.into
					}
				}
			})

			eloquent_interface = this.define_interface({
				eloquent_body   : eloquent_body,
				eloquent_parts  : eloquent_parts
			})

			if ( define.body.append_to ) {
				eloquent_body.append(
					define.body.append_to
				)
			}

			// there might be a better way to add global acess
			this.library.morph.index_loop({
				subject : eloquent_parts,
				else_do : function ( loop ) {

					if ( loop.indexed.package_part.set_state ) {
						var state    = loop.indexed.package_part.get_state()
						state.remake = eloquent_interface
						loop.indexed.package_part.set_state( state )
					}
					return loop.into
				}
			})

			return eloquent_interface

		},

		define_interface : function ( define ) {

			var self = this
			return {
				body      : define.eloquent_body.body,
				part      : define.eloquent_parts,
				append    : define.eloquent_body.append,
				reset     : function () { 
					return self.library.morph.index_loop({
						subject : define.eloquent_parts,
						else_do : function ( loop ) {
							if ( loop.indexed.package_part.reset ) {
								loop.indexed.package_part.reset()
								return loop.into.concat( true )
							} else { 
								return loop.into.concat( false )
							}
						} 
					})
				},
				get_state : function () {
					return self.library.morph.index_loop({
						subject : define.eloquent_parts,
						into    : {},
						else_do : function ( loop ) {

							if ( loop.indexed.package_part.get_state ) {
								loop.into[loop.indexed.part_name] = loop.indexed.package_part.get_state()
							}

							return loop.into
						} 
					})
				}
			}
		}
	}
)