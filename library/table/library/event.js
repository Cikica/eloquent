define({
	
	define : {
		allow   : "*",
		require : [
			"transistor",
			"morph",
			"body"
		]
	},

	define_state : function ( define ) {
		return {
			data : define.with.data || {},
			view : {
				loading_view   : false,
				new_definition : {},
				current_name   : "main",
				history        : {
					position : 0,
					record   : [
						"main"
					],
				},
			}
		}
	},

	define_event : function ( define ) {
		return [
			{ 
				called : "change table"
			},
			{ 
				called : "change view back",
				that_happens : [
					{
						on : define.body.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) {
					return ( 
						heard.event.target.getAttribute("data-button") === "back"	&&
						heard.state.view.history.position > 0
					)
				}
			},
			{ 
				called : "change view forward",
				that_happens : [
					{
						on : define.body.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) { 
					return heard.event.target.getAttribute("data-button") === "forward"
				}
			},
			{ 
				called : "change view",
				that_happens : [
					{ 
						on : define.body.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) { 
					return ( 
						heard.event.target.hasAttribute("data-table-choose-view") &&
						heard.state.view.loading_view === false
					)
				}
			},
		]
	},

	define_listener : function ( define ) {

		var self = this
		return [
			{ 
				for       : "change view back",
				that_does : function ( heard ) {
					return heard
					// return define.event_circle.stage_event({
					// 	called : "change view",
					// 	as     : function ( state ) {

					// 		state.view.history.position = state.view.history.position-1
					// 		return { 
					// 			state : state,
					// 			event : { 
					// 				target : {
					// 					getAttribute : function () {
					// 						console.log( state.view.history.position )
					// 						console.log( state.view.history.record )
					// 						return state.view.history.record[state.view.history.position]
					// 					}
					// 				}
					// 			}
					// 		}
					// 	}
					// })
				}
			},
			{ 
				for       : "change view",
				that_does : function ( heard ) {
					
					var view_name, view_definition, control_text_body

					view_name         = heard.event.target.getAttribute("data-table-choose-view")
					view_definition   = heard.state.data.view[view_name]
					control_text_body = define.body.get("control text").body
					

					if ( view_definition.url ) {

						var view_definition_method

						view_definition_method        = view_definition.when.finished
						control_text_body.textContent = "Loading..."
						heard.state.view.loading_view = true

						view_definition.when = {
							finished : function ( given ) {

								var new_table_definition
								new_table_definition = view_definition_method.call({}, given )

								define.event_circle.stage_event({
									called : "change table",
									as     : function ( state ) {

										state.view.loading_view     = false
										state.data.view[view_name]  = new_table_definition
										state.view.new_definition   = new_table_definition
										state.view.current_name     = view_name

										if ( state.view.history.position === state.view.history.record.length-1 ) {
											state.view.history.position = heard.state.view.history.position + 1
											state.view.history.record   = state.view.history.record.concat(
												view_name
											)	
										}

										return { 
											state : state,
											event : { 
												target : define.body.body
											}
										}
									}
								})
							}
						}
						self.library.transit.to( view_definition )
					}

					if ( view_definition.column ) {

						return define.event_circle.stage_event({
							called : "change table",
							as     : function ( state ) {

								state.view.new_definition   = view_definition
								state.view.current_name     = view_name

								if ( state.view.history.position === state.view.history.record.length-1 ) {
									state.view.history.position = heard.state.view.history.position + 1
									state.view.history.record   = state.view.history.record.concat(
										view_name
									)	
								}
								
								return { 
									state : state,
									event : { 
										target : define.body.body
									}
								}
							}
						})	
					}

					// if ( view_definition.constructor === Function ) {}
					
					return heard
				}
			},
			{
				for       : "change table",
				that_does : function ( heard ) {

					var table_body, table_content

					table_body    = heard.event.target
					table_content = self.library.transistor.make(
						self.library.body.define_row_and_column({
							class_name : define.class_name,
							with       : {
								data   : heard.state.view.new_definition,
								format : define.with.format
							}
						})
					)
					table_body.style.width = ( heard.state.data.view[heard.state.view.current_name].column.length * define.with.format.field.width ) +"px"
					table_body.removeChild( table_body.children[1] )
					table_content.append( table_body )

					return heard
				}
			}
		]
	},
})