var Board = function() {
    var COLUMN_DATA_ATTRIBUTE = "data-column";
    var ROW_DATA_ATTRIBUTE = "data-row";
    var USER_TEXT_CONTENT = "X";
    var COMPUTER_TEXT_CONTENT = "O";

    var boardEl = document.getElementById("board");
    var rowEls = boardEl.getElementsByTagName("tr");
    var spaceEls;

    var numberOfSpacesPerSide = rowEls.length;
    var numberOfMoves = 0;
    var maxNumberOfMoves = numberOfSpacesPerSide * numberOfSpacesPerSide; // calculated on iteration of table cells

    var selectSpace = function(el, content) {
        el.textContent = content;
    }.bind(this);

    var getContentByColumnAndRow = function(column, row) {
        return boardEl.querySelector("[data-column=\"" + column + "\"][data-row=\"" + row + "\"]").textContent;
    };

    // http://stackoverflow.com/questions/1056316/algorithm-for-determining-tic-tac-toe-game-over/1056352#1056352
    // determine whether there's a win, and if so, who won
    var checkForWin = function(targetColumn, targetRow, content) {
        var isWin = {
            boolean: false,
            content: content
        };

        // check column
        for (var i = 0; i < numberOfSpacesPerSide; i++) {
            if (getContentByColumnAndRow(targetColumn, i) !== content) {
                break;
            }
            if (i === numberOfSpacesPerSide - 1) {
                isWin.boolean = true;
            }
        }
        // check row
        for (i = 0; i < numberOfSpacesPerSide; i++){
            if (getContentByColumnAndRow(i, targetRow) !== content) {
                break;
            }
            if (i === numberOfSpacesPerSide - 1) {
                isWin.boolean = true;
            }
        }
        // check diagonal
        if (targetColumn === targetRow) {
            for (i = 0; i < numberOfSpacesPerSide; i++) {
                if (getContentByColumnAndRow(i, i) !== content) {
                    break;
                }
                if (i === numberOfSpacesPerSide - 1) {
                    isWin.boolean = true;
                }
            }
        }
        // check opposite diagonal
        for (i = 0; i < numberOfSpacesPerSide; i++) { // 20, 11, 02
            if (getContentByColumnAndRow(numberOfSpacesPerSide - 1 - i, i) !== content) {
                break;
            }
            if (i === numberOfSpacesPerSide - 1) {
                isWin.boolean = true;
            }
        }

        return isWin;
    };

    var doUserMove = function(e) {
        if (numberOfMoves === maxNumberOfMoves) {
            return;
        }

        var target = e.target || e.srcElement;
        var nodeName = target.nodeName.toLowerCase();

        if (nodeName === "td" && !target.textContent) {
            var targetColumn = target.getAttribute(COLUMN_DATA_ATTRIBUTE);
            var targetRow = target.getAttribute(ROW_DATA_ATTRIBUTE);
            var isWin = {};

            selectSpace(target, USER_TEXT_CONTENT);
            // user won
            isWin = checkForWin(targetColumn, targetRow, USER_TEXT_CONTENT);
            if (isWin.boolean === true) {
                alert("Win for " + isWin.content + "!");
                return;
            }
            // user didn't win
            numberOfMoves++;
            doComputerMove();
        }
    };

    var doComputerMove = function() {
        if (numberOfMoves === maxNumberOfMoves) {
            return;
        }

        // determine which space to select, then select it
    };

    // add data attributes with row and column values to spaces
    for (var i = numberOfSpacesPerSide - 1, rowSpaceEls; i >= 0; i--) {
        rowSpaceEls = rowEls[i].getElementsByTagName("td");
        for (var j = rowSpaceEls.length - 1, space = {}; j >= 0; j--) {
            space.row = i + "";
            space.column = j + "";
            rowSpaceEls[j].setAttribute(COLUMN_DATA_ATTRIBUTE, space.column);
            rowSpaceEls[j].setAttribute(ROW_DATA_ATTRIBUTE, space.row);
        }
    }

    // event delegation
    boardEl.addEventListener("click", doUserMove);
};

var board = new Board();
