(function ( window, module ) {

	if ( window.define && window.define.amd ) {
		define(module)
	} else { 

		var current_scripts, this_script, module_name

		current_scripts     = document.getElementsByTagName("script")
		this_script         = current_scripts[current_scripts.length-1]
		module_name         = this_script.getAttribute("data-module-name") || "listener"
		window[module_name] = module
	}
})( 
	window,
	{
		define : {
			allow   : "*",
			require : [
				"morph",
				"bodymap",
			],
		},

		define_click_callback_interface : function ( define ) {
			return { 
				open_side_text  : function ( given ) {
					define.body.text.style.display = "block"
					define.body.text.textContent   = given.text
				},
				close_side_text : function () {
					define.body.text.style.display = "none"
				},
			}
		},

		define_listener : function ( define ) {
			var self = this
			return [
				{ 
					for       : "click",
					that_does : function ( heard ) {

						if ( define.with.click && define.with.click.method ) {

							return define.with.click.method.call( 
								{},
								{	
									state     : heard.state,
									interface : self.define_click_callback_interface({
										state : heard.state,
										body  : self.library.bodymap.make({
											body : heard.state.body.node,
											map  : heard.state.body.map.main
										}),
									})
								}
							)
						}

						return heard
					}
				},
			]
		},
	}
)