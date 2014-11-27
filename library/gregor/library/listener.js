define({
	
	define : {
		allow : "*",
		require : [
			"morph",
			"calendar_logic",
			"body",
			"transistor",
		]
	},

	make : function ( define ) { 
		var self = this
		return [
			{ 
				for       : "gregor open month choice",
				that_does : function ( heard ) {

					var option_state, calendar_body, calendar_body_parent

					option_state          = heard.state
					calendar_body         = option_state.calendar || option_state.body.get("gregor calendar")
					calendar_body_parent  = calendar_body.body.parentElement
					option_state.calendar = self.library.transistor.make( self.library.body.define_calendar({
						class_name : define.with.class_name,
						with       : {},
						type       : "month",
						show       : true,
						month      : option_state.date_object.get_month_map(),
						day        : option_state.date_object
					}))
					calendar_body_parent.removeChild( calendar_body.body )
					option_state.calendar.append( calendar_body_parent )

					return heard
				}
			},
			{ 
				for       : "gregor open year choice",
				that_does : function ( heard ) {

					var option_state, calendar_body, calendar_body_parent

					option_state         = heard.state
					calendar_body        = option_state.calendar || option_state.body.get("gregor calendar")
					calendar_body_parent = calendar_body.body.parentElement
					option_state.calendar = self.library.transistor.make( self.library.body.define_calendar({
						class_name : define.with.class_name,
						with       : {},
						type       : "year",
						show       : true,
						month      : option_state.date_object.get_month_map(),
						day        : option_state.date_object
					}))
					calendar_body_parent.removeChild( calendar_body.body )
					option_state.calendar.append( calendar_body_parent )

					return heard
				}
			},
			{ 
				for       : "gregor choose year",
				that_does : function ( heard ) {
					
					var option_state, calendar_body, new_year, calendar_body_parent

					option_state         = heard.state
					calendar_body        = option_state.calendar || option_state.body.get("gregor calendar")
					calendar_body_parent = calendar_body.body.parentElement
					new_year             = self.library.calendar_logic.get_day({
						year  : heard.event.target.getAttribute("data-gregor-set-year"),
						month : option_state.date_object.date.month.number,
						day   : option_state.date_object.date.day.number
					})
					option_state.calendar = self.library.transistor.make( self.library.body.define_calendar({
						class_name : define.with.class_name,
						with       : {},
						type       : "day",
						show       : true,
						month      : new_year.get_month_map(),
						day        : new_year
					}))
					option_state.date_object = new_year
					calendar_body_parent.removeChild( calendar_body.body )
					option_state.calendar.append( calendar_body_parent )
					
					return heard
				}
			},
			{ 
				for       : "gregor chose month",
				that_does : function ( heard ) {

					var option_state, calendar_body, calendar_body_parent, next_month
					
					option_state          = heard.state
					new_month             = self.library.calendar_logic.get_day({
						year  : option_state.date_object.date.year,
						month : heard.event.target.getAttribute("data-gregor-set-month"),
						day   : 1
					})

					calendar_body         = option_state.calendar || option_state.body.get("gregor calendar")
					calendar_body_parent  = calendar_body.body.parentElement
					option_state.calendar = self.library.transistor.make( self.library.body.define_calendar({
						class_name : define.with.class_name,
						with       : {},
						type       : "day",
						month      : new_month.get_month_map(),
						day        : new_month
					}))

					option_state.calendar.body.style.display = "block"
					option_state.date_object                 = new_month
					option_state.selected                    = false

					calendar_body_parent.removeChild( calendar_body.body )
					option_state.calendar.append( calendar_body_parent )
					
					return heard
				}
			},
			{ 
				for       : "gregor toggle calendar",
				that_does : function ( heard ) {
					
					var option_state, calendar_body

					option_state                     = heard.state
					calendar_body                    = option_state.calendar || option_state.body.get("gregor calendar")
					calendar_body.body.style.display = (
						calendar_body.body.style.display === "block" ?
							"none" : "block"
					)
					return heard
				}
			},
			{
				for       : "gregor chose date",
				that_does : function ( heard ){
					
					var date, option_state, text_body, previous_date_body, calendar_body

					option_state       = heard.state
					calendar_body      = option_state.calendar || option_state.body.get("gregor calendar")
					text_body          = option_state.body.get("gregor text").body
					previous_date_body = ( option_state.selected ?
						option_state.selected :
						calendar_body.get("gregor current date").body
					)
					date               = self.library.calendar_logic.get_day({
						year  : heard.event.target.getAttribute("data-gregor-year"),
						month : parseInt( 
							heard.event.target.getAttribute("data-gregor-month-number") 
						) - 1,
						day   : heard.event.target.getAttribute("data-gregor-day-number"),
					})

					previous_date_body.setAttribute( "class", define.with.class_name.calendar_day_number )

					option_state.selected            = heard.event.target
					option_state.date_object         = date
					text_body.textContent            = date.date.day.number +" "+ date.date.month.name +" "+ date.date.year
					calendar_body.body.style.display = "none"

					heard.event.target.setAttribute( "class", define.with.class_name.calendar_day_number_selected )

					return heard
				}
			}
		]
	},
})