if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
        if (this === null) {
            throw new TypeError("Array.prototype.find called on null or undefined");
        }
        if (typeof predicate !== "function") {
            throw new TypeError("predicate must be a function");
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

// model
var BoardModel = function() {
    this.content = {
        blank: "",
        user: "X",
        computer: "O"
    };

    this.spacesPerSide = 0;
    this.maxMoves = null;
    this.movesMade = 0;
    this.spaces = []; 
};

BoardModel.prototype = {
    getSpaces: function() {
        return this.spaces;
    },

    setSpacesPerSide: function(newSpacesPerSide) {
        this.spacesPerSide = newSpacesPerSide;
    },

    getSpacesPerSide: function() {
        return this.spacesPerSide;
    },

    setMaxMoves: function(newMaxMoves) {
        this.maxMoves = newMaxMoves;
    },

    getMaxMoves: function() {
        return this.maxMoves;
    },

    addSpace: function(column, row) {
        this.spaces.push({ column: column, row: row, content: "blank" }); // conent: blank, user, computer
    },

    setSpaceContent: function(column, row, contentType) {
        for (var i = this.spaces.length - 1, space; i >= 0; i--) {
            space = this.spaces[i];
            if (space.column + "" === column && space.row + "" === row && space.content === "blank") {
                space.content = contentType;
                break;
            }
        }
    }
};

// view
var BoardView = function(element, model) {
    this.element = element;
    this.model = model;
    this.rows = element.getElementsByTagName("tr");
    this.model.setSpacesPerSide(this.rows.length);

    this.COLUMN_DATA_ATTRIBUTE = "data-column";
    this.ROW_DATA_ATTRIBUTE = "data-row";
    this.CONTENT_DATA_ATTRIBUTE = "data-content";

    var spacesPerSide = this.model.getSpacesPerSide();

    this.model.setMaxMoves(Math.pow(spacesPerSide, 2));

    // add data attributes with row and column values to spaces
    for (var i = spacesPerSide - 1, rowSpaces; i >= 0; i--) {
        rowSpaces = this.rows[i].getElementsByTagName("td");
        for (var j = rowSpaces.length - 1, space = {}; j >= 0; j--) {
            space.row = i + "";
            space.column = j + "";
            rowSpaces[j].setAttribute(this.COLUMN_DATA_ATTRIBUTE, space.column);
            rowSpaces[j].setAttribute(this.ROW_DATA_ATTRIBUTE, space.row);
            rowSpaces[j].setAttribute(this.CONTENT_DATA_ATTRIBUTE, "blank");
            this.model.addSpace(i, j);
        }
    }

    // event delegation
    this.element.addEventListener("click", function(e) {
        var target = e.target || e.srcElement;
        var nodeName = target.nodeName.toLowerCase();

        if (nodeName === "td") {
            var column = target.getAttribute(this.COLUMN_DATA_ATTRIBUTE);
            var row = target.getAttribute(this.ROW_DATA_ATTRIBUTE);
            // update view

            BoardEvents.publish("click:space", { column: column, row: row });
        }
    }.bind(this));
};

BoardView.prototype = {
    setSpaceContent: function(column, row, contentType) {
        for (var i = this.model.getSpacesPerSide() - 1, rowSpaces; i >= 0; i--) {
            if (i + "" === row) {
                rowSpaces = this.rows[i].getElementsByTagName("td");
                for (var j = rowSpaces.length - 1, space, content; j >= 0; j--) {
                    if (j + "" === column) {
                        space = rowSpaces[j];
                        content = this.model.content[contentType];
                        contentAttribute = space.getAttribute(this.CONTENT_DATA_ATTRIBUTE);
                        // don't do anything if space isn't blank
                        if (contentAttribute === "blank") {
                            space.textContent = content;
                            space.setAttribute(this.CONTENT_DATA_ATTRIBUTE, contentType);
                        }
                        break;
                    }
                }
                break;
            }
        }
    }
};

// controller
var BoardController = function(model, view) {
    this.model = model;
    this.view = view;

    BoardEvents.subscribe("click:space", function(columnRow) {
        this.updateSpace(columnRow.column, columnRow.row, "user");
    }.bind(this));
};

BoardController.prototype = {
    updateSpace: function(column, row, contentType) {
        var isWin = false;

        // update view
        this.view.setSpaceContent(column, row, contentType);
        // update model
        this.model.setSpaceContent(column, row, contentType);
        isWin = this.checkForWin(contentType);
        if (isWin === true) {
            console.log("is win for " + contentType);
        } else if (contentType === "user") {
            // computer's turn
        } else if (contentType === "computer") {
            // user's turn
        }
    },
    checkForWin: function(contentType) {
        var spaces = this.model.getSpaces();
        var spacesPerSide = this.model.getSpacesPerSide();
        var i;
        var j;

        var eligibleSpaces = [];
        var winningSpaces = 0;
        var isWin = false;

        var eligibleSpacesMakeWin = function() {
            winningSpaces = 0;
            for (j = eligibleSpaces.length - 1; j >= 0; j--) {
                if (eligibleSpaces[j].content === contentType) {
                    winningSpaces++;
                }
            }
            if (winningSpaces === spacesPerSide) {
                return true;
            } else {
                return false;
            }
        };

        // columns
        var checkByColumn = function() {
            for (i = spacesPerSide - 1; i >= 0; i--) {
                eligibleSpaces = [];
                eligibleSpaces = spaces.filter(function(space) {
                    return space.column === i;
                });
                if (eligibleSpacesMakeWin() === true) {
                    return true;
                }
            }
            return false;
        };

        // rows
        var checkByRow = function() {
            for (i = spacesPerSide - 1; i >= 0; i--) {
                eligibleSpaces = [];
                eligibleSpaces = spaces.filter(function(space) {
                    return space.row === i;
                });
                if (eligibleSpacesMakeWin() === true) {
                    return true;
                }
            }
            return false;
        };

        // diagonals
        var checkByDiagonals = function() {
            // L to R
            eligibleSpaces = [];
            for (i = spacesPerSide - 1; i >= 0; i--) {
                eligibleSpaces.push(spaces.find(function(space) {
                    // both indices are equal
                    return space.column === i && space.row === i;
                }));
                if (eligibleSpacesMakeWin() === true) {
                    return true;
                }
            }
            // R to L
            eligibleSpaces = [];
            eligibleSpaces = spaces.filter(function(space) {
                // indices add up to one less than spaces per side
                return space.column + space.row === (spacesPerSide - 1);
            });
            if (eligibleSpacesMakeWin() === true) {
                return true;
            }
            return false;
        };

        isWin = checkByColumn();
        if (isWin === false) {
            isWin = checkByRow();
        }
        if (isWin === false) {
            isWin = checkByDiagonals();
        }
        return {isWin: isWin, contentType: contentType};
    }
};

// event
var BoardEvents = (function() {
    var topics = {};

    return {
        subscribe: function(topic, listener) {
            // create the topic's object if not yet created
            if (!topics[topic]) {
                topics[topic] = {
                    queue: []
                };
            }

            // add listener to queue
            var index = topics[topic].queue.push(listener) - 1;

            // provide handle back for removal of topic
            return {
                remove: function() {
                    delete topics[topic].queue[index];
                }
            };
        },
        publish: function(topic, info) {
            var items = topics[topic].queue;

            // if the topic doesn't exist, or there are no listeners in queue, just leave
            if (!topics[topic] || !topics[topic].queue.length) {
                return;
            }

            // cycle through topics queue, fire!
            for (var i = items.length - 1; i >= 0; i--) {
                items[i](info || {});
            }
        }
    };
})();

var boardModel = new BoardModel();
var boardView = new BoardView(document.getElementById("board"), boardModel);
var boardController = new BoardController(boardModel, boardView);

/* ---------------------------------------------------- */
/*
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
        for (i = 0; i < numberOfSpacesPerSide; i++) { // 20, row: 11, row: 02
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

        for (var i = numberOfSpacesPerSide - 1, row: rowSpaceEls; i >= 0; i--) {
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
        for (var i = availableMoves.length - 1, row: move, boardCopy, selector, target; i >= 0; i--) {
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
    for (var i = numberOfSpacesPerSide - 1, row: rowSpaceEls; i >= 0; i--) {
        rowSpaceEls = rowEls[i].getElementsByTagName("td");
        for (var j = rowSpaceEls.length - 1, row: space = {}; j >= 0; j--) {
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
*/
