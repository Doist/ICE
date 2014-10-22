/*
    _|_|_|    _|_|_|  _|_|_|_|  
      _|    _|        _|        
      _|    _|        _|_|_|    
      _|    _|        _|        
    _|_|_|    _|_|_|  _|_|_|_|  
                                
    ICE - Lightweight JavaScript library

    Version: 5.0

    Last Modified: 03/08/14 16:01:44

    Copyright: 2014 Doist Ltd.

    License: MIT
**/

if(!window.ICE) {

// By default export ICE.* to global scope (window)
if(window.ICE_EXPORT_TO_SCOPE === undefined)
    window.ICE_EXPORT_TO_SCOPE = window;

var ICE = {

    BASE_URL: "",

    _ready_bound: false,
    _is_ready: false,
    _agent: navigator.userAgent.toLowerCase(),
    _agent_version: navigator.productSub,

    _ready_list: [],
    _f_guid: 2,

    generalErrorback: null,
    generalCallback: null,
    annotateAjaxData: [],

////
// General accessors functions
////
    $isWebkit: function() {
        return ICE._agent.indexOf("webkit") != -1;
    },
    $isIe: function() {
        return ICE._agent.indexOf("msie") != -1;
    },
    $isIe8: function() {
        return ICE._agent.indexOf("msie 8") != -1;
    },
    $isSafari: function(all) {
        if(all)
            return ICE._agent.indexOf("khtml");

        return (ICE._agent.indexOf("khtml") != -1 &&
                ICE._agent.match(/3\.\d\.\d safari/) === null);
    },
    $isOpera: function() {
        return ICE._agent.indexOf("opera") != -1;
    },
    $isMozilla: function() {
        return (ICE._agent.indexOf("gecko") != -1 && ICE._agent_version >= 20030210);
    },
    $isMac: function() {
        return (ICE._agent.indexOf('macintosh') != -1);
    },
    $isChrome: function() {
        return ICE._agent.indexOf("chrome/") != -1;
    },

    $queryArgument: function(var_name) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if (pair[0] == var_name) {
                return pair[1];
            }
        }
        return null;
    },


////
// Array functions
////
    $arrayCreate: function(v) {
        if(ICE.$isArray(v) && !ICE.$isString(v))
            return v;
        else if(!v)
            return [];
        else
            return [v];
    },

    $arrayCompare: function(arr_a, arr_b) {
        if(arr_a.length != arr_b.length) 
            return false;

        for(var i = 0; i < arr_b.length; i++) {
            if(arr_a[i].compareArrays) { //likely nested array
                if(!arr_a[i].compareArrays(arr_b[i])) 
                    return false;
                else 
                    continue;
            }

            if(arr_a[i] != arr_b[i]) 
                return false;
        }

        return true;
    },

    $arrayRemove: function(array, elm, eval_fn) {
        var index = ICE.$index(elm, array, eval_fn);
        if(index != -1)
            array.splice(index, 1);
        return array;
    },

    $arrayUpdate: function(array, old_elm, new_elm) {
        var index = ICE.$index(old_elm, array);
        if(index != -1)
            array.splice(index, 1, new_elm);
        return array;
    },

    $arrayCopy: function(array) {
        var r = [];
        for(var i = 0; i < array.length; i++)
            r.push(array[i]);
        return r;
    },

    $arrayDiff: function(arr1, arr2) {
        if(arr2.length > arr1.length) {
            var swap_arr = arr1;
            arr1 = arr2;
            arr2 = swap_arr;
        }
        return ICE.$filter(arr1, function(i) { return !(ICE.$index(i, arr2) > -1); });
    },

    $arrayUnion: function(arr1, arr2) {
        if(arr2.length > arr1.length) {
            var swap_arr = arr1;
            arr1 = arr2;
            arr2 = swap_arr;
        }
        return ICE.$filter(arr1, function(i) { return ICE.$index(i, arr2) > -1; });
    },

    $arrayForce: function(args) {
        if(ICE.$isArray(args))
            return args;

        var r = [];
        for(var i = 0; i < args.length; i++)
            r.push(args[i]);
        return r;
    },

    $arrayJoin: function(delim, array) {
        try {
            return array.join(delim);
        }
        catch(e) {
            var r = array[0] || '';
            ICE.$map(array, function(elm) {
                r += delim + elm;
            }, 1);
            return r + '';
        }
    },

    $isIn: function(elm, array) {
        var i = ICE.$index(elm, array);
        if(i != -1)
            return true;
        else
            return false;
    },

    $index: function(elm, array/*optional*/, eval_fn) {
        for(var i=0; i < array.length; i++)
            if(eval_fn && eval_fn(array[i]) || elm == array[i])
                return i;
        return -1;
    },

    $first: function(array) {
        if(array.length > 0)
            return array[0];
        else
            return null;
    },

    $last: function(array) {
        if(array.length > 0)
            return array[array.length-1];
        else
            return null;
    },

    $random: function(array) {
        return array[Math.floor(Math.random()*array.length)];
    },

    $arrayFlatten: function(array) {
        array = ICE.$arrayForce(array);

        /* Fast check if everything is a array */
        var non_arrays = true;

        ICE.$map(array, function(elm) {
            if(elm && ICE.$isArray(elm)) {
                non_arrays = false;
                return true;
            }
        });

        if(non_arrays)
            return array;

        var has_list = false;
        var new_list = [];

        for(var i=0; i < array.length; i++) {
            var elm = array[i];
            if(ICE.$isArray(elm)) {
                has_list = true;
                break;
            }

            if(elm !== null)
                new_list.push(elm);
        }

        if(!has_list)
            return new_list;

        var r = [];
        var _flatten = function(r, l) {
            ICE.$map(l, function(o) {
                if(o === null) {
                }
                else if (ICE.$isArray(o))
                    _flatten(r, o);
                else
                    r.push(o);
            });
        }
        _flatten(r, array);
        return r;
    },

    $update: function(l1, l2) {
        for(var i in l2)
            l1[i] = l2[i];
        return l1;
    },


////
// Functional programming
////
    $map: function(array, fn,/*optional*/ start_index, end_index) {
        var i = 0, l = array.length;

        if(start_index !== undefined)
             i = start_index;

        if(end_index !== undefined)
             l = end_index;

        for(i; i < l; i++) {
            var val = fn(array[i], i);
            if(val !== undefined)
                return val;
        }
    },

    $rmap: function(array, fn,/*optional*/ start_index, end_index) {
        var i = array.length-1, l = 0;
        if(start_index !== undefined)
             i = start_index;
        if(end_index !== undefined)
             l = end_index;
        for(i; i >= l; i--) {
            var val = fn.apply(null, [array[i], i]);
            if(val !== undefined)
                return val;
        }
    },

    $filter: function(array, fn, /*optional*/ start_index, end_index) {
        var r = [];
        ICE.$map(array, function(elm, i) {
            if(fn(elm, i))
                r.push(elm);
        }, start_index, end_index);
        return r;
    },

    $partial: function(fn) {
        var args = $AF(arguments);
        args.shift();
        return function() {
            var new_args = [];
            new_args = new_args.concat(args);
            new_args = new_args.concat($AF(arguments));
            return fn.apply(this || window, new_args);
        }
    },


////
// DOM functions
////

//--- Accessors ----------------------------------------------
    //Shortcut: $
    $get: function(id) {
        if(ICE.$isString(id) || ICE.$isNumber(id))
            return document.getElementById(id);
        else
            return id;
    },

    $$: function(selector, in_children) {
        if(in_children) {
            return in_children.querySelectorAll(selector);
        } else {
            return document.querySelectorAll(selector);
        }
    },

    $all: function(tag_name, class_name, /*optional*/ parent, first_match) {
        if(!ICE.$defined(parent))
            parent = document;

        if(!ICE.$defined(tag_name))
            tag_name = '*';

        var selector;
        if(tag_name && class_name)
            selector = tag_name + '.' + class_name;
        else if(tag_name)
            selector = tag_name;
        else if(class_name)
            selector = '.' + class_name;
        class_elements = ICE.$arrayForce(parent.querySelectorAll(selector));

        if(first_match)
            return class_elements[0];
        else
            return class_elements;
    },

    $nodeName: function(elm) {
        if(!elm || !elm.nodeName)
            return 'undefined';
        return elm.nodeName.toLowerCase();
    },

    _nodeWalk: function(elm, tag_name, class_name, fn_next_elm) {
        if(!elm)
            return null;

        var p = fn_next_elm(elm);

        var checkFn;
        if(tag_name && class_name) {
            checkFn = function(p) {
                return ICE.$nodeName(p) == tag_name && ICE.$hasClass(p, class_name);
            }
        }
        else if(tag_name) {
            checkFn = function(p) { return ICE.$nodeName(p) == tag_name; }
        }
        else {
            checkFn = function(p) { return ICE.$hasClass(p, class_name); }
        }

        if(checkFn(elm))
            return elm;

        while(p) {
            if(checkFn(p))
                return p;
            p = fn_next_elm(p);
        }
        return null;
    },

    $parent: function(elm, tag_name, /*optional*/ class_name, stop_elm) {
        var sp = ICE._parseTagClassName(tag_name, class_name);
        tag_name = sp[0]; class_name = sp[1];
        return ICE._nodeWalk(elm, tag_name, class_name, function(m) { 
            if(m == stop_elm)
                return null;
            if(m) 
                return m.parentNode; 
        });
    },

    $child: function(elm, tag_name, class_name) {
        var sp = ICE._parseTagClassName(tag_name, class_name);
        tag_name = sp[0]; class_name = sp[1];

        var elms = ICE.$all(tag_name, class_name, elm);
        if(elms.length > 0)
            return elms[0];
        else
            return null;
    },

    $prevSibling: function(elm, tag_name, class_name) {
        var sp = ICE._parseTagClassName(tag_name, class_name);
        tag_name = sp[0]; class_name = sp[1];
        return ICE._nodeWalk(elm, tag_name, class_name, function(m) { return m.previousSibling; });
    },

    $nextSibling: function(elm, tag_name, class_name) {
        var sp = ICE._parseTagClassName(tag_name, class_name);
        tag_name = sp[0]; class_name = sp[1];
        return ICE._nodeWalk(elm, tag_name, class_name, function(m) { return m.nextSibling; });
    },

    $body: function() { return ICE.$all('body')[0] },

    $head: function() { return ICE.$all('head')[0] },

    //Shortcut: $f
    $form: function(form, name) {
        form = ICE.$(form);
        var r = null;
        ICE.$map(form.elements, function(elm) {
            if(elm.name && elm.name == name)
                r = elm;
        });
        if(r)
            return r;

        ICE.$map(ICE.$all('select', null, form), function(elm) {
            if(elm.name && elm.name == name)
                r = elm;
        });
        return r;
    },

    $selectValue: function(select) {
        select = ICE.$(select);
        if(!select)
            return null;
        return select.options[select.selectedIndex].value;
    },


//--- DOM mutators ----------------------------------------------
    $documentInsert: function(elm) {
        if(typeof(elm) == 'string')
            elm = ICE.$toDOM(elm);
        document.write('<span id="dummy_holder"></span>');
        ICE.$swap(ICE.$('dummy_holder'), elm);
    },

    $toDOM: function(html,/*optional*/ first_child) {
        var d = ICE.DIV();
        d.innerHTML = html;
        if(first_child)
            return d.childNodes[0];
        else
            return d;
    },

    $add: function(elm/*, elms...*/) {
        var args = ICE.$arrayFlatten(arguments);

        if(args.length >= 2) {
            ICE.$map(args, function(n) {
                if(ICE.$isString(n))
                    n = ICE.TN(n);

                if(ICE.$defined(elm) && ICE.$defined(n))
                    elm.appendChild(n);
            }, 1);
        }

        return elm;
    },

    //Shortcut: $ATT
    $addToTop: function(elm/*, elms...*/) {
        var args = ICE.$arrayFlatten(arguments).slice(1);
        if(args.length >= 1) {
            var first_child = elm.firstChild;
            if(first_child) {
                while(true) {
                    var t_elm = args.shift();
                    if(t_elm)
                        ICE.$addBefore(t_elm, first_child);
                    else
                        break;
                }
            }
            else {
                ICE.$add.apply(null, arguments);
            }
        }
        return elm;
    },

    $replace: function(elm/*, elms...*/) {
        var child;

        while ((child = elm.firstChild)) {
            ICE.$swap(child, null);
        }

        if (arguments.length < 2)
            return elm;
        else
            return ICE.$add.apply(null, arguments);
        return elm;
    },

    $addAfter: function(elm, reference_elm) {
        reference_elm.parentNode.insertBefore(elm, reference_elm.nextSibling);
        return elm;
    },

    $addBefore: function(elm, reference_elm) {
        reference_elm.parentNode.insertBefore(elm, reference_elm);
        return elm;
    },

    $clean: function(elm) {
        if(elm && elm.nodeType == 1) {
            if(elm.reuseable)
                return true;

            ElementStore.remove(elm);
            ICE.$map(ICE.$AF(elm.getElementsByTagName("*")), function(child) {
                if(child && !child.reuseable)
                    ElementStore.remove(child);
            });
        }
    },

    $swap: function(dest, src) {
        dest = ICE.$(dest);

        ICE.$clean(dest);

        var parent = dest.parentNode;

        if (src) {
            src = ICE.$get(src);
            parent.replaceChild(src, dest);
        } else {
            parent.removeChild(dest);
        }

        return src;
    },

    $remove: function(/*elm1, elm2...*/) {
        var args = ICE.$arrayFlatten(arguments);
        try {
            ICE.$map(args, function(elm) { 
                if($(elm)) 
                    ICE.$swap(elm, null); 
            });
        }
        catch(e) {
        }
    },

    $create: function(tag_name, attrs) {
        var i=0, attr;
        var elm = document.createElement(tag_name);

        var first_attr = attrs[0];
        if(ICE.$isDict(attrs[i])) {
            for(var k in first_attr) {
                attr = first_attr[k];
                if(k == 'style' || k == 's')
                    elm.style.cssText = attr;
                else if(k == 'c' || k == 'class' || k == 'className')
                    elm.className = attr;
                else if(k == 'reuseable')
                    elm.reuseable = true; 
                else {
                    elm.setAttribute(k, attr);
                }
            }
            i++;
        }

        if(first_attr === null)
            i = 1;

        for(var j=i; j < attrs.length; j++) {
            attr = attrs[j];
            if(attr) {
                var type = typeof(attr);
                if(type == 'string' || type == 'number')
                    attr = ICE.TN(attr);
                elm.appendChild(attr);
            }
        }

        return elm;
    },
    
    $setHTML: function(/*elms..., html*/) {
        var args = ICE.$arrayFlatten(arguments);
        var html = args.pop();
        ICE.$map(args, function(elm) { 
            if(elm)
                elm.innerHTML = html;
        });
        return args[0];
    },

    _createDomShortcuts: function() {
        var elms = [
                "ul", "li", "td", "tr", "th",
                "tbody", "table", "input", "span", "b",
                "a", "div", "img", "button", "h1",
                "h2", "h3", "h4", "h5", "h6", "br", "textarea", "form",
                "p", "select", "option", "optgroup", "iframe", "script",
                "center", "dl", "dt", "dd", "small",
                "pre", 'i', 'label', 'thead',
                "hr"
        ];

        var extends_ajs = function(elm) {
            ICE[elm.toUpperCase()] = function() {
                return ICE.$create.apply(null, [elm, arguments]); 
            };
        }

        ICE['$map'](elms, extends_ajs);
        ICE['TN'] = function(text) { return document.createTextNode(text) };
    },


//--- CSS related ----------------------------------------------
    $setVisibility: function(/*elms..., val*/) {
        var args = ICE.$arrayFlatten(arguments);
        var val = args.pop() && 'visible' || 'hidden';
        ICE.$setStyle(args, 'visibility', val);
    },

    $setOpacity: function(elm, p) {
        var args = ICE.$arrayFlatten(arguments);

        var opacity = args.pop();

        ICE.$map(args, function(elm) {
            if(opacity == 1) {
                elm.style.opacity = 1;
                elm.style.filter = "";
            }
            else {
                elm.style.opacity = opacity;
                elm.style.filter = "alpha(opacity="+ opacity*100 +")";
            }
        });
    },

    $show: function(/*elms...*/) {
        ICE.$setStyle(ICE.$arrayFlatten(arguments), 'display', '');
    },

    $hide: function(elm) {
        ICE.$setStyle(ICE.$arrayFlatten(arguments), 'display', 'none');
    },

    $isHidden: function(elm) {
        if(!elm)
            return false;
        return ((elm.style.display == "none") || (elm.style.visibility == "hidden"));
    },

    $isShown: function(elm) {
        if(!elm)
            return false;
        return !ICE.$isHidden(elm);
    },

    $setStyle: function(/*elm1, elm2..., {prop: value}*/) {
        var args = ICE.$arrayFlatten(arguments);

        if(args.length === 0 || args.length == 1)
            return ;

        var value = args.pop();
        var num_styles = ['top', 'left', 'right', 'width', 'height'];
        if(ICE.$isObject(value)) {
            ICE.$map(args, function(elm) { 
                if(elm) {
                    ICE.$map(ICE.$keys(value), function(prop) {
                        var css_dim = value[prop];
                        if(ICE.$isIn(prop, num_styles))
                            css_dim = ICE.$isString(css_dim) && css_dim || css_dim + 'px';

                        elm.style[prop] = css_dim;
                    });
                }
            });
        }
        else {
            var property = args.pop();
            ICE.$map(args, function(elm) { 
                if(elm) {
                    if(ICE.$isIn(property, num_styles))
                        value = ICE.$isString(value) && value || value + 'px';
                    elm.style[property] = value;
                }
            });
        }
    },

    $getStyle: function(elm, property) {
        var computed;

        if(elm.currentStyle)
            computed = elm.currentStyle; 
        else 
            computed = document.defaultView.getComputedStyle(elm, null); 

        return computed[property];
    },

    $setWidth: function(/*elm1, elm2..., width*/) { 
        return ICE.__cssDim(arguments, 'width');
    },
    $setHeight: function(/*elm1, elm2..., height*/) {
        return ICE.__cssDim(arguments, 'height');
    },
    $setLeft: function(/*elm1, elm2..., left*/) {
        return ICE.__cssDim(arguments, 'left');
    },
    $setRight: function(/*elm1, elm2..., left*/) {
        return ICE.__cssDim(arguments, 'right');
    },
    $setTop: function(/*elm1, elm2..., top*/) {
        return ICE.__cssDim(arguments, 'top');
    },
    $setBottom: function(/*elm1, elm2..., top*/) {
        return ICE.__cssDim(arguments, 'top');
    },

    $setClass: function(/*elm1, elm2..., className*/) {
        var args = ICE.$arrayFlatten(arguments);
        var c = args.pop();
        ICE.$map(args, function(elm) { elm.className = c});
    },

    $addClass: function(/*elm1, elm2..., className*/) {
        var args = ICE.$arrayFlatten(arguments);
        var cls = args.pop();

        var add_class = function(o) {
            if(o) {
                var cur_class = o && o.className;

                if(cur_class == cls)
                    return;

                if(!ICE.$hasClass(o, cls)) {
                    o.className += (o.className ? " " : "") + cls;
                }
            }
        };

        ICE.$map(args, function(elm) { 
            if(elm && elm.classList && cls.indexOf(' ') == -1) {
                elm.classList.add(cls);
            }
            else {
                add_class(elm); 
            }
        });
    },

    $removeClass: function(/*elm1, elm2..., className*/) {
        var args = ICE.$arrayFlatten(arguments);
        var cls = args.pop();

        var rm_class = function(o) {
            if(o) {
                if(o.className == cls) {
                    o.className = '';
                }
                else {
                    o.className = o.className.replace(new RegExp('(^|\\s)' + cls + '(?:\\s|$)'),
                                                      '$1')
                }
            }
        };

        ICE.$map(args, function(elm) { 
            if(elm && elm.classList && cls.indexOf(' ') == -1)
                elm.classList.remove(cls);
            else
                rm_class(elm); 
        });
    },

    $replaceClass: function(/*elm1, elm2..., oldClass, newClass*/) { 
        var args = ICE.$arrayFlatten(arguments);

        var new_class = args.pop();
        var old_class = args.pop();

        ICE.$removeClass(args, old_class);
        ICE.$addClass(args, new_class);
    },

    $hasClass: function(elm, cls) {
        if(!elm || !elm.className)
            return false;

        if(elm.classList && cls.indexOf(' ') == -1)
            return elm.classList.contains(cls);

        var e_cls = elm.className;

        if(e_cls == cls)
            return true;

        // In the start
        if(e_cls.indexOf(cls + ' ') === 0)
            return true;

        // In the middle
        if(e_cls.indexOf(' ' + cls + ' ') != -1)
            return true;

        // In the end
        var last_index = e_cls.indexOf(' ' + cls)
        if(last_index != -1 && last_index == e_cls.length-cls.length-1)
            return true;

        return false;
    },


    __cssDim: function(args, property) {
        args = ICE.$AF(args);
        args.splice(args.length-1, 0, property);
        ICE.$setStyle.apply(null, args);
    },


////
// Position and size
////
    $mousePos: function(e) {
        var posx = 0;
        var posy = 0;
        if (!e) 
            e = window.event;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return {x: posx, y: posy};
    },

   $scrollTop: function(elm) {
        if(!elm) {
            if(document.documentElement && document.documentElement.scrollTop)
                elm = document.documentElement;
            else
                elm = document.body;
        }

        return elm && elm.scrollTop || 0;
    },

    $position: function(elm) {
        if(!elm)
            return {x: 0, y: 0};

        if(elm.scrollLeft)
            return {x: elm.scrollLeft, y: elm.scrollTop};
        else if(elm.clientX)
            return {x: elm.clientX, y: elm.clientY};

        var posObj = {'x': elm.offsetLeft, 'y': elm.offsetTop};

        if(elm.offsetParent) {
            var next = elm.offsetParent;
            while(next) {
                posObj.x += next.offsetLeft;
                posObj.y += next.offsetTop;
                next = next.offsetParent;
            }
        }
        // safari bug
        if (ICE.$isSafari() && elm.style.position == 'absolute' ) {
            posObj.x -= document.body.offsetLeft;
            posObj.y -= document.body.offsetTop;
        }
        return posObj;
    },

    $docSize: function(doc) {
        var D = doc || document;

        var height = Math.max(
            Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
            Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
            Math.max(D.body.clientHeight, D.documentElement.clientHeight)
        )

        var width = Math.max(
            Math.max(D.body.scrollWidth, D.documentElement.scrollWidth),
            Math.max(D.body.offsetWidth, D.documentElement.offsetWidth),
            Math.max(D.body.clientWidth, D.documentElement.clientWidth)
        )
        return {'w': width, 'h': height};
    },

    $winSize: function(doc) {
        doc = doc || document;
        var win_w, win_h;
        if (self.innerHeight) {
            win_w = self.innerWidth;
            win_h = self.innerHeight;
        } else if (doc.documentElement && doc.documentElement.clientHeight) {
            win_w = doc.documentElement.clientWidth;
            win_h = doc.documentElement.clientHeight;
        } else if (doc.body) {
            win_w = doc.body.clientWidth;
            win_h = doc.body.clientHeight;
        }
        return {'w': win_w, 'h': win_h};
    },

    $isOverlapping: function(elm1, elm2) {
        var pos_elm1 = ICE.$position(elm1);
        var pos_elm2 = ICE.$position(elm2);

        var top1 = pos_elm1.y;
        var left1 = pos_elm1.x;
        var right1 = left1 + elm1.offsetWidth;
        var bottom1 = top1 + elm1.offsetHeight;
        var top2 = pos_elm2.y;
        var left2 = pos_elm2.x;
        var right2 = left2 + elm2.offsetWidth;
        var bottom2 = top2 + elm2.offsetHeight;
        var getSign = function(v) {
            if(v > 0) return "+";
            else if(v < 0) return "-";
            else return 0;
        }

        if ((getSign(top1 - bottom2) != getSign(bottom1 - top2)) &&
            (getSign(left1 - right2) != getSign(right1 - left2)))
            return true;
        return false;
    },


////
// HTTP request functions
////
    $request: function(url, method) {
        var req = ICE.$httpReq();

        if(url.match(/^https?:\/\//) === null) {
            if(ICE.BASE_URL !== '') {
                if(ICE.BASE_URL.lastIndexOf('/') != ICE.BASE_URL.length-1)
                    ICE.BASE_URL += '/';
                url = ICE.BASE_URL + url;
            }
        }

        url = url.replace(/([^:]?)\/\//g, '$1/');

        if(!method)
            method = "POST";

        return new ICEDeferred(req, method, url);
    },

    $requestJSON: function(url, method) {
        var d = ICE.$request(url, method);
        var eval_req = function(data, req) {
            var text = req.responseText;
            if(text == "Error")
                d.errback(req);
            else
                return ICE.$eval(text);
        };
        d.addCallback(eval_req);
        return d;
    },

    $httpReq: function() {
        var try_these = [
            function () { return new XMLHttpRequest(); },
            function () { return new ActiveXObject('Msxml2.XMLHTTP'); },
            function () { return new ActiveXObject('Microsoft.XMLHTTP'); },
            function () { return new ActiveXObject('Msxml2.XMLHTTP.4.0'); },
            function () { throw "Browser does not support XMLHttpRequest"; }
        ];
        for (var i = 0; i < try_these.length; i++) {
            var func = try_these[i];
            try {
                return func();
            } catch (e) {
                ICE.$log(e);
            }
        }
    },

    $serialize: function(o) {
        if(window.JSON && window.JSON.stringify)
            return window.JSON.stringify(o);

        var objtype = typeof(o);
        if (objtype == "undefined") {
            return "null";
        } else if (objtype == "number" || objtype == "boolean") {
            return o + "";
        } else if (o === null) {
            return "null";
        }
        if (objtype == "string") {
            return ICE._reprString(o);
        }
        if(objtype == 'object' && o.getFullYear) {
            return ICE._reprDate(o);
        }
        var res, val;
        var me = arguments.callee;
        if (objtype != "function" && typeof(o.length) == "number") {
            res = [];
            for (var i = 0; i < o.length; i++) {
                val = me(o[i]);
                if (typeof(val) != "string") {
                    val = "undefined";
                }
                res.push(val);
            }
            return "[" + res.join(",") + "]";
        }
        // it's a function with no adapter, bad
        if (objtype == "function")
            return null;
        res = [];
        for (var k in o) {
            var useKey;
            if (typeof(k) == "number") {
                useKey = '"' + k + '"';
            } else if (typeof(k) == "string") {
                useKey = ICE._reprString(k);
            } else {
                // skip non-string or number keys
                continue;
            }
            val = me(o[k]);
            if (typeof(val) != "string") {
                // skip non-serializable values
                continue;
            }
            res.push(useKey + ":" + val);
        }
        return "{" + res.join(",") + "}";
    },

    $eval: function(txt) {
        if(!ICE.$isString(txt))
            return txt;

        txt = ICE.$strip(txt); //Strip white space, IE can't handle it

        if(txt.indexOf('new Date(') != -1)
            return (new Function("return " + txt))();

        return window.JSON && window.JSON.parse ?
            window.JSON.parse( txt ) :
            (new Function("return " + txt))();
    },

    $evalScript: function(html) {
        var script_data = html.match(/<script.*?>((\n|\r|.)*?)<\/script>/g);
        if(script_data !== null) {
            for(var i=0; i < script_data.length; i++) {
                var script_only = script_data[i].replace(/<script.*?>/g, "");
                script_only = script_only.replace(/<\/script>/g, "");
                eval(script_only);
            }
        }
    },

    $encode: function(data) {
        var post_data = [];
        for(var k in data)
            post_data.push(k + "=" + ICE.$urlencode(data[k]));
        return post_data.join("&");
    },

    _reprString: function(o) {
        return ('"' + o.replace(/(["\\])/g, '\\$1') + '"'
        ).replace(/[\f]/g, "\\f"
        ).replace(/[\b]/g, "\\b"
        ).replace(/[\n]/g, "\\n"
        ).replace(/[\t]/g, "\\t"
        ).replace(/[\r]/g, "\\r");
    },

    _reprDate: function(date) {
        var year = date.getUTCFullYear();
        var dd = date.getUTCDate();
        var mm = date.getUTCMonth()+1;

        var leadingZero = function(nr) {
            if (nr < 10) nr = "0" + nr;
            return nr;
        }

        return '"' + year + '-' + mm + '-' + dd + 'T' + leadingZero(date.getUTCHours()) + ':' + leadingZero(date.getUTCMinutes()) + ':' + leadingZero(date.getUTCSeconds()) + '"';
    },



////
// Events
////
    //--- window.onload optimization ----------------------------------------------
    _bindReady: function() {
        if ( ICE._ready_bound ) return;
        ICE._ready_bound = true;

        // Mozilla, Opera and webkit nightlies currently support this event
        if ( document.addEventListener ) {
            // Use the handy event callback
            document.addEventListener( "DOMContentLoaded", function(){
                document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
                ICE._ready();
            }, false );

        // If IE event model is used
        } else if ( document.attachEvent ) {
            // ensure firing before onload,
            // maybe late but safe also for iframes
            document.attachEvent("onreadystatechange", function(){
                if ( document.readyState === "complete" ) {
                    document.detachEvent( "onreadystatechange", arguments.callee );
                    ICE._ready();
                }
            });

            // If IE and not an iframe
            // continually check to see if the document is ready
            if ( document.documentElement.doScroll && window == window.top ) (function(){
                if ( ICE._is_ready ) return;

                try {
                    // If IE is used, use the trick by Diego Perini
                    // http://javascript.nwbox.com/IEContentLoaded/
                    document.documentElement.doScroll("left");
                } catch( error ) {
                    setTimeout( arguments.callee, 0 );
                    return;
                }

                // and execute any waiting functions
                ICE._ready();
            })();
        }

        // A fallback to window.onload, that will always work
        ICE.$AEV( window, "load", ICE._ready );
    },

    _ready: function(fn) {
        if(ICE._is_ready)
            return ;

        ICE._is_ready = true;
        ICE.$map(ICE._ready_list, function(fn) {
            fn.call(window);
        });
        ICE._ready_list = [];
    },

    $eventElm: function(e) {
        if(e && !e.type && !e.keyCode)
            return e

        var targ;
        if (!e) 
            e = window.event;
        if (e.target) 
            targ = e.target;
        else if (e.srcElement) 
            targ = e.srcElement;

        if (targ && targ.nodeType == 3) // defeat Safari bug
            targ = targ.parentNode;

        return targ;
    },

    //Shortcut: ICE.$AEV
    $addListener: function(elms, types, handler, listen_once) {
        elms = ICE.$A(elms);
        types = ICE.$A(types);

        ICE.$map(elms, function(elm) {
            if(listen_once)
                handler.listen_once = true;
                
            if (!handler.$f_guid) 
                handler.$f_guid = ICE._f_guid++;

            var events_store = ElementStore.get(elm, '$events');
            if (!events_store) 
                events_store = ElementStore.set(elm, '$events', {});
            
            ICE.$map(types, function(type) {
                var handlers = events_store[type];

                if(elm == window && type == 'load') {
                    ICE._ready_list.push( handler );
                }
                else {
                    if(type == 'lazy_load') {
                        type = 'load';
                    }

                    if (!handlers) {
                        handlers = events_store[type] = {};

                        if(elm["on" + type])
                            handlers[1] = elm["on" + type];
                    }
                    
                    handlers[handler.$f_guid] = handler;

                    elm["on" + type] = ICE._handleEvent;
                }
            });

            elm = null;
        });
    },

    _handleEvent: function(event) {
         var me = this;

         event = event || window.event;

         if(!event)
             return ;

         if(!event.ctrl) {
             ICE._setEventKey(event);
         }

         var events = ElementStore.get(this, '$events');
         if(!events)
             return ;

         var handlers = events[event.type];

         var handlers_to_delete = [];
         var res = true;
         for (var i in handlers) {
             var handler = handlers[i];

             if(handler == ICE._handleEvent)
                 continue;

             res = handler.apply(me, [event]);

             if(handler.listen_once)
                 handlers_to_delete.push(handler);
         }

        if(handlers_to_delete.length > 0)
            ICE.$map(handlers_to_delete, function(handler) {
                delete handlers[handler.$f_guid];
            });

        return res;
    },

    //Shortcut: ICE.$REV
    $removeListener: function(elms, type, handler) {
        elms = ICE.$A(elms);
        ICE.$map(elms, function(elm) {
            var events_store = ElementStore.get(elm, '$events');
            if (events_store && events_store[type]) {
                delete events_store[type][handler.$f_guid];
            }
        });
    },

    $removeAllListeners: function(elms, type) {
        elms = ICE.$A(elms);
        ICE.$map(elms, function(elm) {
            var events_store = ElementStore.get(elm, '$events');
            if (events_store && events_store[type]) {
                delete events_store[type];
            }
        });
    },

    $preventDefault: function(e) {
        e = e || window.event;
        if(!e)
            return ;
        if(ICE.$isIe()) 
            e.returnValue = false;
        else 
            e.preventDefault();
    },

    $stopPropagation: function(e) {
        e = e || window.event;
        if(ICE.$isIe()) 
            e.cancelBubble = true;
        else
            e.stopPropagation();
    },

    //Shortcut: ICE.$b
    $bind: function(fn, scope, /*optional*/ extra_args) {
        fn._cscope = scope;
        return ICE._getRealScope(fn, extra_args);
    },

    $bindMethods: function(self) {
        for (var k in self) {
            var func = self[k];
            if (typeof(func) == 'function') {
                self[k] = ICE.$bind(func, self);
            }
        }
    },

    _setEventKey: function(e) {
        if(!e)
            e = window.event;

        var key_code;
        if(e.which)
            key_code = e.which;
        else if(e.keyCode)
            key_code = e.keyCode;
        else
            key_code = e.charCode;

        e.keyAscii = e.key = e.keyCode = key_code;

        e.ctrl = e.ctrlKey;

        if(ICE.$isMac() && e.metaKey)
            e.ctrl = e.metaKey;
        e.alt = e.altKey;
        e.meta = e.metaKey;
        e.shift = e.shiftKey;
    },


    _listenOnce: function(elm, type, fn) {
        var r_fn = function() {
            ICE.$removeListener(elm, type, r_fn);
            fn(arguments);
        }
        return r_fn;
    },

    _getRealScope: function(fn, /*optional*/ extra_args) {
        extra_args = ICE.$A(extra_args);
        var scope = fn._cscope || window;

        return function() {
            var args = ICE.$AF(arguments).concat(extra_args);
            return fn.apply(scope, args);
        };
    },


////
// Misc.
////
    $keys: function(obj) {
        var rval = [];
        for (var prop in obj) {
            rval.push(prop);
        }
        return rval;
    },

    $values: function(obj) {
        var rval = [];
        for (var prop in obj) {
            rval.push(obj[prop]);
        }
        return rval;
    },

    $urlencode: function(str) {
        return encodeURIComponent(ICE.$defined(str) && str.toString() || '');
    },

    $urldecode: function(str) {
        var result = decodeURIComponent(ICE.$defined(str) && str.toString() || '');
        return result.replace(/\+/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    },

    $defined: function(o) {
        return (o != "undefined" && o != null)
    },

    $isArray: function(obj) {
        try {
            return obj instanceof Array;
        }
        catch(e) {
            return false;
        }
    },

    $isString: function(obj) {
        return (typeof obj == 'string');
    },

    $isNumber: function(obj) {
        return (typeof obj == 'number');
    },

    $isObject: function(obj) {
        return (typeof obj == 'object');
    },

    $isFunction: function(obj) {
        return (typeof obj == 'function');
    },

    $isBoolean: function(obj) {
        return obj === true || obj === false;
    },

    $isDict: function(o) {
        var str_repr = String(o);
        return str_repr.indexOf(" Object") != -1;
    },

    _exportToGlobalScope: function(scope) {
        scope = scope || window;
        for(var e in ICE) {
            if(e.indexOf('_') !== 0 && e != 'addEventListener' &&
               e != 'fx' && e != 'dnd') {
                scope[e] = ICE[e];
            }
        }
    },

    $log: function(o) {
        try {
            if(window._firebug)
                window._firebug.log(o);
            else if(window.console)
                console.log(o);
        }
        catch(e) {
        }
    },

    $strip: function(str) {
        return str.replace(/^\s+/, '').replace(/\s+$/g, '');
    },

    $trim: function(str, limit, delim) {
        if(str.length > limit) {
            return str.substring(0, limit) + (delim || '...');
        }
        return str;
    },

    $preload: function(/*img_src1, ..., img_srcN*/) {
        var args = ICE.$AF(arguments);
        ICE.$AEV(window, 'load', function() {
            ICE.$map(args, function(src) {
                var pic = new Image();
                pic.src = src;
            });
        });
    },

    _parseTagClassName: function(tag_name, class_name) {
        if(tag_name && tag_name.indexOf('.') != -1) {
            var sp = tag_name.split('.');
            tag_name = ICE.$strip(sp[0]);
            class_name = ICE.$strip(sp[1]);
        }

        return [tag_name, class_name || null];
    }

}



////
// Shorcuts
////
ICE.$ = ICE.$get;
ICE.$f = ICE.$form;
ICE.$b = ICE.$bind;
ICE.$p = ICE.$partial;
ICE.$gp = ICE.$parent;
ICE.$gc = ICE.$child;

ICE.$A = ICE.$arrayCreate;
ICE.$AF = ICE.$arrayForce;
ICE.$ATT = ICE.$addToTop;
ICE.$AEV = ICE.$addListener;
ICE.$REV = ICE.$removeListener;

ICE._createDomShortcuts();



////
// Class
////
ICE.Class = function(members) {
    var fn = function() {
        if(arguments[0] != 'no_init') {
            return this.init.apply(this, arguments);
        }
    }
    fn.prototype = members;
    ICE.$update(fn, ICE.Class.prototype);
    return fn;
}
ICE.Class.prototype = {
    extend: function(members) {
        var parent = new this('no_init');
        for(var k in members) {
            var prev = parent[k];
            var cur = members[k];
            if (prev && prev != cur && typeof cur == 'function') {
                cur = this._parentize(cur, prev);
            }
            parent[k] = cur;
        }
        return new ICE.Class(parent);
    },

    implement: function(members) {
        ICE.$update(this.prototype, members);
    },

    _parentize: function(cur, prev) {
        return function(){
            this.parent = prev;
            return cur.apply(this, arguments);
        }
    }
}



////
// Effects library
////
ICE.fx = {

    _shades: {0: 'ffffff', 
              1: 'ffffee',
              2: 'ffffdd',
              3: 'ffffcc',
              4: 'ffffbb',
              5: 'ffffaa',
              6: 'ffff99'},

    highlight: function(elm, options, shades) {
        if(!elm)
            return;

        if(!shades)
            shades = ICE.fx._shades;

        var base = new ICE.fx.Base(elm);
        base.options.duration = 600;
        base.setOptions(options);

        ICE.$update(base, {
            increase: function() {
                var min = Math.floor(this.now);
                if(min === 0)
                    elm.style.backgroundColor = '';
                else
                    elm.style.backgroundColor = '#' + shades[min];
            }
        });
        return base.custom(6, 0);
    },

    fadeIn: function(elm, options) {
        options = options || {};
        if(!options.from) {
            options.from = 0;
            ICE.$setOpacity(elm, 0);
        }

        if(!options.to) 
            options.to = 1;

        var s = new ICE.fx.Style(elm, 'opacity', options);
        return s.custom(options.from, options.to);
    },

    fadeOut: function(elm, options) {
        options = options || {};
        if(!options.from)
            options.from = 1;
        if(!options.to)
            options.to = 0;
        if(!options.duration)
            options.duration = 300;
        var s = new ICE.fx.Style(elm, 'opacity', options);
        return s.custom(options.from, options.to);
    },
    
    setWidth: function(elm, options) {
        var s = new ICE.fx.Style(elm, 'width', options);
        return s.custom(options.from, options.to);
    },

    setHeight: function(elm, options) {
        var s = new ICE.fx.Style(elm, 'height', options);
        return s.custom(options.from, options.to);
    }
}

$fx = ICE.fx;


//From moo.fx
ICE.fx.Base = new ICE.Class({

    init: function(elm, options) {
        this.options = {
            onStart: function(){},
            onComplete: function(){},
            transition: ICE.fx.Transitions.sineInOut,
            duration: 500,
            wait: true,
            fps: 50
        };

        ICE.$update(this.options, options);
        ICE.$bindMethods(this);
        this.elm = elm;

        if(elm && elm._fx_running)
            elm._fx_end = true;
    },

    setOptions: function(options){
        ICE.$update(this.options, options);
    },

    step: function() {
        if(!this.elm) {
            this.clearTimer();
            return;
        }

        var time = new Date().getTime();

        if (time < this.time + this.options.duration){
            this.cTime = time - this.time;
            this.setNow();
            this.elm._fx_running = true;
        } 
        else {
            if(this.options.onComplete)
                setTimeout($b(this.options.onComplete, this, [this.elm]), 10);

            if(this.elm._fx_end)
                delete this.elm._fx_end;
            if(this.elm._fx_running)
                delete this.elm._fx_running;
            this.clearTimer();
            this.now = this.to;
        }

        this.increase();
    },

    setNow: function(){
        this.now = this.compute(this.from, this.to);
    },

    compute: function(from, to){
        var change = to - from;
        return this.options.transition(this.cTime, from, change, this.options.duration);
    },

    clearTimer: function() {
        clearInterval(this.timer);
        this.timer = null;
        return this;
    },

    _start: function(from, to){
        if (!this.options.wait) this.clearTimer();
        if (this.timer) return;
        setTimeout($p(this.options.onStart, this.elm), 10);
        this.from = from;
        this.to = to;
        this.time = new Date().getTime();
        this.timer = setInterval(this.step, Math.round(1000/this.options.fps));
        return this;
    },

    custom: function(from, to){
        return this._start(from, to);
    },

    set: function(to){
        this.now = to;
        this.increase();
        return this;
    },

    setStyle: function(elm, property, val) {
        if(this.property == 'opacity')
            ICE.$setOpacity(elm, val);
        else
            ICE.$setStyle(elm, property, val);
    }
});


ICE.fx.Style = ICE.fx.Base.extend({

    init: function(elm, property, options) {
        this.parent(elm);
        this.elm = elm;
        this.setOptions(options);
        this.property = property;
    },

    increase: function(){
        this.setStyle(this.elm, this.property, this.now);
    }
});


ICE.fx.Styles = ICE.fx.Base.extend({
    init: function(elm, options){
        this.parent(elm);
        this.elm = ICE.$(elm);
        this.setOptions(options);
        this.now = {};
    },

    setNow: function(){
        for (var p in this.from) 
            this.now[p] = this.compute(this.from[p], this.to[p]);
    },

    custom: function(obj){
        if (this.timer && this.options.wait) return;
        var from = {};
        var to = {};
        for (var p in obj){
            from[p] = obj[p][0];
            to[p] = obj[p][1];
        }
        return this._start(from, to);
    },

    increase: function(){
        for (var p in this.now) this.setStyle(this.elm, p, this.now[p]);
    }
});


//Transitions (c) 2003 Robert Penner (http://www.robertpenner.com/easing/), BSD License.
ICE.fx.Transitions = {
    linear: function(t, b, c, d) { return c*t/d + b; },
    sineInOut: function(t, b, c, d) { return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b; }
};


// Scroll to element
ICE.fx.scrollToCls = ICE.fx.Base.extend({
    init: function(elm, options) {
        this.opts = {};

        if(options)
            ICE.$update(this.opts, options);

        this.elm = elm || window;
        this.parent(this.elm);
    },
    increase: function() {
        if(this.opts && this.opts.useScrollTop)
            this.elm.scrollTop = parseInt(this.now);
        else
            this.elm.scrollTo(0, this.now);
    }
});

ICE.fx.scrollToPos = function(scroll_top) {
    (new ICE.fx.scrollToCls()).custom(ICE.$scrollTop(),
                                      scroll_top);
}

ICE.fx.scrollToElm = function(elm, y_offset) {
    if(y_offset === undefined)
        y_offset = 0;
    ICE.fx.scrollToPos(ICE.$position(elm).y + y_offset);
}



////
// Drag and drop
////
ICE.Drag = ICE.Class({

    current_handler: null, //The element that acts as handler
    current_root: null, //The element that acts as root

    last_mouse_x: 0,
    last_mouse_y: 0,

    init: function() {
        ICE.$bindMethods(this);
    },

    dragAble: function(root, kws) {
        kws = kws || {};
        var handler = kws.handler || root;
        handler = ICE.$(handler);

        if(handler._start_fn)
            ICE.dnd.removeDragAble(handler);

        handler._kws = kws;
        handler._root = ICE.$(root);

        handler._start_fn = function(ev) {
            ICE.dnd._start(handler, ev);
            ICE.$preventDefault(ev);
            return false;
        }

        ICE.$AEV(handler, 'mousedown', handler._start_fn);
    },

    removeDragAble: function(elm) {
        if(elm._start_fn)
            ICE.$REV(elm, 'mousedown', elm._start_fn);
    },

    /* There is a bug if the root has marginLeft */
    recalculateMarginLeft: function() {
        /* There is a bug if the root has marginLeft */
        this.root_margin_left = ICE.$getStyle(this.current_root, 'marginLeft') || 0;
        if(this.root_margin_left)
            this.root_margin_left = parseInt(this.root_margin_left);
    },

    //--- Private functions ----------------------------------------------
    _start: function(handler, ev) {
        // Only one at a time
        if(this.current_handler)
            return ;

        this.current_handler = handler;
        var root = this.current_root = handler._root;

        this.last_mouse_pos = ICE.$mousePos(ev);

        ICE.$setVisibility(root, false);

        this.old_z_index = root.style.zIndex;

        root.style.zIndex = 1000;

        this.recalculateMarginLeft();

        if(handler._kws.on_start)
            handler._kws.on_start(ev);

        ICE.$setVisibility(root, true);

        ICE.$AEV(document, 'mousemove', this._move);
        ICE.$AEV(document, 'mouseup', this._end);
    },

    _move: function(ev) {
        var handler = this.current_handler;
        if(!handler)
            return false;

        var root = this.current_root;
        var kws = handler._kws;

        var cur_mouse_pos = ICE.dnd.mouse_pos = ICE.$mousePos(ev);
        var last_mouse_pos = this.last_mouse_pos;

        var new_x = (cur_mouse_pos.x - last_mouse_pos.x);
        var new_y = (cur_mouse_pos.y - last_mouse_pos.y);

        var abs = ICE.$position(root);
        new_y += parseInt(root.style.top) || abs.y;
        new_x += parseInt(root.style.left) || abs.x;

        if(kws.move_filter) {
            var vals = kws.move_filter(new_x, new_y);
            new_x = vals[0];
            new_y = vals[1];
        }

        if(kws.move_x !== false)
            ICE.$setLeft(root, new_x);

        if(kws.move_y !== false)
            ICE.$setTop(root, new_y);

        if(kws.on_drag)
            kws.on_drag(new_x, new_y, ev);

        this.last_mouse_pos = cur_mouse_pos;

        //Moving scroll to the top, should move the scroll up
        if(kws.scroll_on_overflow !== false) {
            var sc_top = ICE.$scrollTop();
            var sc_bottom = sc_top + ICE.$winSize().h;
            var d_e_top = ICE.$position(root).y;
            var d_e_bottom = root.offsetTop + root.offsetHeight;

            if(d_e_top <= sc_top + 70)
                window.scrollBy(0, -30);
            else if(d_e_bottom >= sc_bottom - 70)
                window.scrollBy(0, 30);
        }

        ICE.$preventDefault(ev);
        return false;
    },

    _end: function(ev) {
        var root = this.current_root;
        var handler = this.current_handler;

        ICE.$REV(document, 'mousemove', this._move);
        ICE.$REV(document, 'mouseup', this._end);

        if(handler._kws.on_end)
            handler._kws.on_end();

        this.current_handler = null;
        this.current_root = null;

        root.style.zIndex = this.old_z_index;

        ICE.$preventDefault(ev);
        return false;
    }
});

ICE.dnd = new ICE.Drag();
$dnd = ICE.dnd;



////
// Element store
////
ElementStore = {

    storage_dict: {},
    uuid: 1,
    expando: 'ElementStore' + (new Date()).getTime(),

    get: function(elm, key) {
        return ElementStore.getStore(elm)[key] || null;
    },

    set: function(elm, key, value) {
        ElementStore.getStore(elm)[key] = value;
        return value;
    },

    has: function(elm, key) {
        return ElementStore.getStore(elm)[key] !== undefined;
    },

    remove: function(elm, key) {
        if(!elm)
            return;

        if(key !== undefined) {
            var store = ElementStore.getStore(elm);
            if(store[key])
                delete store[key];
        }
        else {
            var elm_id = elm[ElementStore.expando];
            if(elm_id) {
                delete ElementStore.storage_dict[elm_id];
                elm[ElementStore.expando] = null;
            }
        }
    },

    getStore: function(elm) {
        var expando = ElementStore.expando;
        var storage_dict = ElementStore.storage_dict;
        var elm_id = elm[expando];

        if(!elm_id) {
            elm_id = elm[expando] = ElementStore.uuid++;
            storage_dict[elm_id] = {};
        }

        return storage_dict[elm_id];
    }

}


////
// Deferred object
////
ICEDeferred = function(req, method, url) {
    this.callbacks = [];
    this.errbacks = [];
    this.req = req;
    this.http_method = method;
    this.http_url = url;
}
ICEDeferred.prototype = {
    excCallbackSeq: function(req, array) {
        var data = req.responseText;

        if(ICE.generalCallback) {
            data = generalCallback(req, array, this);
            if(!data)
                return ;
        }

        while (array.length > 0) {
            var fn = array.pop();
            var new_data = fn(data, req);
            if(new_data)
                data = new_data;
            else if(new_data === false)
                break;
        }
    },

    callback: function () {
        this.excCallbackSeq(this.req, this.callbacks);
    },

    errback: function() {
        if(ICE.generalErrorback) {
            var result = ICE.generalErrorback(this.req, this);
            if(result)
                return ;
        }

        if(this.errbacks.length === 0) {
            var txt = this.req.responseText.substring(0, 200);
            if(ICE.$strip(txt) && txt.indexOf("<html") == -1) {
                alert("Error encountered:\n" + txt);
            }
        }

        this.excCallbackSeq(this.req, this.errbacks);
    },

    addErrback: function(fn) {
        this.errbacks.unshift(fn);
    },

    addCallback: function(fn) {
        this.callbacks.unshift(fn);
    },

    abort: function() {
        this.req.abort();
    },

    addCallbacks: function(fn1, fn2) {
        if(fn1)
            this.addCallback(fn1);
        if(fn2)
            this.addErrback(fn2);
    },

    _onreadystatechange: function () {
        var req = this.req;
        var d = this;

        if (req.readyState == 4) {
            var status = '';

            try {
                status = req.status;
            }
            catch(e) {
            }

            if(status == 200 || status == 304 || req.responseText === null) {
                this.callback();
            }
            else {
                this.errback();
            }
        }
    },

    sendReq: function(data, async) {
        if (async !== false) {
            async = true;
        }
        var req = this.req;
        var http_method = this.http_method;
        var http_url = this.http_url;

        if(ICE.annotateAjaxData.length > 0) {
            ICE.$map(ICE.annotateAjaxData, function(cb) {
                cb(data, http_url, http_method);
            });
        }

        if(http_method == 'POST') {
            req.open(http_method, http_url, async);
            req.onreadystatechange = ICE.$bind(this._onreadystatechange, this);
            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            if(ICE.$isObject(data)) {
                req.send(ICE.$encode(data));
            }
            else if(ICE.$defined(data))
                req.send(data);
            else {
                req.send('');
            }
        }
        else {
            req.open("GET", http_url, async)
            req.onreadystatechange = ICE.$bind(this._onreadystatechange, this);
            req.send(null);
        }

    }
};


if(window.ICE_EXPORT_TO_SCOPE)
    ICE._exportToGlobalScope(ICE_EXPORT_TO_SCOPE);

ICE._bindReady();
}
