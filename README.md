```
_|_|_|    _|_|_|  _|_|_|_|  
  _|    _|        _|        
  _|    _|        _|_|_|    
  _|    _|        _|        
_|_|_|    _|_|_|  _|_|_|_|  
                            
ICE - Lightweight JavaScript library
```
    
ICE features:
* Small footprint (65KB uncompressed)
* Mature - used on Todoist.com since 2007
* Unified things that work in all the modern browsers (IE 7+)
* Functional programming
* DOM helpers
* Array helpers
* Element store
* Powerful and easy to use requests
* Deferred abstraction
* Class abstraction
* Effects
* Drag and drop helpers
* and a lot more...

Example of ICE:
```javascript
// Requests
function loadUsers() {
    var req = $requestJSON('/users/get')

    req.addCallback(function(users) {
        var user_holder = $('user_holder')
        $map(users, function(user) {
            var li = LI({c: 'user'}, user.name)
            $AEV(li, 'click', UserController.click)
            $add(user_holder, li)
        })
    })

    req.sendReq({token: TOKEN})
}

// Events
$AEV(window, 'load', loadUsers)

// Effects
$fx.setWidth($('fluffy_4'), {from: 150, to: 400})

// Array helpers
$arrayFlatten([[1, 2, [3, 4]], 5]) == [1, 2, 3, 4, 5]

// DOM abstraction
$add($body(),
     DIV({c: 'my_class', s:'padding-top: 10px'}, "Hello"))

// Element store
ElementStore.set(elm, "meaning of life", {42: 42})
```


### Inspirations

A lot of ideas from ICE comes from [MochiKit](http://mochikit.com/). The effects library is inspired by [mootools](http://mootools.net/).


### Not polluting the global namespace

By default ICE exports its public functions to the global name space (window). 
If you want to disable this set __window.ICE_EXPORT_TO_SCOPE = false__ before sourcing the library.
Then use the __ICE.__ prefix to access the API.


## General accessors functions


* $isWebkit -- Returns true if the browser is webkit
* $isIe -- Returns true if the browser is Internet Explorer
* $isIe8 -- Returns true if the browser is Internet Explorer v8
* $isSafari -- Returns true if the browser is Safari
* $isOpera -- Returns true if the browser is Opera
* $isMozilla -- Returns true if the browser is Mozilla
* $isMac -- Returns true if the browser is a Mac
* $isChrome -- Returns true if the browser is a Chrome
* $queryArgument(var_name) -- Returns the value of __var_name__ from the URL


## Array functions


* $arrayCreate(val) -- Returns __val__ if it's already an array, otherwise [__val__] is returned. Shortcut $A
* $arrayCompare(arr_a, arr_b) -- Returns true if __arr_a__ and __arr_b__ are equal
* $arrayRemove(array, elm [,eval_fn]) -- Removes __elm__ from __array__
* $arrayUpdate(array, old_elm, new_elm) -- Updates __old_elm__ to __new_elm__ inside array
* $arrayCopy(array) -- Returns a copy of __array__
* $arrayDiff(arr1, arr2) -- Returns the diff between __arr1__ and __arr2__
* $arrayUnion(arr1, arr2) -- Returns the union between __arr1__ and __arr2__
* $arrayForce(args) -- Returns a true array. This functions is useful to force arguments to act as an array instead of an object. Shortcut $AF
* $arrayJoin(delim, array) -- Returns the elements of __array__ as string, separated by the specified delimiter __delim__
* $isIn(elm, array) -- Returns true if __elm__ is inside __array__
* $index(elm, array [,eval_fn]) -- Returns the index of __elm__ inside __array__. -1 is returned if the __elm__ isn't found
* $first(array) -- Returns the first element of __array__
* $last(array) -- Returns the last element of __array__
* $random(array) -- Returns an random element of __array__
* $arrayFlatten(array) -- Returns a flattened __array__
* $update(obj1, obj2) -- Update __obj1__ with properties from __obj2__

```javascript
$isIn("cow", [1, 2, "cow"]) == true
$getIndex("cow", [1, 2, "cow"]) == 2
$update({a: 1, b: 2}, {c: 3}) == {a: 1, b: 2, c: 3}
$arrayFlatten([[1, 2, [3, 4]], 5]) == [1, 2, 3, 4, 5]
```


## Functional programming

* $map(array, fn, [start_index, end_index]) -- Executes __fn__ on all elements of __array__. Signature is fn(element, index)
* $rmap(array, fn, [start_index, end_index]) -- Like $map, but in reverse
* $filter(array, fn, [start_index, end_index]) -- Executes __fn__ on all elements of __array__ and returns all the elements of list where __fn(elm)__ equals true
* $partial(fn) -- Return a partially applied function. Shortcut $p

```javascript
div_with_2 = $filter([1, 5, 8, 4], function(n) {
     return (n % 2 == 0)
})
div_with_2 == [8, 4]

adder = function(a, b) {
    return a + b
}
add_one = $partial(adder, 1)
add_one(41) == 42
```


## DOM accessors

* $(id) -- Returns the DOM element with the __id__
* $$(selector, [in_children]) -- Returns a list of DOM elements that match the CSS __selector__
* $nodeName(elm) -- Returns the node name of __elm__
* $parent(elm, tag_name, [class_name, stop_elm]) -- Look on __elm__ parents and return the first match. The search stops when __stop_elm__ is reached. Shortcut $gp
* $child(elm, tag_name, [class_name, stop_elm]) -- Look on __elm__ children and return the first match. Shortcut $gc
* $prevSibling(elm, tag_name, class_name) -- Look on __elm__ previous siblings and return the first match
* $nextSibling(elm, tag_name, class_name) -- Look on __elm__ next siblings and return the first match
* $body() -- Returns the body DOM element
* $head() -- Returns the head DOM element
* $form(form, name) -- Returns a form element with the specified __name__. Shortcut $f
* $selectValue(select) -- Returns value of __select__
* $all(tag_name, class_name, [parent, first_match]) -- [Deprecated, use $$ isntead]. Returns a list of DOM elements. To ignore the tag_name or class_name set them to null. The whole document is searched if parent isn't set

```javascript
// Returns one element with id google_login
$('google_login') 

// Returns all of div elements
$$('div') 

// Returns div elements with .user class inside #google_list
$$('div.user', $('google_list')) 

// Returns the div.facebook_login that's the first sibling of #google_list
$nextSibling($('google_list'), 'div', 'facebook_login')

// Returns the first parent of #google_list that matches div.holder
$parent($('google_list'), 'div', 'holder') 

// Returns the first child of #google_list that matches li.user
$child($('google_list'), 'li', 'user') 

// Deprecated (use $$): Returns div tags with user class inside #google_list
$all('div', 'user', $('google_list')) 
```


## DOM mutators

* $documentInsert(elm) -- Write element to the document (using document.write)
* $toDOM(html, [first_child]) -- Transform __html__ to DOM. Returns first child if __first_child__ is true 
* $add(elm, elm1, ..., elmN) -- Add __elm1,...,elmN__ to __elm__
* $addToTop(elm, elm1, ..., elmN) -- Add __elm1,...,elmN__ to the top of __elm__. Shortcut $ATT
* $replace(elm, elm1, ..., elmN) -- Replace children of __elm__ with __elm1,...,elmN__
* $addAfter(elm, reference_elm) -- Add __elm__ after __reference_elm__
* $addBefore(elm, reference_elm) -- Add __elm__ before __reference_elm__
* $clean(elm) -- Clean data, events, etc. attached to __elm__
* $swap(dest, src) -- Swap __dest__ with __src__
* $remove(elm1, ..., elmN) -- Remove __elm1,...,elmN__
* $create(tag_name, attrs) -- Create a new DOM element with __tag_name__. __attrs__ should be an object or array
* $setHTML(elm1, ..., elmN, html) -- Set the innerHTML of __elm1,...,elmN__ to html

DOM shortcuts. These elements have shortcuts:
* UL, LI, TD, TR, TH,
* TBODY, TABLE, INPUT, SPAN, B,
* A, DIV, IMG, BUTTON, H1,
* H2, H3, H4, H5, H6, BR, TEXTAREA, FORM,
* P, SELECT, OPTION, OPTGROUP, IFRAME, SCRIPT,
* CENTER, DL, DT, DD, SMALL,
* PRE, I, LABEL, THEAD, HR

```javascript
// Using $create
$create("p", [{id: "my_p", style: "color: red"}, "Hello world"])

// Using the shortcuts
$add($body(),
     DIV({c: 'my_class', s:'padding-top: 10px'}, "Hello"))

// Inserting a DIV elemetn to the body
$insertAfter(DIV("Hello"), $body())
```


## CSS - visibility

* $setVisibility(elm1, ..., elmN, visibility) -- Update visibility of __elm1,...,elmN__
* $setOpacity(elm1, ..., elmN, value) -- Update opacity to __value__ of __elm1,...,elmN__
* $show(elm1, ..., elmN) -- Show __elm1,...,elmN__
* $hide(elm1, ..., elmN) -- Hide __elm1,...,elmN__
* $isHidden(elm) -- Returns true if __elm__ is hidden. Otherwise false
* $isShown(elm) -- Returns true if __elm__ is shown. Otherwise false

```javascript
$show($$('div.user'))
$isHidden($('google_login')) == true
$setVisibility($$('div.user'), false)
$setOpacity($$('div.user'), 0.5)
```

## CSS - style updates

* $setStyle(elm1, ..., elmN, obj) -- Update elm.style with __obj__ of __elm1,...,elmN__
* $getStyle(elm, property) -- Return the computed style of __elm__
* $setWidth(elm1, ..., elmN, width) -- Set width of __elm1,...,elmN__
* $setHeight(elm1, ..., elmN, height) -- Set height of __elm1,...,elmN__
* $setLeft(elm1, ..., elmN, left) -- Set left of __elm1,...,elmN__
* $setRight(elm1, ..., elmN, right) -- Set right of __elm1,...,elmN__
* $setTop(elm1, ..., elmN, top) -- Set top of __elm1,...,elmN__
* $setBottom(elm1, ..., elmN, bottom) -- Set bottom of __elm1,...,elmN__

```javascript
$setStyle($$('div.user'), {top: 50, left: 40})
$setTop($$('div.user'), 100)
```

## CSS - classes 

* $setClass(elm1, ..., elmN, class) -- Set class of __elm1,...,elmN__
* $addClass(elm1, ..., elmN, class) -- Add class to __elm1,...,elmN__
* $removeClass(elm1, ..., elmN, class) -- Remove class class __elm1,...,elmN__
* $replaceClass(elm1, ..., elmN, classOld, classNew) -- Replace classOld with classNew in __elm1,...,elmN__
* $hasClass(elm, class) -- Returns true if __elm__ has __class__

```javascript
$setClass($$('div.user', $('google_login')), 'user_deleted')
$addClass($('user_a'), $('user_b'), 'user_loading')
```


## Position and size

* $mousePos(event) -- Returns the mouse position of __event__ as {x: ..., y: ...}
* $scrollTop(elm) -- Scrolls __elm__ to the top
* $position(elm) -- Returns the absolute position of __elm__ as {x: ..., y: ...}
* $docSize([doc]) -- Returns the document size of __doc__ as {w: ..., h: ...}
* $winSize([doc]) -- Returns the window size as {w: ..., h: ...} by inspecting __doc__
* $isOverlapping(elm1, elm2) -- Returns true if elm1 is overlapping elm2

```javascript
$position($('my_elm')) == {x: 100, y: 200}
$isOverlapping($('elm1'), $('elm2')) == true
```


## Events

* $eventElm(event) -- Returns the element that's tied to __event__
* $addListener(elms, types, handler, [listen_once]) -- Add a __handler__ that handles __types__. Shortcut $AEV
* $removeListener(elms, types, handler, [listen_once]) -- Remove __handler__ from __elms__ that handles __types__. Shortcut $REV
* $removeAllListeners(elms, type) -- Remove all handlers that handle __type__

```javascript
$AEV($$('div.user'), 'click', function(ev) {
    $preventDefault(ev)
    var elm = $eventElm(ev)
    // ...
})

$AEV([$('input_1'), $('input_2')], 'keypress', function(ev) {
    alert(ev.key)
    alert(ev.ctrl)
    alert(ev.meta)
})

$AEV($('google_btn'), 'click' $b(googleBtnClick, GoogleUser) {
    // this points to GoogleUser
});
```

### Preventing default behaviour 

* $preventDefault(event) -- Prevent the default behavior of an event
* $stopPropagation(event) -- Stop propagation of an event

## Binding functions

* $bind(fn, scope, [extra_args]) -- Bind function __fn__ to __scope__ and return it. __extra_args__ is an array of extra parameters that should be sent to __fn__. Shortcut $b
* $bindMethods(object) -- Force binding all of methods of __object__ to itself. Useful to resolve __this__



## Requests

* $request(url, method) -- Perform a request to __url__ and return it in a deferred object. __method__ can be get or post
* $requestJSON(url, method) -- Like $request, but parse the result as JSON
* $httpReq() -- Returns a new XMLHTTPRequest
* $serialize(obj) -- Serialize __obj__ as JSON
* $eval(txt) -- Evaluate __txt__ as JavaScript or JSON (if possible) and return the result
* $evalScript(html) -- Evaluate script tags inside __txt__
* $encode(data) -- Return the query argument representation of __data__

```javascript
d = $request('/feeds/json/amix')
d.addCallback(function(res_txt, req) { alert(res_txt) })
d.addErrback(function(res_txt, req) { alert('Error encountered: ' + res_txt) })
d.sendReq({val: 1})

$serialize({'a': 1, 'b': 2}) == '{"a":1,"b":2}'
$eval('{"a":1,"b":2}') == {'a': 1, 'b': 2}

$encode({name: 'peter', 'age': 29}) == "name=peter&age=29"
```

### Requests (deferred object)

A deferred gives the option to chain functions. ICE borrowed this idea from [MochiKit](http://mochi.github.io/mochikit/) that borrowed it from [Twisted](https://twistedmatrix.com/trac/). ICE implementation is much more simple and limited than MochiKit's or Twisted's.

When you call $request or $requestJSON you get a deferred object. This object has following methods:

* addCallback(fn): Add the function fn to the end of the callback sequence
* addErrback(fn): Add the function fn to the end of the errorback sequence
* addCallbacks(callback, errback)
* sendReq(data): Send the actual request. __data__ should be a JSON object



## Class abstraction

ICE features a simple way to do OOP in JavaScript. A simple example that demonstrates all of the functionality:

```javascript
Person = new Class({
    init: function(name) {
        this.name = name
        Person.count++
    },

    getName: function() {
        return this.name
    }
})

// Static field
Person.count = 0

UniversityPerson = Person.extend({

    init: function(name, school) {
        this.parent(name)
        this.school = school
    },

    getSchool: function() {
        return this.school
    }
})
```


## Effects - $fx

You can use $fx to create some dazzling effects.

* $fx.highlight(elm, opts) -- Yellow highlight the element
* $fx.fadeIn(elm, opts) -- Fade in the element
* $fx.fadeOut(elm, opts) -- Fade out the element
* $fx.setWidth(elm, opts) -- Animate resize of width
* $fx.setHeight(elm, opts) -- Animate resize of height
* $fx.Style(elm, opts) -- Animates an arbitrary effect
* $fx.Styles(elm, opts) -- Animates an arbitrary effects

```javascript
$fx.highlight($('fluffy_1'), {duration: 1000})
$fx.setWidth($('fluffy_4'), {from: 150, to: 400})

new $fx.Style($('fluffy_6'), 'width').custom(50, 300)

new $fx.Styles($('fluffy_7')).custom(
   {'height': [50, 100], 'width': [150, 300]}
)
```


## Drag and drop - $dnd

$dnd makes it possible to support drag and drop. It provides a bare-bone where browser issues are solved. There is no drop-zones and no sortable lists, but you can implement these things using a few lines code.

Look inside the examples directory for some ideas of how $dnd works.

* $dnd.dragAble(element, opts) -- Make element drag able. The element's style.position should be absolute
* $dnd.removeDragAble(element) -- Remove the drag ability from element
* $dnd.current_root -- When dragging begins this object holds the element that is moved
* $dnd.current_handler -- When dragging begins this object holds the element that drags 

The __opts__ to $dnd.dragAble can be following. All of them are optional.
* move_x -- Enable horizontal move. Default true
* move_y -- Enable vertical move. Default true
* scroll_on_overflow -- Scroll the page on overflow. Default true
* on_start -- A callback that is triggered when the drag is started. Signature is on_start()
* on_drag -- A callback that is triggered when a dragable is dragged. Signature is on_drag(new_x, new_y)
* on_end -- A callback that is triggered when the drag is stopped. Signature is on_start()
* move_filter: This function can control the x and y coordinates. Signature is move_filter(x, y) -> [x, y]

```javascript
var drop_red = $('drop_red')
var drop_blue = $('drop_blue')

var onDrag = function() {
    var root = $dnd.current_root

    if($isOverlapping(root, drop_red))
        $addClass(root, 'color_red')
    else if($isOverlapping(root, drop_blue))
        $addClass(root, 'color_blue')
    else {
        $removeClass(root, 'color_blue')
        $removeClass(root, 'color_red')
    }
}

$dnd.dragAble($('draggy'), {
    handler: $('draggy_handler'),
    on_drag: onDrag
})
```


## Element store

[jQuery.data](http://api.jquery.com/jQuery.data/#jQuery.data1) allows you to attach data of any type to DOM elements in a way that is safe from circular references and therefore from memory leaks. ICE a standalone jQuery.data library called ElementStore - - which is also a standalone library [github.com/Doist/ElementStore](https://github.com/Doist/ElementStore).

* ElementStore.set(elm, key, value)
* ElementStore.get(elm, key)
* ElementStore.remove(elm, key) -- Remove one key
* ElementStore.remove(elm) -- Removes all keys

```javascript
ElementStore.set(elm, "meaning of life", {42: 42})
ElementStore.get(elm, "meaning of life")
ElementStore.remove(elm, "meaning of life")
ElementStore.remove(elm)
```


## Misc
* $keys(object) -- Returns the keys of __object__
* $values(object) -- Returns the values of __object__
* $urlencode(str) -- Returns URL encoding of __str__
* $urldecode(str) -- Returns URL decoding of __str__
* $defined(obj) -- Returns true if __obj__ is defined (not null or undefined)
* $isArray(obj) -- Returns true if __obj__ is an array
* $isString(obj) -- Returns true if __obj__ is a string
* $isNumber(obj) -- Returns true if __obj__ is a number
* $isObject(obj) -- Returns true if __obj__ is a object
* $isFunction(obj) -- Returns true if __obj__ is a function
* $isBoolean(obj) -- Returns true if __obj__ is a boolean
* $isDict(obj) -- Returns true if __obj__ is a dictionary (e.g. {})
* $log(obj) -- Write __obj__ to the log
* $strip(str) -- Stripe prefix and suffix whitespace from __str__
* $trim(str, limit, [delim]) -- Trim __str__ with __limit__ length and suffix it with __delim__ if needed. __delim__ is __...__ by default
* $preload(img_src1, ..., img_srcN) -- Preload images __img_src1, ..., img_srcN__

```javascript
$keys({a: 1, b: 2, c: 3}) == ["a", "b", "c"]
$values({a: 1, b: 2, c: 3}) == [1, 2, 3]
```
