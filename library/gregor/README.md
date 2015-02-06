Gregor
======

A calendar ui component, based on the gregorian calendar, and aptly named as such.

Syntax :
```
{
	month : {
		type : "dropdown" && "choice"
	},
	year : { 
		type : "dropdown" && "choice"
	},
	input : { 
		text : String
	},
	get : { 
		with : function ( state ) {
			return {
				value : Infinity
			}
		}
	}
}
```