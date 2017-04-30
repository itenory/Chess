function Chess(){
    this.bPlayerAI;
    this.wPlayerAI;
    this.currentPlayer = 'w';
    this.moveHistory = [];
    this.initialPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; // FEN starting position

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
         * Loads a game state for the board using the FEN format
         */
        Chess.prototype.loadGame = function(gameState){
            var fields = gameState.split(" ");
            var rows = fields[0].split("/");

            var getChar = function(amount){
                return String.fromCharCode('a'.charCodeAt(0) + amount);
            };

            //Set piece positions
            for(var i = 0; i < 8; i++){
                if(rows[i].length != 0){
                    for(var k = 0; k < 8;  k++){
                        if(!isNaN(rows[i].charAt(k))){
                            k = parseInt(rows[i].charAt(k)) - 1; // Skip the empty spaces
                        }else{
                            if(rows[i].charAt(k).toUpperCase() === rows[i].charAt(k)){ // White Piece
                                this.board[getChar(k) + (8-i)] = "w" + rows[i].charAt(k);
                            }else{
                                this.board[getChar(k) + (8-i)] = "b" + rows[i].charAt(k).toUpperCase();
                            }
                        }
                    }
                }
            }

            //Set current player
            this.currentPlayer = fields[1];
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

            //Checks if inputs exist on board and move[1] has a piece
            if(this.board[move[1]] === undefined || this.board[move[2]] === undefined || this.board[move[1]] == ""){
                return false;
            }

            //Check the rules for moving each type of piece
            switch(move[0]){
                case "P":
                    console.log("Testing Pawn");

                    if(move[1].charAt(0) != move[2].charAt(0)){ // Diagonal
                        //Checks if move to is empty and that its the opponent's piece and its not a king
                        if(this.board[move[2]] == "" || this.board[move[2]].charAt(0) == this.board[move[1]].charAt(0) || this.board[move[2]].charAt(1) == "K"){
                            return false;
                        }

                        //Only move one step to left/right
                        if(Math.abs(move[1].charCodeAt(0) - move[2].charCodeAt(0)) == 1){
                            if(this.board[move[1]].charAt(0) == 'b'){
                                console.log("Checking Black Pawn");
                                if(move[1].charAt(1) - move[2].charAt(1) == 1){ //Check one step down
                                    return true;
                                }else{
                                    return false; 
                                }
                                
                            }else if(this.board[move[1]].charAt(0) == 'w'){
                                console.log("Checking White Pawn");
                                if(move[2].charAt(1) - move[1].charAt(1) == 1){ //Check one step up
                                    return true;
                                }else{
                                    return false; 
                                }
                            }
                        }else{
                            console.log("test");
                            return false;
                        }

                        
                    }else if(move[1].charAt(1) > move[2].charAt(1) && this.board[move[1]].charAt(0) == 'b'){ // Forward
                        console.log("Checking Black Pawn");
                        //Check for 2 step move then one step
                        if(move[1].charAt(1) == 7 && move[2].charAt(1) == 5 && this.board[move[2]] == ""){
                            return true;
                        }

                        if(move[1].charAt(1) - move[2].charAt(1) == 1 && this.board[move[2]] == ""){
                            return true;
                        }else{
                            return false; 
                        }
                    }else if(move[1].charAt(1) < move[2].charAt(1) && this.board[move[1]].charAt(0) == 'w'){ // Backward
                        console.log("Checking White Pawn");
                        if(move[1].charAt(1) == 2 && move[2].charAt(1) == 4 && this.board[move[2]] == ""){ // Check for double step at start
                            return true;
                        }

                        if(move[2].charAt(1) - move[1].charAt(1) == 1 && this.board[move[2]] == ""){ //Check for one step up/down
                            return true;
                        }else{
                            return false; 
                        }
                    }

                    return false;
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

        Chess.prototype.inCheck = function(){

        };
    }
}