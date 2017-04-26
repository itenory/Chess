function Chess(){
    this.bPlayerAI;
    this.wPlayerAI;
    this.moveHistory = [];

    this.board = {
        a1:"", b1:"", c1:"", d1:"", e1:"", f1:"", g1:"", h1:"", 
        a2:"", b2:"", c2:"", d2:"", e2:"", f2:"", g2:"", h2:"",
        a3:"", b3:"", c3:"", d3:"", e3:"", f3:"", g3:"", h3:"",
        a4:"", b4:"", c4:"", d4:"", e4:"", f4:"", g4:"", h4:"",
        a5:"", b5:"", c5:"", d5:"", e5:"", f5:"", g5:"", h5:"",
        a6:"", b6:"", c6:"", d6:"", e6:"", f6:"", g6:"", h6:"",
        a7:"", b7:"", c7:"", d7:"", e7:"", f7:"", g7:"", h7:"",
        a8:"", b8:"", c8:"", d8:"", e8:"", f8:"", g8:"", h8:"",
    };

    if(typeof this.getPossibleMoves != "function"){

        /*
         * Loads a game state for the board
         *  gameState list piece locations in in each row divided by /
         */
        Chess.prototype.loadGame = function(gameState){
            var rows = gameState.split("/");

            var getChar = function(amount){
                return String.fromCharCode('a'.charCodeAt(0) + amount);
            };

            for(var i = 0; i < 8; i++){
                if(rows[i].length != 0){
                    for(var k = 0; k < 16;  k+=2){
                        this.board[(getChar(k/2)) + (i+1)] = rows[i].substring(k, k+2);
                    }
                }
            }
        };

        /*
         * Moves piece based on move and stores move in history
         * move The move to be made
         * return Returns true if move was made, false otherwise.
         */
        Chess.prototype.movePiece = function(move){
            if(this.isValidMove(move)){
                this.board[move[2]] = this.board[move[1]];
                this.board[move[1]] = "";

                this.moveHistory.push(move);
                return true;
            }

            return false;
        };

        /*
         * Checks if the move is valid and can be made
         * move The move to be checked
         * return Returns true if move can be made, false otherwise
         */
        Chess.prototype.isValidMove = function(move){
            
            //Check for invalid format
            if(move.length != 3){
                return false;
            }

            //Checks if inputs exist on board
            if(this.board[move[1]] === undefined || this.board[move[2]] === undefined){
                return false;
            }

            //Check the rules for moving each type of piece
            switch(move[0]){
                case "P":
                    //Check diagonal, forward, backward
                    break;

                case "Q":
                    break;
            
                case "K":
                    break;

                case "N":
                    break;
                
                case "R":
                    break;
                
                case "B":
                    break;
                
                default:
                    return false;
            }

            return true;
        };

        /*
         * Forms a string of the current board and prints it to the console
         */
        Chess.prototype.printBoard = function(){
            var boardStr = "";

            var getChar = function(amount){
                return String.fromCharCode('a'.charCodeAt(0) + amount);
            };

            for(var i = 8; i >= 1; i--){
                boardStr += i + " |";
                for(var j = 1; j <= 8; j++){
                    boardStr += " " + (this.board[getChar(j-1) + i] + "  ").substring(0,2) + " |";
                }
                boardStr += "\n";
            }
            boardStr += "    a    b    c    d    e    f    g    h";
            
            console.log(boardStr);
        };
    }
}