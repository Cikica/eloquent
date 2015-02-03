(function ( window, module ) {

	if ( window.define && window.define.amd ) {
		define(module)
	} else { 

		var current_scripts, this_script, module_name

		current_scripts     = document.getElementsByTagName("script")
		this_script         = current_scripts[current_scripts.length-1]
		module_name         = this_script.getAttribute("data-module-name") || "body"
		window[module_name] = module
	}
})( 
	window,
	{
		define : {
			allow   : "*",
			require : [
				"morph"
			],
		},

		define_body_map : function () {
			return { 
				"button" : "first",
				"text"   : "last"
			}
		},

		define_body : function ( define ) {
			return {
				"class" : define.class_name.wrap,
				"child" : [
					{
						"class" : define.class_name.body,
						"text"  : define.with.content.text
					},
					{	
						"display" : "none",
						"class"   : define.class_name.side_body,
						"text"    : "some thing here"
					}
				]
			}
		}
	}
)