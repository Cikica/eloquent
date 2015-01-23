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
				"body",
				"bodymap",
			],
		},

		define_listener : function ( define ) {

			var self = this
			return [
				{ 
					for       : "reset",
					that_does : function ( heard ) {
						
						var wrap_node, button_wrap_node, button

						wrap_node        = heard.event.target
						button_wrap_node = wrap_node.firstChild
						button           = self.library.morph.index_loop({
							subject : button_wrap_node.children,
							into    : { 
								selected      : "",
								default_value : ""
							},
							else_do : function ( loop ) {
								if ( loop.indexed.getAttribute("data-value") === heard.state.value ) {
									loop.into.selected = loop.indexed
								} 

								if ( loop.indexed.getAttribute("data-value") === heard.state.original_value ) {
									loop.into.default_value = loop.indexed
								}

								return loop.into
							}
						})

						if ( button.selected !== button.default_value ) {
							heard.state.value = heard.state.original_value
							button.selected.setAttribute("class", define.class_name.item )
							button.default_value.setAttribute("class", define.class_name.item_selected )
						}

						if ( define.with.input ) {
							
							var input_node
							input_node = wrap_node.lastChild

							if ( define.with.input.show_on === heard.state.original_value ) {
								input_node.style.display = "block"
							} else { 
								input_node.style.display = "none"
							}
						}
						
						if ( define.shumput ) { 
							define.shumput.reset()
						}

						return heard
					}
				},
				{
					for       : "set value",
					that_does : function ( heard ) {

						var body, item_index, item_value, value_is_set

						item_index   = heard.event.target.getAttribute("data-item-index")
						item_value   = heard.event.target.getAttribute("data-item-value")
						value_is_set = ( heard.state.value.indexOf( item_value ) > -1 )
						body         = self.library.bodymap.make({
							body : heard.state.body.node,
							map  : heard.state.body.map.main
						})

						self.set_or_unset_item({
							class_name : define.class_name,
							node       : body.items[item_index],
							value      : item_value,
							index      : item_index,
							map        : heard.state.body.map.item,
							set        : value_is_set
						})

						heard.state.value = ( value_is_set ? 
							self.library.morph.surject_array({
								array : heard.state.value,
								with  : [ item_value ]
							}) :
							self.library.morph.inject_array({
								array : heard.state.value,
								with  : [ item_value ]
							})
						)

						return heard
					}
				}
			]
		},

		set_or_unset_item : function ( define ) {

			var body
			body = this.library.bodymap.make({
				body : define.node,
				map  : define.map,
			})

			if ( define.set ) {
				body.box.setAttribute("class",  define.class_name.item_box )
				body.text.setAttribute("class", define.class_name.item )
			} else { 
				body.box.setAttribute("class",  define.class_name.item_box_selected )
				body.text.setAttribute("class", define.class_name.item_selected )
			}
		},
	}
)