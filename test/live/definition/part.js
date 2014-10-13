define({
	append_to : document.body,
	part      : [
		{
			type : "radio",
			name : "Radio First",
			with : {
				option : {
					choice : [
						"Yes",
						"No",
						"Some"
					]
				}
			}
		},
		{ 
			type : "select",
			name : "First drop",
			with : {
				option : {
					choice : [
						"somesome",
						"Some",
						"some some",
					],
					default_value : "Some",
					mark          : { 
						open   : "+",
						closed : "-"
					}
				}
			}
		},
		{
			type : "input",
			name : "First input",
			with : { 
				verify      : {
					when : function ( value ) {
						return ( value.length > 5 )
					},
					with : function ( value ) {
						return { 
							is_valid : true,
							text     : "sall good"
						}
					},
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
					when : function ( value ) {
						return ( value.length > 5 )
					},
					with : function ( value ) {
						return { 
							is_valid : true,
							text     : "sall good"
						}
					},
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
})