function Game (){
	this.currentPlayer = 1; // White = 1, Black = 2

    if(typeof this.startGame != "function"){
        Game.prototype.startGame = function(){
			//Set up pieces
			this.chess = new Chess();
			this.chess.loadGame("wRwNwBwQwKwBwNwR/wPwPwPwPwPwPwPwPwP/////bPbPbPbPbPbPbPbP/bRbNbBbQbKbBbNbR");
			this.drawBoard();	
		 };


        Game.prototype.drawBoard = function(){
		};

		/*
		 * Move the piece and capture if needed. Also change currentplayer
		 * Move to be in format of: "P-b2-b3"
		 */
		Game.prototype.makeMove = function(m){
			var move = m.split('-');
			
			//Check if move can be made on backend
			if (move.length != 3 && this.chess.movePiece(move)){
				//Move piece

			}else{
				//Display error

			}
		}; 

		/*
		 * Checks if player is in check
		 */
		Game.prototype.inCheck = function(player){
		};

		/*
		 * Checks if the player's piece can not be moved
		 * 
		 * 
		 */
		Game.prototype.checkMate = function(player, pieceKey){
		}
    }
}