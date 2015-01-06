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
							"class"                : define.class_name.set_date,
							"data-gregor-set-date" : define.name,
							"mark_as"              : "gregor text",
							"text"                 : this.library.calendar_logic.define_date_format( this.library.calendar_logic.get_current_day_map() )
						}

					]
				}
			].concat( this.define_calendar({
				class_name : define.class_name,
				with       : define.with,
				type       : "day",
				show       : false,
				month      : this.library.calendar_logic.get_current_month_map()
			}))
		}
	},

	define_calendar : function ( define ) {
		return {
			"display" : ( define.show ? "block" : "none" ),
			"class"   : define.class_name.calendar,
			"mark_as" : "gregor calendar",
			"child"   : this.define_calendar_body( define )
		}
	},

	define_calendar_body : function ( define ) {

		var self, current, calendar_content, control_content

		self             = this
		current          = define.day || this.library.calendar_logic.get_day()
		control_content  = []
		calendar_content = []

		if ( define.type === "day" ) {
			calendar_content = this.define_calendar_day_body( define )
		}
		if ( define.type === "year" ) { 
			calendar_content = this.define_calendar_year_body( define )
		}
		if ( define.type === "month" ) { 
			calendar_content = this.define_calendar_month_body( define )
		}

		if ( define.with.year && define.with.year.type === "dropdown" ) {
			control_content = control_content.concat(self.define_control_year_by_dropdown({
				class_name : define.class_name,
				current    : current
			}))
		} else { 
			control_content = control_content.concat(self.define_control_year_by_button({
				class_name : define.class_name,
				current    : current
			}))
		}

		if ( define.with.month && define.with.month.type === "dropdown" ) {
			control_content = control_content.concat(self.define_control_month_by_dropdown({
				class_name : define.class_name,
				current    : current
			}))
		} else { 
			control_content = control_content.concat(self.define_control_month_by_button({
				class_name : define.class_name,
				current    : current,
			}))
		}

		return [
			{
				"class" : define.class_name.calendar_part,
				"child" : control_content
			},
			{
				"class"   : "",
				"mark_as" : "gregor calendar content",
				"child"   : calendar_content
			},
		]

		return body_definition
	},

	define_control_year_by_dropdown : function ( define ) { 
		var current, self
		self    = this
		current = this.library.calendar_logic.get_day()
		return { 
			"class" : define.class_name.calendar_year_dropdown_wrap,
			"child" : [ 
				{ 
					"class"                          : define.class_name.calendar_year_dropdown_value,
					"text"                           : define.current.date.year,
					"data-gregor-open-year-dropdown" : "true",
				},
				{ 
					"class"   : define.class_name.calendar_year_dropdown_option_wrap,
					"display" : "none",
					"child"   :  self.library.morph.index_loop({
						subject : this.create_range_of_years_before_and_after_given_year({
							year       : current.date.year,
							range_size : 12
						}),
						else_do : function ( loop ) { 
							return loop.into.concat({
								"class"                : define.class_name.calendar_year_dropdown_option,
								"text"                 : loop.indexed,
								"data-gregor-set-year" : loop.indexed,
							})	
						}
					})
				}
			]
		}
	},

	define_control_year_by_button : function ( define ) { 
		return {
			"class" : define.class_name.date_month_wrap,
			"child" : [
				{ 
					"class"                   : define.class_name.date_month_text,
					"data-gregor-choose-year" : define.current.date.year,
					"text"                    : define.current.date.year
				},
			]
		}
	},

	define_control_month_by_dropdown : function ( define ) {
		var self = this
		return { 
			"class" : define.class_name.calendar_month_dropdown_wrap,
			"child" : [ 
				{ 
					"class"                           : define.class_name.calendar_month_dropdown_value,
					"text"                            : define.current.date.month.name,
					"data-gregor-open-month-dropdown" : "true",
				},
				{ 
					"class"   : define.class_name.calendar_month_dropdown_option_wrap,
					"display" : "none",
					"child"   : self.library.morph.index_loop({
						subject : [
							"January",
							"February",
							"March",
							"April",
							"May",
							"June",
							"July",
							"August",
							"September",
							"October",
							"November",
							"December"
						],
						else_do : function ( loop ) {
							return loop.into.concat({
								"class"                 : define.class_name.calendar_month_dropdown_option,
								"text"                  : loop.indexed,
								"data-gregor-set-month" : loop.index,
							})
						}
					})
				}
			]
		}
	},

	define_control_month_by_button : function ( define ) { 
		return {
			"class" : define.class_name.date_month_wrap,
			"child" : [
				{ 
					"class"                 : define.class_name.date_month_text,
					"text"                  : define.current.previous_month().date.month.name,
					"data-gregor-set-month" : define.current.previous_month().date.month.number-1,
				},
				{
					"class"                    : define.class_name.date_current_month_text,
					"data-gregor-choose-month" : define.current.date.month.name,
					"text"                     : define.current.date.month.name,
				},
				{
					"class"                 : define.class_name.date_month_text,
					"text"                  : define.current.next_month().date.month.name,
					"data-gregor-set-month" : define.current.next_month().date.month.number-1,
				}
			]
		}
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

		var current_year
		current_year = define.month[0].year
		return [
			{
				"class" : define.class_name.calendar_part,
				"child" : this.library.morph.index_loop({
					subject : this.create_range_of_years_before_and_after_given_year({
						year : current_year,
						range_size : 30
					}),
					else_do : function ( loop ) { 
						return loop.into.concat({
							"class"                : (
								current_year === loop.indexed ?
									define.class_name.calendar_year_text_selected :
									define.class_name.calendar_year_text
							),
							"data-gregor-set-year" : loop.indexed,
							"text"                 : loop.indexed
						})
					}
				})
			}
		]
	},

	define_calendar_month_body : function ( define ) {

		return [
			{
				"class" : define.class_name.calendar_part,
				"child" : this.library.morph.index_loop({
					subject : [
						"January",
						"February",
						"March",
						"April",
						"May",
						"June",
						"July",
						"August",
						"September",
						"October",
						"November",
						"December"
					],
					else_do : function ( loop ) {
						return loop.into.concat({
							"class"                 : (
							loop.index+1 === define.month[0].month.number ?
								define.class_name.calendar_month_text_selected :
								define.class_name.calendar_month_text
							),
							"data-gregor-set-month" : loop.index,
							"text"                  : loop.indexed
						})
					}
				})
			}
		]
	},

	create_range_of_years_before_and_after_given_year : function ( define ) {

		return this.library.morph.while_greater_than_zero({
			count   : define.range_size,
			into    : [],
			if_done : function ( result ) {
				return result.sort()
			},
			else_do : function ( loop ) {
				return loop.into.concat(( 
					loop.count < define.range_size/2 ? 
						define.year + ( define.range_size/2 - loop.count ): 
						define.year - ( define.range_size - loop.count )
				))
			}
		})
	}
})