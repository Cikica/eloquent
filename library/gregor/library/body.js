define({
	define : {
		allow   : "*",
		require : [
			"morph",
			"calendar_logic"
		]
	},
	
	make : function ( define ) {

		return { 
			"class"   : define.class_name.wrap,
			"mark_as" : "gregor",
			"child"   : [
				{
					"class" : define.class_name.set_wrap,
					"child" : [
						{ 
							"class"                : define.class_name.set_button,
							"data-gregor-set-date" : define.name,
							"text"                 : define.with.input.text
						},
						{
							"class"   : define.class_name.set_date,
							"mark_as" : "gregor text",
							"text"    : this.library.calendar_logic.define_date_format( this.library.calendar_logic.get_current_day_map() )
						}

					]
				}
			].concat( this.define_calendar({
				class_name : define.class_name,
				with       : define.with,
				type       : "year",
				month      : this.library.calendar_logic.get_current_month_map()
			}))
		}
	},

	define_calendar : function ( define ) {
		return {
			// "display" : "none",
			"class"   : define.class_name.calendar,
			"mark_as" : "gregor calendar",
			"child"   : this.define_calendar_body( define )
		}
	},

	define_calendar_body : function ( define ) {

		var self, current, calendar_content

		self             = this
		current          = define.day || this.library.calendar_logic.get_day()
		calendar_content = []
		if ( define.type === "day" ) {
			calendar_content = this.define_calendar_day_body( define )
		}
		if ( define.type === "year" ) { 
			calendar_content = this.define_calendar_year_body( define )
		}

		return [
			{
				"class" : define.class_name.calendar_part,
				"child" : [
					{
						"class" : define.class_name.date_month_wrap,
						"child" : [
							{ 
								"class"                : define.class_name.date_month_text,
								"data-gregor-set-year" : current.date.year,
								"text"                 : current.date.year
							},
						]
					},
					{
						"class" : define.class_name.date_month_wrap,
						"child" : [
							{ 
								"class"                 : define.class_name.date_month_text,
								"text"                  : current.previous_month().date.month.name,
								"data-gregor-set-month" : current.previous_month().date.month.number-1,
							},
							{
								"class" : define.class_name.date_current_month_text,
								"text"  : current.date.month.name,
							},
							{
								"class"                 : define.class_name.date_month_text,
								"text"                  : current.next_month().date.month.name,
								"data-gregor-set-month" : current.next_month().date.month.number-1,
							}
						]
					}
				]
			},
			{
				"class"   : "",
				"mark_as" : "gregor calendar content",
				"child"   : calendar_content
			},
		]
	},

	define_calendar_day_body : function ( define ) { 
		var current, self
		self    = this
		current = define.day || this.library.calendar_logic.get_day()
		return [
			{ 
				"class" : define.class_name.calendar_part,
				"child" : this.library.morph.index_loop({
					subject : ["MO","TU","WE","TH","FR","SA","SU"],
					else_do : function ( loop ) { 
						return loop.into.concat({
							"class" : define.class_name.calendar_day_name,
							"text"  : loop.indexed
						})
					}
				})
			},
			{
				"class" : define.class_name.calendar_part,
				"child" : this.library.morph.index_loop({
					subject : define.month,
					else_do : function ( loop ) {
						var definition
						definition = {
							"class"             : ( 
								current.date.day.number === loop.indexed.day.number ? 
									define.class_name.calendar_day_number_selected :
									define.class_name.calendar_day_number
							),
							"text"                     : loop.indexed.day.number,
							"data-gregor-day-name"     : loop.indexed.day.name,
							"data-gregor-day-number"   : loop.indexed.day.number,
							"data-gregor-month"        : loop.indexed.month.name,
							"data-gregor-month-number" : loop.indexed.month.number,
							"data-gregor-year"         : loop.indexed.year
						}

						if ( current.date.day.number === loop.indexed.day.number ) { 
							definition["mark_as"] = "gregor current date"
						}

						if ( loop.index === 0 ) {
							loop.into = loop.into.concat( self.library.morph.while_greater_than_zero({
								count   : ( 6 - ( 7 - loop.indexed.day.week_day_number ) % 7 ),
								into    : [],
								else_do : function ( while_loop ) {
									return while_loop.into.concat({
										"class"      : define.class_name.calendar_day_number,
										"visibility" : "hidden",
										"text"       : "."
									})
								}
							}))
						}

						if ( loop.indexed.day.week_day_number === 1 ) { 
							loop.into = loop.into.concat({
								"class" : define.class_name.calendar_day_seperator
							})
						}

						return loop.into.concat( definition )
					}
				})
			}
		]
	},

	define_calendar_year_body : function ( define ) { 
		return [
			{
				"class" : define.class_name.calendar_part,
				"child" : this.library.morph.index_loop({
					subject : [2011, 2012, 2013, 2014, 2015, 2016, 2017],
					else_do : function ( loop ) { 
						return loop.into.concat({
							"class"                    : define.class_name.calendar_year_text,
							"data-gregor-choosen-year" : loop.indexed,
							"text"                     : loop.indexed
						})
					}
				})
			}
		]
	},
})