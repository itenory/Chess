/*
 * Class that handles the backend for Chess 
 *  Loads/Saves games in the Forsyth-Edwards Notation (FEN)
 */
function Chess(){
    this.currentPlayer = 'w';
    this.currentState; // Current state of the game in FEN standard, stored as array of its components
    //this.initialState = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; // FEN starting position
    this.initialState = "r3k2r/p1p1p1p1/8/8/8/8/2PP2PP/R2QK2R w KQkq - 0 1";
    this.board = { // Game board object
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
            this.currentState = gameState.split(" "); //Initial the current state
            var rows = this.currentState[0].split("/");        

            var getChar = function(amount){
                return String.fromCharCode('a'.charCodeAt(0) + amount);
            };

            //Set piece positions
            for(var i = 0; i < 8; i++){
                var dx = 0; // For skipping empty spaces 
                if(rows[i].length != 0){
                    for(var k = 0; k+dx < 8; k++){
                        if(!isNaN(rows[i].charAt(k))){
                            dx += parseInt(rows[i].charAt(k)) - 1; // Skip the empty spaces
                        }else{
                            if(rows[i].charAt(k).toUpperCase() === rows[i].charAt(k)){ // White Piece
                                this.board[getChar(k+dx) + (8-i)] = "w" + rows[i].charAt(k);
                            }else{
                                this.board[getChar(k+dx) + (8-i)] = "b" + rows[i].charAt(k).toUpperCase();
                            }
                        }
                    }
                }
            }

            //Set current player
            this.currentPlayer = this.currentState[1];
        };

        /*
         * Moves piece based on move, stores the move in history, and changes the game state
         * move The move to be made
         * return Returns true if move was made, false otherwise.
         */
        Chess.prototype.movePiece = function(move){
            if(this.isValidMove(move)){
                if(move.length == 1){ // For castling, won't work for chess variants 
                    if(move[0].length == 3){ // King side
                        if(this.currentPlayer == "w"){
                            this.board["h1"] = "";
                            this.board["e1"] = "";
                            this.board["g1"] = "wK";
                            this.board["f1"] = "wR"; 
                            
                            this.currentState[2] = this.currentState[2].replace("K", "");
                        }else{
                            this.board["h8"] = "";
                            this.board["e8"] = "";
                            this.board["g8"] = "bK";
                            this.board["f8"] = "bR"; 
                        
                            this.currentState[2] = this.currentState[2].replace("k", "");
                        }

                    }else{ // Queen side

                        if(this.currentPlayer == "w"){
                            this.board["a1"] = "";
                            this.board["e1"] = "";
                            this.board["c1"] = "wK";
                            this.board["d1"] = "wR"; 
                        
                            this.currentState[2] = this.currentState[2].replace("Q", "");
                        }else{
                            this.board["a8"] = "";
                            this.board["e8"] = "";
                            this.board["c8"] = "bK";
                            this.board["d8"] = "bR";

                            this.currentState[2] = this.currentState[2].replace("q", "");
                        }
                    }

                }else if(move[2].length == 3){ // For pawn promotion
                    this.board[move[1]] = this.board[move[1]].charAt(0) + move[2].charAt(2);
                    this.board[move[2].substring(0,2)] = this.board[move[1]];
                    this.board[move[1]] = "";

                }else{
                    this.board[move[2]] = this.board[move[1]];
                    this.board[move[1]] = "";

                    //Check if king or rook move to stop castling
                    if(move[0].charAt(0) == "K"){
                        if(this.currentState[1] == "w"){
                            this.currentState[2] = this.currentState[2].replace("K", "");
                            this.currentState[2] = this.currentState[2].replace("Q", "");
                        }else{
                            this.currentState[2] = this.currentState[2].replace("k", "");
                            this.currentState[2] = this.currentState[2].replace("q", "");
                        }

                        if(this.currentState[2].length == 0){
                            this.currentState[2] = "-";
                        }
                    }else if(move[0].charAt(0) == "R"){
                        if(this.currentState[1] == "w"){
                            if(this.move[1].charAt(1) == "1"){
                                this.currentState[2] = this.currentState[2].replace("Q");
                            }else{
                                this.currentState[2] = this.currentState[2].replace("K");
                            }
                        }else{
                            if(this.move[1].charAt(1) == "1"){
                                this.currentState[2] = this.currentState[2].replace("q");
                            }else{
                                this.currentState[2] = this.currentState[2].replace("k");
                            }
                        }

                        if(this.currentState[2].length == 0){
                            this.currentState[2] = "-";
                        }
                    }
                }

                this.currentPlayer = (this.currentState[1] == "w") ? "b" : "w";
                this.currentState[1] = this.currentPlayer;
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
            //Special case for castling
            if(move.length == 1){
                if(move[0] == "0-0"){ //King side
                    if(this.currentPlayer == "w" && this.currentState[2].includes('K') && this.straightTest("e1", "h1")){
                        return true;
                    }else if(this.currentPlayer == "b" && this.currentState[2].includes('k') && this.straightTest("e8", "h8")){
                        return true;
                    }
                    return false;
      
                }else if(move[0] == "0-0-0"){ // Queen side
                    if(this.currentPlayer == "w" && this.currentState[2].includes('Q') && this.straightTest("a1", "e1")){
                        return true;
                    }else if(this.currentPlayer == "b" && this.currentState[2].includes('q') && this.straightTest("a8", "d8")){
                        return true;
                    }

                    return false;
                }
            }

            /* Checks invalid moves, not piece specific:
                Checks if inputs exist on board
                move[1] has a piece
                that new position isn't a king
                from and to do not have the same player's piece
                Moving piece is owned by current player
            */
            if(this.board[move[1]] === undefined || this.board[move[2]] === undefined || this.board[move[1]] == "" || this.board[move[2]].charAt(1) == 'K' || this.board[move[1]].charAt(0) == this.board[move[2]].charAt(0) || this.currentPlayer != this.board[move[1]].charAt(0)){       
                // //ONLY  FOR DEBUGGING, Can throw error 
                // console.log("Invalid move, not piece specific");
                // console.log(this.board[move[1]] === undefined);
                // console.log(this.board[move[2]] === undefined );
                // console.log(this.board[move[1]] == "");
                // console.log(this.board[move[2]].charAt(1) != 'K');
                // console.log(this.board[move[1]].charAt(0) != this.board[move[2]].charAt(0));
                // console.log(this.currentPlayer != this.board[move[1]].charAt(0));
                
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
                
                case "Q":
                    console.log("Checking Queen");
                    if(this.straightTest(move[1], move[2])){
                        return true;
                    }else if(this.diagonalTest(move[1], move[2])){
                        return true;
                    }

                    return false;
            
                case "K":
                    var x = move[1].charCodeAt(0);
                    var y = move[1].charCodeAt(1);

                    if(move[2].charCodeAt(0) < x-1 || move[2].charCodeAt(0) > x+1){
                        return false; 
                    }else if(move[2].charCodeAt(1) < y-1 || move[2].charCodeAt(1) > y+1){
                        return false;
                    }

                    //Check for putting player in check
                    
                    return true;      
                
                case "N":
                    if(Math.abs(move[1].charCodeAt(0) - move[2].charCodeAt(0)) == 2 && Math.abs(move[1].charCodeAt(1) - move[2].charCodeAt(1)) == 1){
                        return true;
                    }else if(Math.abs(move[1].charCodeAt(0) - move[2].charCodeAt(0)) == 1 && Math.abs(move[1].charCodeAt(1) - move[2].charCodeAt(1)) == 2){
                        return true;
                    }
                    
                    return false;
                
                case "R":
                    console.log("Checking Rook");
                    if(this.straightTest(move[1], move[1])){
                        return true;
                    }
                    return false;
                
                case "B":
                    console.log("Checking Bishop");
                    if(this.diagonalTest(move[1], move[1])){
                        return true;
                    }
                    return false;
                
                default:
                    return false;
            }
        };

        /*
         * Checks for other pieces in a straight line, excluding position to
         * from The starting position of the piece
         * to The position the piece is to be moved to.
         */
        Chess.prototype.straightTest = function (from, to){          
            if(from.charAt(0) == to.charAt(0) && from.charAt(1) != to.charAt(1)){ // Same col/letter
                var dx = (to.charAt(1) - from.charAt(1)  > 0) ? 1 : -1;
                for(var i = parseInt(from.charAt(1))+dx;  i != to.charAt(1); i+=dx){
                    if(this.board[from.charAt(0) + i] != ""){
                        return false;
                    }
                }
                return true;
            }else if(from.charAt(1) == to.charAt(1) && from.charAt(0) != to.charAt(0)){ // Same row/num
                var dx = (to.charCodeAt(0) - from.charCodeAt(0) > 0) ? 1 : -1;
                for(var i = from.charCodeAt(0)+dx; i != to.charCodeAt(0); i+=dx){
                    if(this.board[String.fromCharCode(i) + from.charAt(1)] != ""){
                        return false; 
                    }
                }
                return true;

            }else{
                return false;
            }
        }
   
        /*
         * Checks if their are any pieces on the path, Excluding the end point, to.
         * from The starting position of the piece
         * to The position the piece is to be moved to
         */
        Chess.prototype.diagonalTest = function(from, to){
            if(Math.abs(to.charCodeAt(0) - from.charCodeAt(0)) != Math.abs(to.charCodeAt(1) - from.charCodeAt(1))){ // Check for uneven distances
                return false; // Not a diagonal
            }
            
            var dx = (to.charCodeAt(0) - from.charCodeAt(0)  > 0) ? 1 : -1;
            var dy = (to.charAt(1) - from.charAt(1) > 0) ? 1 : -1;
            var x = from.charCodeAt(0) + dx; // Next starting position on diagonal
            var y = from.charCodeAt(1) + dy; 
            console.log(dx,dy);
            while( x != to.charCodeAt(0)){
                if(this.board[String.fromCharCode(x) + String.fromCharCode(y)] != ""){ return false;}
                x += 1; y += 1;    
            }
            return true;
        }

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