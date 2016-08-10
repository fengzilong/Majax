(function(root){
	var RuleManager = {
		PatternTypes: {
			wildcard: "wildcard",
			regexp: "regexp"
		},
		wildcardToRegexp: function( pattern ) {
			pattern = pattern.replace(/([\\\+\|\{\}\[\]\(\)\^\$\.#])/g, "\\$1");
			pattern = pattern.replace(/\*/g, ".*");
			pattern = pattern.replace(/\?/g, ".");
			return pattern;
		},
		ruleToExpr: function( rule ) {
			var urlPattern = rule.urlPattern || "";

			// Check Non-ASCII chars
			for (var i = 0; i < urlPattern.length; i++) {
				var code = urlPattern.charCodeAt(i);
				if (code >= 128) {
					alert('Invalid non-ASCII char "' + urlPattern[i] + '" (U+' + code.toString(16).toUpperCase() + ')' + " in " + urlPattern);
					return '(false)';
				}
			}

			if (rule.patternType == RuleManager.PatternTypes.wildcard) {
				if (urlPattern[0] == "@")
					urlPattern = urlPattern.substring(1);
				else {
					if (urlPattern.indexOf("://") <= 0 && urlPattern[0] != "*")
						urlPattern = "*" + urlPattern;

					if (urlPattern[urlPattern.length - 1] != "*")
						urlPattern += "*";
				}
			}
			// just declare to see whether regular expression rule is valid
			try {
				if (rule.patternType == RuleManager.PatternTypes.regexp) {
					new RegExp(urlPattern);
				} else {
					new RegExp(RuleManager.wildcardToRegexp(urlPattern));
				}
			} catch (e) {
				alert("Invalid " + (rule.patternType == RuleManager.PatternTypes.regexp ? "regular expression" : "wildcard") + " : " + urlPattern);
				return '(false)';
			}

			var matchFunc = (rule.patternType == RuleManager.PatternTypes.regexp ? "regExpMatch" : "shExpMatch");
			var script = "(";
			script += matchFunc + "(url, " + JSON.stringify(urlPattern) + ")";
			if (rule.patternType != RuleManager.PatternTypes.regexp) {
				var urlPattern2 = null;
				if (urlPattern.indexOf("://*.") > 0) urlPattern2 = urlPattern.replace("://*.", "://");
				else if (urlPattern.indexOf("*.") == 0) urlPattern2 = "*://" + urlPattern.substring(2);

				if (urlPattern2) {
					script += " || shExpMatch(url, " + JSON.stringify(urlPattern2) + ")";
				}
			}

			return script + ")";
		},
		generatePacScript: function( rules ) {
			var script = "";

			script += `
				function regExpMatch(url, pattern) {
					try {
						return new RegExp( pattern ).test( url );
					} catch(ex) {
						return false;
					}
				}
				function FindProxyForURL( url ) {
			`;

			var proxy;

			rules.forEach(function( rule ) {
				var expr = RuleManager.ruleToExpr( rule );
				if( rule.proxy ) { // predefined proxy (see |generateAutoPacScript|)
					proxy = rule.proxy;
				} else {
					//TODO
					proxy = '"PROXY 127.0.0.1:8887"';
				}
				script += `
					if${expr} {
						return ${proxy};
					}
				`;
			});

			script += `
					return "DIRECT";
				}
			`;

			return script;
		}
	};

	root.RuleManager = RuleManager;
})(this);
