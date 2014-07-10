function insert(word, node) {
    var c = word[0];
    var remain = word.slice(1);
    if (!(c in node)) {
        node[c] = {};
    }
    if (remain) {
        insert(word.slice(1), node[c]);
    } else {
        node[c]['end'] = true;
    }
}

function makeTree(data) {
    var root = {};
    for (var word in data) {
        insert(word, root);
    }
    return root;
}

function traverse(prefix, node) {
    //prefix MUST have something in it
    if (!prefix) {
        return node;
    } else if (prefix[0] in node) {
        return traverse(prefix.slice(1), node[prefix[0]]);
    }
}

function makeList(prefix, node) {
    var words = [];
    for (var key in node) {
        if (node.hasOwnProperty(key)){
            if (key == 'end') {
                words.push(prefix);
            } else {
                words = words.concat(makeList(prefix + key, node[key]));
            }
        }
    }

    return words;

}

function getList (prefix, root) {
    if (prefix) {
        var node = traverse(prefix, root);
        return makeList(prefix, node);
    } else {
        return [];
    }
    
}

function toHtml(a, r) {
    return a + '<br>' + r;
}

$( document ).ready(function () {
    function initalizePage(dict) {
        var root = {}
        makeTree(dict, root);
        $("input").on("keyup", function () {
            var t = getList($(this).val(), root);
            $("#output")
                .html(t.slice(0,10).reduce(toHtml, ""));
                
        });    
    }

    $.ajax({
        url: "/sowpods.txt",
        success: function(data) {
            var dict = data.split('\n');
            initalizePage(dict);
        },
        dataType: "text"    
    });
});
