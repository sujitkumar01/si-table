/**
 * Pagination Directive
 *
 * This is injected below siTables and renders a pagination list.
 */
angular.module('siTable.directives').directive('siTablePagination', function() {
    return {
        restrict: 'E',
        priority: 1001,
        require: '^siTable',
        scope: {
            offset: '=',
            total: '=',
            limit: '='
        },
        template: '\
            <ul class="pagination">\
                <li ng-class="{disabled: params.offset === 0}">\
                    <a href ng-click="first()">First</a>\
                </li>\
                <li ng-class="{disabled: params.offset === 0}">\
                    <a href ng-click="previous()">Previous</a>\
                </li>\
                <li ng-repeat="page in showPages"\
                        ng-class="{active: currPage === page}">\
                    <a href ng-click="setPage(page)">{{ page }}</a>\
                </li>\
                <li ng-class="{disabled:\
                        params.offset + params.limit >= params.total}">\
                    <a href ng-click="next()">Next</a>\
                </li>\
                <li ng-class="{disabled:\
                        params.offset + params.limit >= params.total}">\
                    <a href ng-click="last()">Last</a>\
                </li>\
            </ul>',
        link: function(scope, element, attrs, controller) {
            var indices = 10;

            scope.params = controller.paginationParams;

            // Observe `indices` (number of indices shown)
            attrs.$observe('indices', function(_indices) {
                if (!isNaN(parseInt(_indices, 10))) {
                    indices = parseInt(_indices, 10);
                }
            });

            // Go to next page
            scope.next = function() {
                if (scope.params.offset + scope.params.limit <
                            scope.params.total) {
                    scope.params.offset += scope.params.limit;
                }
            };

            // Go to previous page
            scope.previous = function() {
                if (scope.params.offset > 0) {
                    scope.params.offset -= scope.params.limit;
                }
            };

            // Go to specific page
            scope.setPage = function(page) {
                scope.params.offset = (page - 1) * scope.params.limit;
            };

            // Go to first page
            scope.first = function() {
                scope.params.offset = 0;
            };

            // Go to last page
            scope.last = function() {
                scope.setPage(scope.maxPage);
            };

            // Create a sliding window of pages around the current page. There
            // should always be `params.maxShowPages` page numbers showing.
            scope.$watch('params', function(params) {
                var curr = Math.floor(params.offset / params.limit),
                    max = Math.ceil(params.total / params.limit) - 1;

                var minIndex = Math.max(0, Math.min(
                        curr - Math.ceil(indices / 2),
                        max - indices + 1));

                var showPages = [];
                for (var i = minIndex, count = 0; i <= max &&
                        count < indices; count++) {
                    showPages.push(i + 1);
                    i++;
                }

                scope.maxPage = max + 1;
                scope.currPage = curr + 1;
                scope.showPages = showPages;

                scope.offset = params.offset;
                scope.total = params.total;
            }, true);

            scope.$watch('offset', function(offset) {
                scope.params.offset = offset;
            });

            scope.$watch('total', function(total) {
                scope.params.total = total;
            });

            scope.$watch('limit', function(limit) {
                scope.params.limit = limit;
            });
        }
    };
});