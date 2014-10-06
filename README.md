Eloquent
========

Get some eloquence boy!

Package for returnign lists of definitions, inputs, textareas, and various other things youd use in forms, for 
creation and appension. 

Consider it a conflux of all the smaller packages for option. In other words the option package. 

**Radio**
```javascript
{ 
	"type" : "radio",
	"with" :  {
		"option" : { 
			"value"  : String,
			"choice" : Array of String
		},
		"input" : { 
			"show_on"     : String,
			"size"        : "small|large",
			"placeholder" : String,
			"value"       : String,
			"verify"  : { 
				"when" : function () {},
				"with" : function () {}
			}
		}
	}
}
```