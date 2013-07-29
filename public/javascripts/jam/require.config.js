var jam = {
    "packages": [
        {
            "name": "backbone",
            "location": "javascripts/jam/backbone",
            "main": "backbone.js"
        },
        {
            "name": "backbone-localStorage",
            "location": "javascripts/jam/backbone-localStorage",
            "main": "main.js"
        },
        {
            "name": "jquery",
            "location": "javascripts/jam/jquery",
            "main": "dist/jquery.js"
        },
        {
            "name": "underscore",
            "location": "javascripts/jam/underscore",
            "main": "underscore.js"
        }
    ],
    "version": "0.2.17",
    "shim": {
        "backbone": {
            "deps": [
                "underscore",
                "jquery"
            ],
            "exports": "Backbone"
        },
        "underscore": {
            "exports": "_"
        }
    }
};

if (typeof require !== "undefined" && require.config) {
    require.config({
    "packages": [
        {
            "name": "backbone",
            "location": "javascripts/jam/backbone",
            "main": "backbone.js"
        },
        {
            "name": "backbone-localStorage",
            "location": "javascripts/jam/backbone-localStorage",
            "main": "main.js"
        },
        {
            "name": "jquery",
            "location": "javascripts/jam/jquery",
            "main": "dist/jquery.js"
        },
        {
            "name": "underscore",
            "location": "javascripts/jam/underscore",
            "main": "underscore.js"
        }
    ],
    "shim": {
        "backbone": {
            "deps": [
                "underscore",
                "jquery"
            ],
            "exports": "Backbone"
        },
        "underscore": {
            "exports": "_"
        }
    }
});
}
else {
    var require = {
    "packages": [
        {
            "name": "backbone",
            "location": "javascripts/jam/backbone",
            "main": "backbone.js"
        },
        {
            "name": "backbone-localStorage",
            "location": "javascripts/jam/backbone-localStorage",
            "main": "main.js"
        },
        {
            "name": "jquery",
            "location": "javascripts/jam/jquery",
            "main": "dist/jquery.js"
        },
        {
            "name": "underscore",
            "location": "javascripts/jam/underscore",
            "main": "underscore.js"
        }
    ],
    "shim": {
        "backbone": {
            "deps": [
                "underscore",
                "jquery"
            ],
            "exports": "Backbone"
        },
        "underscore": {
            "exports": "_"
        }
    }
};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}