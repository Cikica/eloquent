define({
	name    : "eloquent",
	main    : "eloquent",
	start   : {
		global : true,
		with   : {
			test : [
				"test/live/definition/class_name",
				"test/live/definition/part"
			]
		}
	},
	module  : [
		"library/event_master",
		"library/morphism",
	],
	package : [
		"library/tree_option",
		"library/morph",
		"library/transistor",
		"library/text",
		"library/list",
		"library/shumput",
		"library/dropdown",
		"library/keyswitch",
		"library/button",
		"library/gregor",
		"library/tabular",
	]
})