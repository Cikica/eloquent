# Morph

**Stateless Utility**

The purpose of morph is to provide a functional way to handle day to day tasks of programing such as 
iterating, comparing, removing and adding. All of this whilst being stateless.

### Methods

- [inject_array](#inject_array)
- [surject_array](#surject_array)
- [biject_array](#biject_array)
- [inject_object](#inject_object)
- [surject_object](#surject_object)
- [biject_object](#biject_object)
- [index_loop](#index_loop)
- [flatten_object](#flatten_object)
- [object_loop](#object_loop)
- [does_array_contain_this_value](#does_array_contain_this_value)
- [are_these_two_values_the_same](#are_these_two_values_the_same)
- [are_these_two_objects_the_same](#are_these_two_objects_the_same)
- [are_these_two_arrays_the_same](#are_these_two_arrays_the_same)
- [get_the_keys_of_an_object](#get_the_keys_of_an_object)
- [get_the_values_of_an_object](#get_the_values_of_an_object)
- [get_object_from_array](#get_object_from_array)
- [while_greater_than_zero](#while_greater_than_zero)
- [base_loop](#base_loop)
- [index_loop_base](#index_loop_base)
- [convert_node_list_to_array](#convert_node_list_to_array)
- [copy_value](#copy_value)
- [copy](#copy)
- [replace_with_default](#replace_with_default)
	

### inject_array

Insert members into an array and return result.

```javascript
inject_array({
	array : [],
	with  : [] || {} || function ( member ) {}
})
```

**Examples :**

```javascript
inject_array({
	array : [1,2,3,4],
	with  : [5,6,7,8]
})
// => [1,2,3,4,5,6,7,8]

inject_array({
	array : [1,2,3,4],
	with  : { s : "a", ss : "b", sss : "c" },
})
// => [1, 2, 3, 4, "a", "b", "c" ]

inject_array({
	array : [1,2,3,4],
	with  : function ( member ) { 
		return member * 2
	}
})
// => [ 1, 2, 3, 4, 2, 4, 6, 8]

inject_array({
	array : [1,2,3,4],
	with  : function ( member ) { 
		if ( member % 2 === 0 ) {
			return member * 2
		} else {
			return false
		}
	}
}) 
// => [1,2,3,4,4,8]
```

### surject_array

Remove members of an array and return leftovers.

```javascript
surject_array({
	array : [],
	with  : [],
	by    : "value" || "index"
})
```

**Examples :**

```javascript
surject_array({
	array : [1,2,3,4], 
	with  : [2,4]
}) 
// => [1,3]

surject_array({
	array : [{ s : 1 }, 2, { d : 2 }, 4],
	with  : [0,2],
	by    : "index"
})
// => [2,4]

surject_array({
	array : [{ s : 1 }, 2, { d : 2 }, 4],
	with  : [{ s : 1 }, { d : 2 }]
})
// => [2,4]
```

### biject_array

One to one map of array.

```javascript
biject_array({
	array : [],
	with  : function ( loop ) {
		// loop =>
		// {
		// 	index   : Number,
		// 	indexed : Array Value
		// }
	}
})
```
**Examples :**

```javascript
biject_array({
	array : [1,2,3,4,5,6],
	with  : function ( loop ) { 
		return loop.index+loop.indexed
	}
})
// => [1,3,5,7,9,11]
```

### inject_object

Insert members into object and return result.

```javascript
inject_object({
	object : {},
	with   : {} || []
})
```

**Examples :**

```javascript
inject_object({
	object : { 
		s : "some",
		d : "some other"
	},
	with : { 
		c : "another some"
	}
}) 
// => {
//	s : "some",
//	d : "some other",
//	c : "another some"
// }

inject_object({
	object : { 
		a : "some",
		b : "some other"
	},
	with : ["a", "b", "c"]
}) 
// => {
// 	"a" : "some",
// 	"b" : "some other",
// 	"0" : "a",
// 	"1" : "b",
// 	"2" : "c"
// }
```

### surject_object

Remove members of an object and return result.

```javascript
surject_object({
	object : {},
	with   : {} || []
	by     : "value" || "key"
})
```

**Examples**

```javascript
surject_object({
	object : { 
		"some"    : "name",
		"another" : "value"
	},
	with   : ["some"],
	by     : "key"
}) 
// => { "another" : "value" }

surject_object({
	object : { 
		"some"     : "name", 
		"another"  : "value",
		"another2" : "values",
	},
	with   : ["name", "values"],
	by     : "value"

})
// => { "another" : "value" }
```

### biject_object

One to one maping of an object.

```javascript
surject_object({
	object : {},
	with   : function ( loop ) {
		// console.log( loop ) =>
		// {
		// 	index : Number,
		// 	into  : { 
		// 		key   : Boolean || Array,
		// 		value : Boolean || Array
		// 	},
		// 	key   : Value,
		// 	value : Value
		// }
	}
})
```

**Examples**

```javascript
biject_object({
	object : {
		"some"    : "here",
		"another" : "over there",
	},
	with   : function ( loop ) {
		return { 
			key   : loop.key   +"some",
			value : loop.value +"some",
		}
	}
})
// => {
// 	"somesome"    : "heresome",
// 	"anothersome" : "over theresome",
// }

biject_object({
	object : {
		"some"    : "here",
		"another" : "over there",
	},
	with   : function ( loop ) {
		return { 
			value : loop.value +"some",
		}
	}
})

// => {
// 	"some"    : "heresome",
// 	"another" : "over theresome",
// }

biject_object({
	object : {
		"some"    : "here",
		"another" : "over there",
	},
	with   : function ( loop ) {
		return { 
			key : loop.key + "some"
		}
	}
})

// => {
// 	"somesome"    : "here",
// 	"anothersome" : "over there",
// }
```