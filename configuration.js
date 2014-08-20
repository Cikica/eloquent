define({
	// style: "",
	name    : "eloquent",
	main    : "eloquent",
	start   : { 
		test : {
			with : {
				append_to  : document.body,
				class_name : {
					wrap : "wrap_main",
					text : {
						"wrap"      : "wrap_text",
						"regular"   : "regular_text",
						"imporant"  : "imporant_text",
						"underline" : "imporant_text",
						"italic"    : "italic_text",
					},
					list : { 
						"wrap"           : "wrap_list",
						"item_wrap"      : "wrap_list_item",
						"item_notation"  : "list_item_notation",
						"item_text_wrap" : "list_item_text_wrap",
						"item_text"      : "list_item_text",
						"item_list"      : "list_item_list",
					},
					input : {
						"wrap"  : "wrap_input",
						"text"  : "input_text",
						"small" : "input_small",
						"large" : "input_large"
					}
				},
				part : [
					{
						type : "input",
						name : "First input",
						with : { 
							verify      : {
								when : function () {
									return 1
								},
								with : function () {},
							},
							size        : "large",
							value       : "some",
							placeholder : "This be the place"
						},
					},
					{
						type : "input",
						name : "second input",
						with : { 
							verify      : {
								when : function () {
									return 2
								},
								with : function () {},
							},
						},
					},
					{
						type : "list",
						with : {
							notation : "-",
							list     : [
								"some item",
								"another item",
								{
									text : "Third Item",
									list : [
										"item comes here",
										"another",
									]
								},
								"fourth item"
							],
						}
					},
					{
						type : "text",
						with : {
							content : [
								{
									text : "One",
								},
								{ 
									type : "underline",
									text : "Two",
								},
								{ 
									type : "italic",
									text : "Three",
								}
							]
						},
					}
				]	
			}
		}
	},
	module  : [
		"library/event_master",
		"library/morphism",
	],
	package : [
		"library/morph",
		"library/transistor",
		"library/text",
		"library/list",
		"library/shumput",
		"library/dropdown",
		"library/keyswitch",
	]
})