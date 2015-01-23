(function ( window, module ) {

	if ( window.define && window.define.amd ) {
		define(module)
	} else { 

		var current_scripts, this_script, module_name

		current_scripts     = document.getElementsByTagName("script")
		this_script         = current_scripts[current_scripts.length-1]
		module_name         = this_script.getAttribute("data-module-name") || "event"
		window[module_name] = module
	}
})( 
	window,
	{
		define : {
			allow   : "*",
			require : [
				"body"
			],
		},
		
		define_state : function ( define ) {

			var default_value
			default_value = define.with.option.value || []
			if ( default_value.constructor !== Array ) {
				default_value = [ default_value ]
			}

			return {
				body           : { 
					node : define.body.body,
					map  : {
						main : this.library.body.define_body_map(),
						item : this.library.body.define_item_map(),
					}
				},
				original_value : default_value,
				value          : default_value,
				show_on        : ( 
					define.with.input ? 
						define.with.input.show_on : 
						false
				),
			}
		},

		define_event : function ( define ) { 
			return [
				{ 
					called : "reset"
				},
				{
					called       : "set value",
					that_happens : [
						{ 
							on : define.body.body,
							is : [ "click" ]
						}
					],
					only_if : function ( heard ) {
						return (
							heard.event.target.hasAttribute("data-item-index") &&
							heard.event.target.hasAttribute("data-item-value") 
						)
					}
				}
			]
		}
	}
)