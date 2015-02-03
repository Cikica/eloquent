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
				"morph",
				"body",
			],
		},

		define_state : function ( define ) { 
			return {
				with : define.with.with,
				body : {
					node : define.body.body,
					map  : {
						main : this.library.body.define_body_map()
					}
				}
			}
		},

		define_event : function ( define ) {
			return [
				{ 
					called       : "click",
					that_happens : [
						{
							on : define.body.body,
							is : [ "click" ]
						}
					],
					only_if : function () {
						return true
					}
				},
			]
		},
	}
)