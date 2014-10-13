var eloquent
eloquent                           = window.main
eloquent.library                   = {
	"morph" : window.morph,
	"one"   : {
		define_event : function () { 
			return [
				{
					called : "reset",
					some   : "2"
				},
				{
					called : "touch",
					some   : "3"
				}
			]
		}
	},
	"two" : {
		define_event : function () { 
			return [
				{
					called : "reset",
					some   : "4"
				},
				{
					called : "ll",
					some   : "5"
				}
			]
		}
	},
}
eloquent.part_name_to_package_name = { 
	"first"  : "one",
	"second" : "two"
}

describe("define event definition map", function() {
	it("does just that", function() {
		expect(eloquent.define_event_definition_map({
			with : {}
		})).toEqual({
			one : { 
				"reset" : {
					called : "one reset",
					some   : "2"
				},
				"touch" : {
					called : "one touch",
					some   : "3"
				}
			},
			two : { 
				"reset" : {
					called : "two reset",
					some   : "4"
				},
				"ll" : {
					called : "two ll",
					some   : "5"
				}
			},
		})
	})
})