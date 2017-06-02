var _ = require('underscore');

// http://www.houzz.com/emerson?foo=1&bar=2&foo=3&decipher=zzno%C9%A5
// out: { foo: [1,3], bar: 2, deciper: zznoɥ }

var queryParams = function(url) {
  var urlParts = url.split('?'),
      queryParams,
      params,
      queryParamsObj = {};

  if (!urlParts[1]) {
    return null;
  }

  queryParams = urlParts[1]; // foo=1&bar=2&foo=3&decipher=zzno%C9%A5
  params = queryParams.split('&'); // ['foo=1', 'bar=2', 'decipher=zz..'];

  for (var i = 0; i < params.length; i += 1) {
    var = params[i].split('=');

    // foo: 1, bar: 2
    // foo: [1,3],
    if (queryParamsObj[param[0]]) {

       if (_.isArray(queryParamsObj[param[0]])) {
         queryParamsObj[param[0]].push(decodeURIComponent(param[1]));
       } else {
         queryParamsObj[param[0]] = [queryParamsObj[param[0]], decodeURIComponent(param[1])];
       }

    } else {
       queryParamsObj[param[0]] = decodeURIComponent(param[1]);
    }
  }


  return queryParamsObj;
}

//console.log(queryParams('http://www.houzz.com/emerson?foo=1&bar=2&foo=3&decipher=zzno%C9%A5'));


// out: [1 , 2, 3, 4, 5, 6, 7]
var nested = [1, [2], [3,4], [[5, [6]]], 7];

var flattenArray = function(arr) {
  var flattenedArray = [],
      arrLength = arr.length,
      current,
      i;

  for (i = 0; i < arrLength; i += 1) {
    current = arr[i];

    if (_.isArray(current)) {
      flattenedArray = flattenedArray.concat(flattenArray(current));
    } else {
      flattenedArray.push(current);
    }
  }

  return flattenedArray;
}

var x = flattenArray([1, [2], [3,4], [[5, [6]]], 7]);
console.log(x);

// http://caolan.github.io/async/docs.html#parallel
//
// parallel(tasks, callbackopt)
//
// Run the tasks collection of functions in parallel, without waiting until the previous function has completed.
// If any of the functions pass an error to its callback, the main callback is immediately called with the value of
// the error. Once the tasks have completed, the results are passed to the final callback as an array.
//
// Note: parallel is about kicking-off I/O tasks in parallel, not about parallel execution of code.
// If your tasks do not use any timers or perform any I/O, they will actually be executed in series.
// Any synchronous setup sections for each task will happen one after the other. JavaScript remains single-threaded.
//
// Parameters:
//   tasks    { Array | Iterable | Object }  A collection containing functions to run.
//                                           Each function is passed a callback(err, result) which it must call on
//                                           completion with an error err (which can be null) and an optional result value.
//
//   callback { function <optional> }        An optional callback to run once all the functions have completed
//                                           successfully. This function gets a results array (or object) containing all
//                                           the result arguments passed to the task callbacks.
//                                           Invoked with (err, results).
//
// Returns: undefined
//
// parallel([
//     function(callback) {
//         setTimeout(function() {
//             callback(null, 'one');
//         }, 200);
//     },
//     function(callback) {
//         setTimeout(function() {
//             callback(null, 'two');
//         }, 100);
//     }
// ],
// // optional callback
// function(err, results) {
//     // the results array will equal ['one','two'] even though
//     // the second function had a shorter timeout.
// });
//

var parallel = function(fns, doneCallback) {
    if (!fns.length) {
        return;
        // maybe call erro callback
    }
    var i,
        fnsLength = fns.length,
        count = 0,
        hasError = false,
        results = [];

    var callBackFunc = function(index, err, result) {
        if (hasError) {
            return;
        }

        if (err) {
            hasError = true;
            doneCallback(err, null);
        } else {

            // results.push(result);
            results[index] = result;
            count += 1;

            if (count === fnsLength) {
                doneCallback(null, results)
            }
        }
    };

    for (i = 0; i < fnsLength; i += 1) {

        (function(index) {
            fns[index](callBackFunc.bind(null, index));
        }(i));
    }

    // doneCallback(null, results);
}

parallel([
    function(callback) {
        setTimeout(function() {
            callback(null, 'one');
        }, 200);
    },
    function(callback) {
        setTimeout(function() {
            callback(null, 'two');
        }, 100);
    }
],
// optional callback
function(err, results) {
    // the results array will equal ['one','two'] even though
    // the second function had a shorter timeout.
    if (err) {
        console.log('There was an error: ', err);
    } else {
        console.log('Results: ', results);
    }
});

/*
 * Define a function that finds a substring
 *
 * Example: contains('foo', 'foobar'); -> true
 *          contains('baz', 'foobar'); -> false
 * @param {String} A string to search for.
 * @param {String} A string to search within.
 */

function contains(needle, haystack) {
    var needleLen = needle.length;
    var haystackLen = haystack.length;
    var hasSubStr = true;

    if (needleLen > needleLen) {
       return false;
    }

    for (var i = 0; i < haystackLen; i++) {
        hasSubStr = true;
        for (var j = 0; j < needleLen; j++) {
            // console.log("Needle: " + needle[j]);
            // console.log("Haystack: " +haystack[i + j]);
            if (needle[j] != haystack[i + j]) {
               hasSubStr = false;
               break;
            }
        }

        if (hasSubStr)
            break;
    }
    return hasSubStr;
}

console.log(contains('foo', 'foobar'));
console.log(contains('baz', 'foobar'));
console.log(contains('bafoobaz', 'foobar'));
console.log(contains('baz', 'foobazbar'));
console.log(contains('bccd', 'bccd'));
console.log(contains('bba', 'bba'));

// Added to the string prototype
String.prototype.contains = function(needle) {
var self = this;
var length = self.length;
var needleLen = needle.length;
     var hasSubStr = true;

     if (needleLen > length) {
        return false;
     }

     for (var i = 0; i < length; i++) {
         hasSubStr = true;
         for (var j = 0; j < needleLen; j++) {
             // console.log("Needle: " + needle[j]);
             // console.log("Haystack: " +haystack[i + j]);
             if (needle[j] != self[i + j]) {
                hasSubStr = false;
                break;
             }
          }

         if (hasSubStr) {
             break;
}
}
     return hasSubStr;
};

console.log('foobar'.contains('foo'));
console.log('foobar'.contains('baz'));
console.log('foobar'.contains('bafoobaz'));
console.log('foobar'.contains('baz'));
console.log('foobar'.contains('bccd'));
console.log('foobar'.contains('bba'));


// Practice
(function($, require) {
    var buildVersion = require('build-version').version.split('.'),
        minVersion = '1.24.1908.0'.split('.'),
        msg = 'Hello world';

    if (buildVersion.length === 4 && minVersion.length === 4) {

        if (buildVersion[0] < minVersion[0] || buildVersion[1] < minVersion[1] || buildVersion[2] < minVersion[2]) {
            $('.a2s-list-container').first().prepend(msg);
        }
    }

}($, require));

(function(width, height) {

    console.log(width + 'x' + height);

}(600, 900));

(function(width, height) {

    var initObj = {

        max_width: 0,

        max_height: 0,

        _gimmeMax: function() {
            console.log(this.max_width + 'x' + this.max_height);
        },

        init: function(w, h) {
            this.max_width = w;
            this.max_height = h;

            this._gimmeMax();
        }
    };

    initObj.init(width, height);

}(600, 900));

({
    max_width: 0,

    max_height: 0,

    _gimmeMax: function() {
        console.log(this.max_width + 'x' + this.max_height);
    },

    init: function(w, h) {
        this.max_width = w;
        this.max_height = h;

        this._gimmeMax();
    }

}).init(600, 900);


var util = {
    addEvent: function(fn) {
        console.log('Checking for support');
        if (window.addEventListener) {
            console.log('Supports addEventListener');

            this.addEvent = function(fn) {
                console.log('Calling addEventListener');
                fn();
            };

        } else {
            console.log('Does not support addEventListener');
        }
    },

    removeEvent: function(fn) {
        console.log('Checking for support');

        if (window.removeEventListener) {
            console.log('Supports removeEventListener');

            this.removeEvent = function(fn) {
                console.log('Calling removeEventListener');
                fn();
            };
        } else {
            console.log('Does not support removeEventListener');
        }
    }
};

function addClickEvent() {
    console.log('Clicked added');
}

function removeClickEvent() {
    console.log('Clicked removed');
}


// Currying
function add(x, y) {

    var oldx = x,
        oldy = y;

    if (typeof oldy === 'undefined') {
        return function(newy) {
            return oldx + newy;
        }
    }

    return x + y;
}

add(2, 5);
add(4)
add(5)(6);

var add_10 = add(10);
add_10(30);

// Static Methods
var Person = function(name) {
    this.name = name;

    this.isAnimal = function() {
        return false;
    }
}

Person.isHuman = function() {
    return true;
}

Person.prototype.getName = function() {
    return this.name;
}

// Classical Inheritance
function inherit(C, P) {
    C.prototype = new P();
}

function Parent(name) {
    this.name = name || 'Luis';
}

Parent.prototype.say = function() {
    return this.name;
};

function Child(name) {}

inherit(Child, Parent);

var kid = new Child();
