define({
	
	define : {
		allow : "*",
		require : [
			"morph",
			"calendar_logic",
			"body",
			"transistor",
			"bodymap",
		]
	},

	toggle_calendar_and_say_if_its_open : function ( define ) {
		var calendar_is_showing = define.body.calendar.style.display === "block"
		define.body.calendar.style.display = (
			calendar_is_showing ? 
				"none" : 
				"block"
		)
		return ( calendar_is_showing === false )
	},

	fit_calendar_bellow_its_input : function ( define ) {
		define.body.calendar.style.left = define.body.input.offsetLeft + "px"
		define.body.calendar.style.top  = (
			define.body.input.offsetTop    +
			define.body.input.clientHeight
		) + "px"
	},

	find_and_return_selected_day_node : function ( define ) { 
		
		return this.library.morph.index_loop({
			subject : define.body.day_body.children,
			into    : {},
			else_do : function ( loop ) {
				if ( loop.indexed.getAttribute("class") === define.class_name.calendar_day_number_selected ) {
					return loop.indexed
				}
				return loop.into
			}
		})
	},

	replace_current_calendar : function ( define ) {

		var new_calendar_body, body

		body              = this.library.bodymap.make({
			body : define.body.node,
			map  : define.body.map.main
		})
		new_calendar_body = this.library.transistor.make( 
			this.library.body.define_calendar({
				class_name : define.class_name,
				with       : define.with,
				type       : "day",
				month      : define.date.get_month_map(),
				day        : define.date,
				show       : true
			})
		)

		body.main.removeChild( body.calendar )
		new_calendar_body.append( body.main )

		this.fit_calendar_bellow_its_input({
			body : this.library.bodymap.make({
				body : define.body.node,
				map  : define.body.map.main
			})
		})
	},

	make : function ( define ) { 
		var self = this
		return [
			{ 
				for       : "choose year",
				that_does : function ( heard ) {
					
					var new_year, calendar_body_parent

					new_year = self.library.calendar_logic.get_day({
						year  : heard.event.target.getAttribute("data-gregor-set-year"),
						month : heard.state.date_object.date.month.number - 1,
						day   : heard.state.date_object.date.day.number
					})

					self.replace_current_calendar({
						class_name : define.with.class_name,
						with       : heard.state.with,
						body       : heard.state.body,
						date       : new_year,
					})
					
					return heard
				}
			},
			{ 
				for       : "chose month",
				that_does : function ( heard ) {

					var new_month_number, number_of_days_in_next_month, next_month

					new_month_number             = heard.event.target.getAttribute("data-gregor-set-month")
					number_of_days_in_next_month = self.library.calendar_logic.get_day({
						year  : heard.state.date_object.date.year,
						month : new_month_number,
						day   : 1
					}).get_month_map().length
					next_month                   = self.library.calendar_logic.get_day({
						year  : heard.state.date_object.date.year,
						month : new_month_number,
						day   : ( 
							heard.state.date_object.date.day.number > number_of_days_in_next_month ?
								number_of_days_in_next_month : 
								heard.state.date_object.date.day.number
						)
					})

					self.replace_current_calendar({
						class_name : define.with.class_name,
						with       : heard.state.with,
						body       : heard.state.body,
						date       : next_month,
					})
					
					return heard
				}
			},
			{ 
				for       : "toggle calendar",
				that_does : function ( heard ) {

					var body, calendar_is_open

					body             = self.library.bodymap.make({
						body : heard.state.body.node,
						map  : heard.state.body.map.main
					})
					calendar_is_open = self.toggle_calendar_and_say_if_its_open({
						body : body
					})

					if ( calendar_is_open ) { 
						self.fit_calendar_bellow_its_input({
							body : body
						})	
					}

					return heard
				}
			},
			{
				for       : "chose date",
				that_does : function ( heard ){
					
					var body, calendar_body, date, selected_day_node

					body              = self.library.bodymap.make({
						body : heard.state.body.node,
						map  : heard.state.body.map.main
					})
					calendar_body     = self.library.bodymap.make({
						body : body.calendar,
						map  : heard.state.body.map.calendar
					})
					date              = self.library.calendar_logic.get_day({
						year  : heard.event.target.getAttribute("data-gregor-year"),
						month : parseInt(heard.event.target.getAttribute("data-gregor-month-number")) - 1,
						day   : heard.event.target.getAttribute("data-gregor-day-number"),
					})
					selected_day_node       = self.find_and_return_selected_day_node({
						class_name : define.class_name,
						body       : calendar_body
					})
					heard.state.date_object = date


					selected_day_node.setAttribute( 
						"class", 
						define.with.class_name.calendar_day_number 
					)

					heard.event.target.setAttribute( 
						"class", 
						define.with.class_name.calendar_day_number_selected 
					)

					self.toggle_calendar_and_say_if_its_open({
						body : body
					})
					
					body.input.textContent = date.date.day.number +" "+ date.date.month.name +" "+ date.date.year

					heard.event.target.setAttribute( "class", define.with.class_name.calendar_day_number_selected )


					return heard
				}
			},
			{ 
				for       : "open year select dropdown",
				that_does : function ( heard ) {
					
					var select_value_node
					select_value_node = heard.event.target
					
					if ( select_value_node.nextSibling.style.display === "none" ) { 
						select_value_node.nextSibling.style.display = "block"
					} else { 
						select_value_node.nextSibling.style.display = "none"
					}

					return heard
				}
			},
			{ 
				for       : "open month select dropdown",
				that_does : function ( heard ) {
					
					var select_value_node
					select_value_node = heard.event.target
					
					if ( select_value_node.nextSibling.style.display === "none" ) { 
						select_value_node.nextSibling.style.display = "block"
					} else { 
						select_value_node.nextSibling.style.display = "none"
					}

					return heard
				}
			},
			{ 
				for       : "open month choice",
				that_does : function ( heard ) {

					var option_state, calendar_body, calendar_body_parent

					option_state          = heard.state
					calendar_body         = option_state.calendar || option_state.body.get("gregor calendar")
					calendar_body_parent  = calendar_body.body.parentElement
					option_state.calendar = self.library.transistor.make( self.library.body.define_calendar({
						class_name : define.with.class_name,
						with       : heard.state.with,
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
				for       : "open year choice",
				that_does : function ( heard ) {

					var option_state, calendar_body, calendar_body_parent

					option_state          = heard.state
					calendar_body         = option_state.calendar || option_state.body.get("gregor calendar")
					calendar_body_parent  = calendar_body.body.parentElement
					option_state.calendar = self.library.transistor.make( self.library.body.define_calendar({
						class_name : define.with.class_name,
						with       : heard.state.with,
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
		]
	},
})