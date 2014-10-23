define({
	append_to : document.body,
	part      : [
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
		},
		{
			type : "list",
			with : {
				notation : "*",
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
			type : "radio",
			name : "Some some",
			with : {
				option : {
					choice : [
						"Yes",
						"No",
						"Maybe"
					]
				},
				input : {
					show_on : "Yes",
					with    : { 
						placeholder : "some some",
						value       : "some some",
						verify      : {
						    when : function ( value ) {
						        return ( value.length > 3 )
						    },
						    with : function ( value ) {
						        return {
						            is_valid : false,
						            text     : "Text check yo"
						        }
						    },
						}
					}
				}
			}
		},
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
			type : "radio",
			name : "Radio First",
			with : {
				option : {
					choice : [
						"Somee",
						"Some"
					]
				}
			}
		},
		{
			type        : "input",
			name        : "second input",
			with : { 
				placeholder : "This be the place",
				value       : "Some somesome",
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
			type : "input",
			name : "First input",
			with : { 
				size        : "large",
				value       : "some",
				verify      : {
					when : function ( value ) {
						return ( value.length > 5 )
					},
					with : function ( value ) {
						return { 
							is_valid : false,
							text     : "Snot good yal"
						}
					},
				},
			},
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
		}
	]
})