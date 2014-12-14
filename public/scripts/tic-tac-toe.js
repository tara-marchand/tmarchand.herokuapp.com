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
var BoardModel = function(spaces, options) {
    if (!options) {
        options = {};
    }

    this.content = {
        blank: "",
        user: "X",
        computer: "O"
    };

    this.spaces = spaces || [];
    this.spacesPerSide = options.spacesPerSide || 0;
    this.maxMoves = options.maxMoves || null;
    this.movesMade = 0;
};

BoardModel.prototype = {
    getSpaces: function() {
        return this.spaces;
    },

    setSpaces: function(spaces) {
        this.spaces = [];
        for (var i = spaces.length - 1; i >= 0; i--) {
            this.spaces.push(spaces[i]);
        }
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

    setSpaceContent: function(column, row, turn) {
        for (var i = this.spaces.length - 1, space; i >= 0; i--) {
            space = this.spaces[i];
            // loose equality
            if (space.column == column && space.row == row && space.content === "blank") {
                space.content = turn;
                break;
            }
        }
    },

    doMovesMadeEqualMaxMoves: function() {
        return this.movesMade === this.maxMoves;
    },

    getAvailableSpaces: function() {
        var spaces = this.getSpaces();
        var availableSpaces = [];

        for (var i = spaces.length - 1; i >= 0; i--) {
            if (spaces[i].content === "blank") {
                availableSpaces.push(spaces[i]);
            }
        }
        return availableSpaces;
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
    setSpaceContent: function(column, row, turn) {
        for (var i = this.model.getSpacesPerSide() - 1, rowSpaces; i >= 0; i--) {
            if (i == row) {
                rowSpaces = this.rows[i].getElementsByTagName("td");
                for (var j = rowSpaces.length - 1, space, content; j >= 0; j--) {
                    if (j == column) {
                        space = rowSpaces[j];
                        content = this.model.content[turn];
                        contentAttribute = space.getAttribute(this.CONTENT_DATA_ATTRIBUTE);
                        // don't do anything if space isn't blank
                        if (contentAttribute === "blank") {
                            // update view
                            space.textContent = content;
                            space.setAttribute(this.CONTENT_DATA_ATTRIBUTE, turn);
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
    this.turn = "user"; // user, computer

    BoardEvents.subscribe("click:space", function(columnRow) {
        this.updateSpace(columnRow.column, columnRow.row);
        this.turn = "computer";
        this.doComputerMove();
    }.bind(this));
};

BoardController.prototype = {
    cloneSpaces: function(spaces) {
        return JSON.parse(JSON.stringify(spaces));
    },
    updateSpace: function(column, row) {
        // update view
        this.view.setSpaceContent(column, row, this.turn);
        // update model
        this.model.setSpaceContent(column, row, this.turn);
    },
    getOppositeTurn: function(turn) {
        if (turn === "user") {
            return "computer";
        } else if (turn === "computer") {
            return "user";
        }
    },
    isGameOver: function() {
        return this.model.doMovesMadeEqualMaxMoves();
    },
    isWin: function(boardModel, turn) {
        var spaces = boardModel.getSpaces();
        var spacesPerSide = boardModel.getSpacesPerSide();
        var i;
        var j;

        var eligibleSpaces = [];
        var winningSpaces = 0;
        var isWin = false;

        var eligibleSpacesMakeWin = function() {
            winningSpaces = 0;
            for (j = eligibleSpaces.length - 1; j >= 0; j--) {
                if (eligibleSpaces[j].content === this.turn) {
                    winningSpaces++;
                }
            }
            if (winningSpaces === spacesPerSide) {
                return true;
            } else {
                return false;
            }
        }.bind(this);

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
        return isWin;
    },
    score: function(win) {
        if (win === true) {
            if (this.turn === "user") {
                console.log("user won");
                return 1;
            } else if (this.turn === "computer") {
                console.log("computer won");
                return -1;
            }
        } else {
            console.log("tie");
            return 0;
        }
    },
    doComputerMove: function() {
        var win = this.isWin(this.model, this.turn);

        if (win === true) {
            this.score(win);
        } else {
            var spaces = this.model.getSpaces();
            var availableMoves = this.model.getAvailableSpaces();
            var boardModel;
            var thisScore;
            var bestScore = -1;
            var bestSpace = null;

            for (var j = availableMoves.length - 1; j >= 0; j--) {
                boardModel = new BoardModel(this.cloneSpaces(spaces), {
                    maxMoves: this.model.getMaxMoves(),
                    spacesPerSide: this.model.getSpacesPerSide()
                });
                // new move
                boardModel.setSpaceContent(availableMoves[j].column, availableMoves[j].row, "computer");
                thisScore = this.minimax(boardModel, "computer");
                if (thisScore <= bestScore) {
                    bestScore = thisScore;
                    bestSpace = { column: availableMoves[j].column, row: availableMoves[j].row };
                }
            }
            console.log(bestSpace);
            this.updateSpace(bestSpace.column, bestSpace.row);
            this.turn = "user";
        }
    },
    minimax: function(boardModel, turn) {
        var spaces = boardModel.getSpaces();
        var availableMoves = boardModel.getAvailableSpaces();
        var newBoardModel;
        var thisScore;
        var bestScore = 0;

        if (turn === "computer") {
            bestScore = -1;
        } else if (turn === "user") {
            bestScore = 1;
        }

        // game is over
        if (availableMoves.length === 0) {
            return this.score(this.isWin(boardModel, turn));
        }

        for (var j = availableMoves.length - 1; j >= 0; j--) {
            newBoardModel = new BoardModel(this.cloneSpaces(spaces), {
                maxMoves: this.model.getMaxMoves(),
                spacesPerSide: this.model.getSpacesPerSide()
            });
            // new move
            newBoardModel.setSpaceContent(availableMoves[j].column, availableMoves[j].row, turn);

            thisScore = this.minimax(newBoardModel, this.getOppositeTurn(turn));
            if ((turn === "computer" && thisScore <= bestScore) || (turn === "user" && thisScore >= bestScore)) {
                bestScore = thisScore;
                bestSpace = { column: availableMoves[j].column, row: availableMoves[j].row };
            }
        }
        return bestScore;
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
