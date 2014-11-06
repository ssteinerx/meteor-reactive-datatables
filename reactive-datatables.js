ReactiveDatatable = function (options, id) {
	// Use the base id they passed one in, otherwise 'datatable'
	var tableID = id || "datatable";

	// TODO: ss -- November 5, 2014
	//		 iterate through tableID_0...tableID_??
	//		 while( $("#tableID_??"));
	//		 tableID = tableID_??  // first one not alread in document
	//		 to make sure that we don't create duplicate IDs
	var self = this;

	this.options = options = _.defaults({
		// Any of these can be overriden by passing an options 
		// object into your ReactiveDatatable template (see readme)
		stateSave: true,
		stateDuration: -1, // Store data for session only
		pageLength: 5,
		lengthMenu: [ 3, 5, 10, 50, 100 ],
		columnDefs: [{ // Global default blank value to avoid popup on missing data
			targets: "_all",
			defaultContent: "–––"
		}],

		stateLoadParams: function ( settings, data ){
			// Make it easy to change to the stored page on .update()
			self.page = data.start / data.length;
		}
	}, options);

	// Help Blaze cleanly remove entire datatable when changing template / route by
	// wrapping table in existing element (#datatable_wrap) defined in the template.
	var table = document.createElement('table');
	table.id = tableID;
	table.className = "table dataTable";
	
	// Render the table element and turn it into a DataTable
	var ourDiv = "#" + tableID + "_wrapper";
	console.log("ourDiv = " + ourDiv)
	$(ourDiv).append(table);
	this.datatable = $(table).DataTable(options);

};

ReactiveDatatable.prototype.update = function (data){
	if(!data.length) return;
	var self = this;

	self.datatable
		.clear()
		.rows.add(data)
		.draw(false)
		.page(self.page || 0) // XXX: Can we avoid drawing twice?
		.draw(false);		  // I couldn't get the page drawing to work otherwise
};