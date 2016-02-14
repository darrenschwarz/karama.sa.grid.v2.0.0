(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "CheckboxSelectColumn": CheckboxSelectColumn
    }
  });


  function CheckboxSelectColumn(options) {
    var _grid;
    var _self = this;
    var _handler = new Slick.EventHandler();
    var _selectedRowsLookup = {};
    var _defaults = {
      columnId: "_checkbox_selector",
      cssClass: null,
      toolTip: "Select/Deselect All",
      width: 30
    };

    var preserveSelectedRow = [];//DS - 201602122255
    var preserveSelectedRowID = [];//DS - 201602122255

    var _options = $.extend(true, {}, _defaults, options);

    function init(grid) {
      _grid = grid;
      _handler
        .subscribe(_grid.onSelectedRowsChanged, handleSelectedRowsChanged)
        .subscribe(_grid.onClick, handleClick)
        .subscribe(_grid.onHeaderClick, handleHeaderClick)
        .subscribe(_grid.onKeyDown, handleKeyDown)
        .subscribe(_grid.onSort, handleSort);

    }

    //DS - 201602122255 - Begin
    var handleSort = function (e, args){
      // Subscribing handleCheckBox API which will be
      // triggered when rendering operation of grid is completed
      // after sorting.
      args.grid.onRenderCompleted.subscribe(handleCheckBox);
    }

    var handleCheckBox = function (e, args){
      var grid = args.grid;
      var selectedRows = grid.getSelectedRows();
      var newPosition = [];
      var position, i, j;
      // Iterating all rows of the grid and found the
      // position of the previously selected [ Before Sort ]
      // items.
      for (i = 0; i <= selectedRows.length; i++) {
          position = -1;
          for (j = 0; j < grid.getData().getItems().length; j++) {
              position = $.inArray( grid.getDataItem(j).staffId, preserveSelectedRowID );
              if(position >= 0){
                  // Items found and inserting the postion into
                  // newPosition Array
                  newPosition.push(j);
              }
          }
      }
      // If newPosition is not empty then
      // re-ordering the selection as per new position.
      if(newPosition.length > 0){
          grid.onRenderCompleted.unsubscribe(handleCheckBox);
          grid.setSelectedRows(newPosition);
      }
      grid.onRenderCompleted.unsubscribe(handleCheckBox);
    }
    //DS - 201602122255 - End

    function destroy() {
      _handler.unsubscribeAll();
    }

    function handleSelectedRowsChanged(e, args) {

      var selectedRows = _grid.getSelectedRows();
      var lookup = {}, row, i;
      for (i = 0; i < selectedRows.length; i++) {
        row = selectedRows[i];
        lookup[row] = true;
        if (lookup[row] !== _selectedRowsLookup[row]) {
          _grid.invalidateRow(row);
          delete _selectedRowsLookup[row];
        }
      }
      for (i in _selectedRowsLookup) {
        _grid.invalidateRow(i);
      }
      _selectedRowsLookup = lookup;
      _grid.render();

      if (selectedRows.length && selectedRows.length == _grid.getDataLength()) {
        _grid.updateColumnHeader(_options.columnId, "<input type='checkbox' checked='checked'>", _options.toolTip);
      } else {
        _grid.updateColumnHeader(_options.columnId, "<input type='checkbox'>", _options.toolTip);
      }
    }

    function handleKeyDown(e, args) {
      if (e.which == 32) {
        if (_grid.getColumns()[args.cell].id === _options.columnId) {
          // if editing, try to commit
          if (!_grid.getEditorLock().isActive() || _grid.getEditorLock().commitCurrentEdit()) {
            toggleRowSelection(args.row);
          }
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
    }

    function handleClick(e, args) {
      // clicking on a row select checkbox
      if (_grid.getColumns()[args.cell].id === _options.columnId && $(e.target).is(":checkbox")) {

        // if editing, try to commit
        if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }

        toggleRowSelection(args.row);
        e.stopPropagation();
        e.stopImmediatePropagation();

        //DS - 201602122255 - Begin - NB Update preserveSelectedRow & preserveSelectedRowID after toggleRowSelection(args.row);
        var i;
        // Preserving Selected Rows
        preserveSelectedRow = _grid.getSelectedRows();

        // Preserving Selected Row ID
        preserveSelectedRowID = [];
        for (i = 0; i < preserveSelectedRow.length; i++) {
          preserveSelectedRowID.push(_grid.getDataItem(preserveSelectedRow[i]).staffId);
        }

        //DS - 201602122255 - End
      }
    }

    function toggleRowSelection(row) {
      if (_selectedRowsLookup[row]) {
        _grid.setSelectedRows($.grep(_grid.getSelectedRows(), function (n) {
          return n != row
        }));
      } else {
        _grid.setSelectedRows(_grid.getSelectedRows().concat(row));
      }
    }

    function handleHeaderClick(e, args) {
      if (args.column.id == _options.columnId && $(e.target).is(":checkbox")) {
        // if editing, try to commit
        if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }

        if ($(e.target).is(":checked")) {
          var rows = [];
          for (var i = 0; i < _grid.getDataLength(); i++) {
            rows.push(i);
          }
          _grid.setSelectedRows(rows);
        } else {
          _grid.setSelectedRows([]);
        }
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }

    function getColumnDefinition() {
      return {
        id: _options.columnId,
        name: "<input type='checkbox'>",
        toolTip: _options.toolTip,
        field: "sel",
        width: _options.width,
        resizable: false,
        sortable: false,
        cssClass: _options.cssClass,
        formatter: checkboxSelectionFormatter
      };
    }

    function checkboxSelectionFormatter(row, cell, value, columnDef, dataContext) {
      if (dataContext) {
        return _selectedRowsLookup[row]
            ? "<input type='checkbox' checked='checked'>"
            : "<input type='checkbox'>";
      }
      return null;
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy,
      "getColumnDefinition": getColumnDefinition
    });
  }
})(jQuery);