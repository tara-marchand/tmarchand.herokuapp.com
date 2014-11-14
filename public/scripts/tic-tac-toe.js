// model
var TttModel = function() {
    var model = [];
};

TttModel.prototype = {

};

// view
TttView = function() {
    var model = new TttModel();
    var board = document.getElementById("board");
    var rows = board.getElementsByTagName("tr");

    // add data attributes with row and column values to spaces
    for (var i = rows.length - 1, spaces; i >= 0; i--) {
        spaces = rows[i].getElementsByTagName("td");
        for (var j = spaces.length - 1; j >= 0; j--) {
            spaces[j].setAttribute("data-row-column", "space-" + i + "-" + j);
        }
    }

    // check if board is in a winning state
    this.isWin = function() {
    };

    this.selectSpace = function() {

    };


};

var tttView = new TttView();
