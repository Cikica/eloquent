define({

	define : {
		allow   : "*",
		require : [
			"morph"
		]
	},

	make : function () {
		console.log( this.get_current_month_map() )
		console.log("entrude young messenger")
	},

	define_state : function ( define ) {
		return {
			body : define.body.get("gregor "+ define.for ),
			map  : {},
			date : this.get_current_day_map()
		}
	},
	
	define_event : function ( define ) { 
		var self = this
		return [
			{ 
				called       : "gregor toggle calendar",
				that_happens : [
					{ 
						on : define.with.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) { 
					return ( heard.event.target.hasAttribute("data-gregor-set-date") )
				}
			},
			{
				called       : "gregor chose date",
				that_happens : [
					{ 
						on : define.with.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) { 
					return ( heard.event.target.hasAttribute("data-gregor-date") )
				}
			}
		]
	},

	define_listener : function ( define ) { 
		return [ 
			{ 
				for       : "gregor toggle calendar",
				that_does : function ( heard ) {
					var option_state, name, calendar_body
					name                        = heard.event.target.getAttribute("data-gregor-set-date")
					option_state                = heard.state.option[name]
					calendar_body               = option_state.body.get("gregor calendar "+ name ).body
					calendar_body.style.display = (
						calendar_body.style.display === "block" ?
							"none" : "block"
					)
					return heard
				}
			},
			{
				for       : "gregor chose date",
				that_does : function ( heard ){
					var date, name, option_state, text_body
					name         = heard.event.target.getAttribute("data-gregor-name")
					option_state = heard.state.option[name]
					text_body    = option_state.body.get("gregor text "+ name).body
					date         = {
						day   : heard.event.target.getAttribute("data-gregor-date"),
						month : heard.event.target.getAttribute("data-gregor-month"),
						year  : heard.event.target.getAttribute("data-gregor-year"),
					}
					if ( option_state.selected ) { 
						option_state.selected.setAttribute("class", "package_main_calendar_day_number")
					}
					option_state.selected = heard.event.target
					text_body.textContent = date.day +" "+ date.month +" "+ date.year
					heard.event.target.setAttribute("class", "package_main_calendar_day_number_selected")
					return heard
				}
			}
		]
	},

	define_body : function ( define ) {
		return { 
			"class"   : define.class_name.wrap,
			"mark_as" : "gregor "+ define.name,
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
							"mark_as" : "gregor text "+ define.name,
							"text"    : this.define_date_format( this.get_current_day_map() )
						}

					]
				}
			].concat( this.define_calendar({
				class_name : define,
				name       : define.name,
				with       : define.with,
				month      : this.get_current_month_map()
			}))
		}
	},

	define_calendar : function ( define ) {
		var self = this
		return {
			"class"   : "package_main_calendar_wrap",
			"display" : "block",
			"mark_as" : "gregor calendar "+ define.name,
			"child"   : [
				{
					"class" : "package_main_regular_wrap",
					"child" : [
						{
							"class" : "package_main_quarter_wrap",
							"text"  : "2014"
						},
						{
							"class" : "package_main_three_quarter_wrap",
							"child" : [
								{ 
									"class" : "package_main_quarter_wrap",
									"text"  : "July"
								},
								{
									"class" : "package_main_quarter_wrap",
									"text"  : "September"
								}
							]
						},
					]
				},
				{ 
					"class" : "package_main_regular_wrap",
					"child" : this.library.morph.index_loop({
						subject : ["MO","TU","WE","TH","FR","SA","SU"],
						else_do : function ( loop ) { 
							return loop.into.concat({
								"class" : "package_main_calendar_day_name",
								"text"  : loop.indexed
							})
						}
					})
				},
				{
					"class" : "package_main_regular_wrap",
					"child" : this.library.morph.index_loop({
						subject : define.month,
						else_do : function ( loop ) {
							if ( loop.index === 0 ) { 
								loop.into = loop.into.concat( self.library.morph.while_greater_than_zero({
									count   : ( 7 - ( 7 - loop.indexed.day.week_day_number ) - 1 ),
									into    : [],
									else_do : function ( while_loop ) {
										return while_loop.into.concat({
											"class"      : "package_main_calendar_day_number",
											"visibility" : "hidden",
											"text"       : "."
										})
									}
								}))
							}

							if ( loop.indexed.day.week_day_number === 1 ) { 
								loop.into = loop.into.concat({
									"class" : "package_main_calendar_day_seperator",
								})
							}

							return loop.into.concat({
								"class"             : "package_main_calendar_day_number",
								"text"              : loop.indexed.day.number,
								"data-gregor-name"  : define.name,
								"data-gregor-date"  : loop.indexed.day.number,
								"data-gregor-month" : loop.indexed.month.name,
								"data-gregor-year"  : loop.indexed.year
							})
						}
					})
				}
			]
		}
	},

	define_date_format : function ( date ) {
		return date.month.number +" "+ date.month.name +" "+ date.year
	},

	get_current_day_map : function () {
		return this.get_day_map_for( new Date() )
	},

	get_current_month_map : function () { 
		return this.get_month_day_map_for( new Date() )
	},

	get_month_day_map_for : function ( what ) {
		var self = this
		what = ( what.constructor === Date ? { year : what.getFullYear(), month : what.getMonth() } : what )
		return this.library.morph.while_greater_than_zero({
			count   : this.get_number_of_days_for( what ),
			into    : [],
			if_done : function ( result ) { 
				return result.reverse()
			},
			else_do : function ( loop ) {
				return loop.into.concat(self.get_day_map_for({
					year  : what.year,
					month : what.month,
					day   : loop.count
				}))
			}
		})
	},

	get_day_map_for : function ( what ) {
		var date = ( what.constructor === Date ? what : new Date( what.year, what.month, what.day ) )
		return { 
			year   : date.getFullYear(),
			month  : {
				name   : this.get_month_name_from_number( date.getMonth() ),
				number : date.getMonth() + 1
			},
			day    : { 
				name            : this.get_day_name_from_number( date.getDay() ),
				week_day_number : date.getDay(),
				number          : date.getDate()
			}
		}
	},

	get_day_name_from_number : function ( day_number ) { 
		var day_name = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday"
		]
		return day_name[day_number]
	},

	get_month_name_from_number : function ( month_number ) { 
		var month_name = [
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
			"December",
		]
		return month_name[month_number]
	},

	get_number_of_days_for : function ( what ) { 
		return ( 32 - new Date( what.year, what.month, 32 ).getDate() )
	}
})