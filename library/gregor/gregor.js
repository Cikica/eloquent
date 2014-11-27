define({

	define : {
		allow   : "*",
		require : [
			"morph",
			"transistor",
			"calendar_logic",
			"body",
			"event",
			"listener",
			"event_master"
		]
	},

	make : function ( define ) {
		
		var gregor_body, event_circle
		gregor_body = this.library.transistor.make(
			this.define_body(
				define
			)
		)
		event_circle = this.library.event_master.make({
			state  : this.define_state({
				body : gregor_body,
				with : define
			}),
			events : this.define_event({
				body : gregor_body,
				with : define
			})
		})
		event_circle.add_listener(
			this.define_listener({
				body : gregor_body,
				with : define
			})
		)

		return this.define_interface({
			body              : gregor_body,
			event_master      : event_circle,
			with              : define.with
		})
	},

	define_interface : function ( define ) {
		return { 
			body      : define.body.body,
			get_state : function () {
				
				var state
				state = define.event_master.get_state()

				if ( define.with.get ) { 
					return define.with.get.with.call({}, state )
				}

				return state

			},
			append : function ( to_what ) { 
				define.body.append( to_what ) 
			}
		}
	},

	define_state : function ( define ) {
		return this.library.event.define_state( define )
	},
	
	define_event : function ( define ) { 
		return this.library.event.make( define )
	},

	define_listener : function ( define ) { 
		return this.library.listener.make( define )
	},

	define_body : function ( define ) { 
		return this.library.body.make( define )
	}
})