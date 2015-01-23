define({
	name    : "gregor",
	main    : "gregor",
	start   : { 
		test : { 
			with : {}
		}
	},
	module  : [
		"library/calendar_logic",
		"library/body",
		"library/event",
		"library/listener",
		"library/bodymap",
	],
	package : [
		"library/morph",
		"library/transistor",
	]
})