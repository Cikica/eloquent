define({

	define : {
		allow   : "*",
		require : [
			"transistor",
			"morph",
			"event_master"
		]
	},

	make : function ( define ) {

		var button_body, event_circle

		
		button_body  = this.library.transistor.make(
			this.define_body( define )
		)
		event_circle = this.library.event_master.make({
			state  : this.define_state( define ),
			events : this.define_event({
				body : button_body,
			})
		})
		event_circle.add_listener(
			this.define_listener({
				body : button_body,
				with : define
			})
		)
		return this.define_interface({
			body : button_body
		})
	},

	define_interface : function ( define ) { 
		return { 
			body   : define.body.body,
			append : define.body.append
		}
	},

	define_state : function ( define ) { 
		return { 

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
				only_if : function ( heard ) { 
					return true
				}
			}
		]
	},

	define_listener : function ( define ) {
		return [
			{ 
				for       : "click",
				that_does : function ( heard ) {
					console.log( "click me baby" )
					return heard
				}
			}
		]
	},

	define_body : function ( define ) {
		console.log( define )
		return {
			"class" : define.class_name.wrap,
			"child" : [
				{ 
					"class" : define.class_name.body,
					"text"  : define.with.content.text
				}
			]
		}
	}
})