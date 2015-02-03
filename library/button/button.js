define({

	define : {
		allow   : "*",
		require : [
			// "event_master",
			"transistor",
			"morph",
			"event",
			"listener",
			"body",
			"piero"
		]
	},

	make : function ( define ) {

		var button_body, event_circle

		
		button_body  = this.library.transistor.make(
			this.define_body( define )
		)
		event_circle = this.library.piero.make({
			state  : this.define_state({
				body : button_body,
				with : define 
			}),
			events : this.define_event({
				body : button_body,
			})
		})
		event_circle.add_listener(
			this.define_listener({
				body : button_body,
				with : define.with
			})
		)
		return this.define_interface({
			body         : button_body,
			event_master : event_circle
		})
	},

	define_interface : function ( define ) { 
		return { 
			body      : define.body.body,
			append    : define.body.append,
			get_state : function () { 
				return define.event_master.get_state()
			},
			set_state : function ( state ) { 
				define.event_master.set_state( state )
			},
			set_additional_button_text : function ( set ) { 

			}
		}
	},

	define_state : function ( define ) { 
		return this.library.event.define_state( define )
	},

	define_event : function ( define ) {
		return this.library.event.define_event( define )
	},

	define_listener : function ( define ) {
		return this.library.listener.define_listener( define )
	},

	define_body : function ( define ) {
		return this.library.body.define_body( define )
	}
})