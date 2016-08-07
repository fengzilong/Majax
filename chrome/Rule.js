(function(){
	var generateID = function( prefix ) {
		prefix = prefix || "rule"
		return String( Math.random() + Math.random() ).replace( /\d\.\d{4}/, prefix )
	};
	
	function Rule( name, urlPattern, patternType ){
		this.id = generateID();
		this.name = name;
		this.urlPattern = urlPattern;
		this.patternType = patternType;
	}

	Rule.prototype = {
		constructor: Rule,
		toJSON: function(){
			return {
				id: this.id,
				name: this.name,
				urlPattern: this.urlPattern,
				patternType: this.patternType
			};
		}
	};
})();