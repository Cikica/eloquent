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
			],
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
	}
)