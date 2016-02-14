/**
 * Extended by Darren S. on 13/02/2016.
 */
angular.module('sa.grid').directive('saGrid', ['$log', '$window', 'saGridUtils',
    function ($log, $window, gridUtils) {
        return {
           restrict: 'AE',
            scope: {
                idProperty: '=saIdProperty',
                dataSource: '=saDataSource',
                columns: '=saGridColumns',
                options: '=saGridOptions',
                rowsSelected: '=saDataSourceSelected',//DS - 201602122255
                toggleFilterRow: '=saDataSourceToggleFilterRow',
                goToTop: "=saDataSourceGoToTop"
            },
            link: function (scope, element) {

                var grid;
                var searchString = "";
                
                element = gridUtils.replaceElement(element);

                var dataView = new Slick.Data.DataView();

                //DS - 201602122255 - Begin
                var checkboxSelector = new Slick.CheckboxSelectColumn({
                    cssClass: "slick-cell-checkboxsel"
                });
                scope.columns.push(checkboxSelector.getColumnDefinition());

                grid = new Slick.Grid(element, dataView, gridUtils.prepareColumns(scope.columns), scope.options);
                //var pager = new Slick.Controls.Pager(dataView, grid, $("#pager"));

                grid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
                grid.registerPlugin(checkboxSelector);
                //DS - 201602122255 - Begin

                // move the filter panel defined in a hidden div into grid top panel
                $("#inlineFilterPanel")
                    .appendTo(grid.getTopPanel())
                    .show();

                scope.rowsSelected = function (){4
                    this.value = "";
                    searchString = this.value;
                    updateFilter();
                    grid.scrollRowToTop(0);

                    //Slick.GlobalEditorLock.cancelCurrentEdit();

                    $("#txtSearch2").val('')
                    return grid.getSelectedRows();
                };

                scope.goToTop = function() {
                    grid.scrollRowToTop(0);
                };

                scope.toggleFilterRow = function(){
                    grid.setTopPanelVisibility(!grid.getOptions().showTopPanel);
                }

                grid.onSort.subscribe(function (e, args) {

                    var comparator = function (a, b) {
                        return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
                    };

                    dataView.sort(comparator, args.sortAsc);
                });

                dataView.onRowsChanged.subscribe(function (e, args) {
                    grid.invalidateRows(args.rows);
                    grid.render();
                });
                // wire up the search textbox to apply the filter to the model
                $("#txtSearch2").keyup(function (e) {
                    // clear on Esc
                    if (e.which == 27) {
                        this.value = "";
                    }
                    searchString = this.value;
                    updateFilter();
                    grid.scrollRowToTop(0);
                });

                function updateFilter() {
                    dataView.setFilterArgs({
                        searchString: searchString
                    });
                    dataView.refresh();

                }
                /*alert(JSON.stringify(item));*/
                function myFilter(item, args) {

                    if (args.searchString != "" && item.name.indexOf(args.searchString) === -1)  {
                        return false;
                    }
                    return true;
                }

                var refresh = function () {
                    dataView.beginUpdate();
                    dataView.setItems(scope.dataSource || [], scope.idProperty);
                    dataView.setFilterArgs({
                        searchString: searchString
                    });
                    dataView.setFilter(myFilter);

                    dataView.endUpdate();
                    grid.invalidate();
                    grid.render();
                };

                dataView.syncGridSelection(grid, true);

                scope.$watch('columns', function (value) {
                    grid.setColumns(gridUtils.prepareColumns(value));
                }, true);

                scope.$watch('idProperty', function () {
                    refresh();
                });

                scope.$watchCollection('dataSource', function () {
                    refresh();
                });

                var onResize = function () {
                    grid.resizeCanvas();
                };

                $($window).resize('resize', onResize);

                scope.$on('$destroy', function () {
                    $($window).off('resize', onResize);
                });
            }


        };
    }]);