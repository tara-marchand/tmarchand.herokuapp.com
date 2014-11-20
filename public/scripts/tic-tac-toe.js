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

    var selectSpace = function(el, board, content) {
        el.textContent = content;
    }.bind(this);

    var getContentByColumnAndRow = function(board, column, row) {
        return board.querySelector("[data-column=\"" + column + "\"][data-row=\"" + row + "\"]").textContent;
    };

    // http://stackoverflow.com/questions/1056316/algorithm-for-determining-tic-tac-toe-game-over/1056352#1056352
    // determine whether there's a win, and if so, who won
    var checkForWin = function(board, targetColumn, targetRow, content) {
        var isWin = {
            boolean: false,
            content: content,
            score: null
        };

        // check column
        for (var i = 0; i < numberOfSpacesPerSide; i++) {
            if (getContentByColumnAndRow(board, targetColumn, i) !== content) {
                break;
            }
            if (i === numberOfSpacesPerSide - 1) {
                isWin.boolean = true;
            }
        }
        // check row
        for (i = 0; i < numberOfSpacesPerSide; i++){
            if (getContentByColumnAndRow(board, i, targetRow) !== content) {
                break;
            }
            if (i === numberOfSpacesPerSide - 1) {
                isWin.boolean = true;
            }
        }
        // check diagonal
        if (targetColumn === targetRow) {
            for (i = 0; i < numberOfSpacesPerSide; i++) {
                if (getContentByColumnAndRow(board, i, i) !== content) {
                    break;
                }
                if (i === numberOfSpacesPerSide - 1) {
                    isWin.boolean = true;
                }
            }
        }
        // check opposite diagonal
        for (i = 0; i < numberOfSpacesPerSide; i++) { // 20, 11, 02
            if (getContentByColumnAndRow(board, numberOfSpacesPerSide - 1 - i, i) !== content) {
                break;
            }
            if (i === numberOfSpacesPerSide - 1) {
                isWin.boolean = true;
            }
        }

        if (isWin.boolean === true) {
            if (content === USER_TEXT_CONTENT) {
                isWin.score = 10;
            } else if (content === COMPUTER_TEXT_CONTENT) {
                isWin.score = -10;
            }
        }

        return isWin;
    };

    var doUserMove = function(e, board) {
        if (numberOfMoves === maxNumberOfMoves) {
            return;
        }

        var target = e.target || e.srcElement;
        var nodeName = target.nodeName.toLowerCase();

        if (nodeName === "td" && !target.textContent) {
            var targetColumn = target.getAttribute(COLUMN_DATA_ATTRIBUTE);
            var targetRow = target.getAttribute(ROW_DATA_ATTRIBUTE);
            var isWin = {};

            selectSpace(target, board, USER_TEXT_CONTENT);
            // user won
            isWin = checkForWin(boardEl, targetColumn, targetRow, USER_TEXT_CONTENT);
            if (isWin.boolean === true) {
                var name = (isWin.score === 10) ? "user" : "computer";
                alert("Win for " + name + "!");
                return;
            }
            // user didn't win
            numberOfMoves++;
            doComputerMove();
        }
    };

    var getAvailableMoves = function(board) {
        var availableMoves = [];

        for (var i = numberOfSpacesPerSide - 1, rowSpaceEls; i >= 0; i--) {
            rowSpaceEls = rowEls[i].getElementsByTagName("td");
            for (var j = rowSpaceEls.length - 1; j >= 0; j--) {
                if (rowSpaceEls[j].textContent === "") {
                    availableMoves.push({ column: rowSpaceEls[j].getAttribute(COLUMN_DATA_ATTRIBUTE), row: rowSpaceEls[j].getAttribute(ROW_DATA_ATTRIBUTE) });
                }
            }
        }

        return availableMoves;
    };

    var doComputerMove = function() {
        if (numberOfMoves === maxNumberOfMoves) {
            return;
        }

        minimax(boardEl, 0);

        isWin = checkForWin(boardEl, targetColumn, targetRow, USER_TEXT_CONTENT);
        if (isWin.boolean === true) {
            var name = (isWin.score === 10) ? "user" : "computer";
            alert("Win for " + name + "!");
            return;
        }
        // computer didn't win
        numberOfMoves++;
    };

    var minimax = function(board, depth) {
        var availableMoves = getAvailableMoves(board);
        var scores = []; // an array of scores
        var moves = []; // an array of moves
        var minScoreIndex;
        var moveToMake = {};

        // populate the scores array, recursing as needed
        for (var i = availableMoves.length - 1, move, boardCopy, selector, target; i >= 0; i--) {
            move = availableMoves[i];
            boardCopy = board.cloneNode();
            selector = "td[" + COLUMN_DATA_ATTRIBUTE + "=\"" + move.column + "\"][" + ROW_DATA_ATTRIBUTE + "=\"" + move.row + "\"]";
            console.log(selector);
            target = board.querySelector(selector);
            selectSpace(target, boardCopy, COMPUTER_TEXT_CONTENT);
        }

        // game.get_available_moves.each do |move|
        //     possible_game = game.get_new_state(move)
        //     scores.push minimax(possible_game)
        //     moves.push move
        // end

        // # Do the min or the max calculation
        // # This is the min calculation
        minScoreIndex = scores.indexOf(Math.min.apply(null, scores));
        moveToMake = moves[minScoreIndex];
        // return scores[min_score_index]
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
    boardEl.addEventListener("click", function(e) {
        doUserMove(e, boardEl);
    });
};

var board = new Board();
