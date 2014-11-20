define({

	define : {
		allow   : "*",
		require : [
			"morph",
			"transistor"
		],
	},

	make : function ( define ) {
		
		var text_body
		text_body = this.library.transistor.make(
			this.define_body( define )
		)
		return {
			body   : text_body.body,
			append : text_body.append
		}
	},

	define_body : function ( define ) {
		return {
			"class" : define.class_name.wrap,
			"child" : this.library.morph.index_loop({ 
				subject : [].concat( define.with.content ),
				else_do : function ( loop ) {
					var type = loop.indexed.type || "regular"
					return loop.into.concat({
						"class" : define.class_name[type],
						"text"  : loop.indexed.text
					})
				}
			})
		}
	},
})