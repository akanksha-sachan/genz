import Board from './Board';

/**
  * @desc This class represents the computer player, contains a single method that uses minimax to get the best move
  * @param {Number} max_depth - limits the depth of searching
  * @param {Map} nodes_map - stores the heuristic values for each possible move
*/
class Player
{
	constructor( max_depth = -1)
	{
        this.max_depth = max_depth;
        this.nodes_map = new Map();
    }

    /**
     * Uses minimax algorithm with alpha beta pruning to get the best move
     * @param {Number} alpha - best value that the maximizer currently can guarantee at that level or above
     * @param {Number} beta - best value that the minimizer currently can guarantee at that level or above
     * @param {Object} board - an instant of the board class
     * @param {Boolean} maximizing - whether the player is a maximizing or a minimizing player
     * @param {Function} callback - a function to run after the best move calculation is done
     * @param {Number} depth - used internally in the function to increment the depth each recursive call
     * @return {Number} the index of the best move
     */

	getBestMove(alpha, beta, board, maximizing = true, callback = () => {}, depth = 0)
	{
		//Throw an error if the first argument is not a board

		if(board.constructor.name !== "Board") throw('The first argument to the getBestMove method should be an instance of Board class.');

		//clear nodes_map if the function is called for a new move

		if(depth == 0) {
			this.nodes_map.clear();
		}

		//If the board state is a terminal one, return the heuristic value

		if(board.isTerminal() || depth == this.max_depth )
		{
			if(board.isTerminal().winner == 'x')
			{
				return 100 - depth;
			}
			else if (board.isTerminal().winner == 'o')
			{
				return -100 + depth;
			}

			return 0;
		}

		//var weights = [ 0 , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 ]; // HAVE TO DECIDE WEIGHTS

		//Checking for horizontal wins
        if(board.state[0] == board.state[1] && board.state[0]) {
            return 2;
        }
        if(board.state[1] == board.state[2] && board.state[1]) {
            return 0;
        }
        if(board.state[0] == board.state[2] && board.state[0]) {
            return 1;
        }
         if(board.state[3] == board.state[4] && board.state[3]) {
            return 5;
        }
         if(board.state[3] == board.state[5] && board.state[3]) {
            return 4;
        }
         if(board.state[4] == board.state[5] && board.state[4]) {
            return 3;
        }
         if(board.state[6] == board.state[7] && board.state[6]) {
            return 8;
        }
         if(board.state[6] == board.state[8] && board.state[6]) {
            return 7;
        }
         if(board.state[7] == board.state[8] && board.state[7]) {
            return 6;
        }

        //Checking for vertical wins
        if(board.state[0] == board.state[3] && board.state[0]) {
            return 6;
        }
        if(board.state[0] == board.state[6] && board.state[0]) {
            return 3;
        }
        if(board.state[3] == board.state[6] && board.state[3]) {
            return 0;
        }
         if(board.state[1] == board.state[4] && board.state[1]) {
            return 7;
        }
         if(board.state[1] == board.state[7] && board.state[1]) {
            return 4;
        }
         if(board.state[4] == board.state[7] && board.state[4]) {
            return 1;
        }
         if(board.state[2] == board.state[5] && board.state[2]) {
            return 8;
        }
         if(board.state[2] == board.state[8] && board.state[8]) {
            return 5;
        }
         if(board.state[5] == board.state[8] && board.state[5]) {
            return 2;
        }

        //Checking for diagonal wins
        if(board.state[0] == board.state[4] && board.state[0]) {
            return 8;
        }
        if(board.state[0] == board.state[8] && board.state[0]) {
            return 4;
        }
        if(board.state[4] == board.state[8] && board.state[4]) {
            return 0;
        }
         if(board.state[2] == board.state[4] && board.state[2]) {
            return 6;
        }
         if(board.state[2] == board.state[6] && board.state[2]) {
            return 4;
        }
         if(board.state[4] == board.state[6] && board.state[4]) {
            return 2;
        }

        //var counter = 0;
        //var lv;

        //to check if there is an X in the centre
        /*
        for (lv = 0; lv < 8; lv ++)
        {
        	if(lv!=4)
        	{
        		if(board.state[lv] == '')
        			counter++;

          	}
          	if(lv == 4)
          	{
          		if(board.state[lv] == 'x')
          			counter++;
          	}

        }*/

		//Current player is maximizing

		if(maximizing)
		{
			//Initialise best to the lowest possible value

			let best = -100;

			//Loop through all empty cells

			var avail = board.getAvailableMoves();
			var loopvar1;
			for (loopvar1 = 0; loopvar1 < avail.length; loopvar1++)
			{
				//Initialise a new board with the current state

				let child = new Board(board.state.slice());

				//Create a child node by inserting the maximizing symbol x into the current empty cell

				child.insert('x', avail[loopvar1]);


				//Recursively calling getBestMove this time with the new board and minimizing turn and incrementing the depth

				let node_value = this.getBestMove(alpha, beta, child, false, callback, depth + 1);

				//Updating best value

				best = Math.max(best, node_value);  // * weights[index] NEED TO THINK ABOUT THIS
				alpha = Math.max(alpha, best);

				//If it's the main function call, not a recursive one, map each heuristic value with it's moves indicies

				if(depth == 0)
				{
					//Comma seperated indicies if multiple moves have the same heuristic value

					var moves = this.nodes_map.has(node_value) ? `${this.nodes_map.get(node_value)},${avail[loopvar1]}` : avail[loopvar1];
					this.nodes_map.set(node_value, moves);
				}

				//pruning the tree

				if(alpha >= beta)
				{
					break;
				}
			}

			//If it's the main call, return the index of the best move or a random index if multiple indicies have the same value

			if(depth == 0)
			{
				if(typeof this.nodes_map.get(best) == 'string')
				{
					var arr = this.nodes_map.get(best).split(',');
					//var rand = Math.floor(Math.random() * arr.length);
					//var ret = arr[rand];
					var ret = arr[0];
				}
				else
				{
					ret = this.nodes_map.get(best);
				}

				//run a callback after calculation and return the index

				callback(ret);
				return ret;
			}

			//If not main call (recursive) return the heuristic value for next calculation

			return best;
		}

		if(!maximizing)
		{
			//Initialise best to the highest possible value

			let best = 100;

			//Loop through all empty cells

			var avail2 = board.getAvailableMoves();
			var loopvar2;
			for (loopvar2 = 0; loopvar2 < avail2.length; loopvar2++)
			{
				//Initialize a new board with the current state

				let child = new Board(board.state.slice());

				//Create a child node by inserting the minimizing symbol o into the current emoty cell

				child.insert('o', avail2[loopvar2]);


				//Recursively calling getBestMove this time with the new board and maximizing turn and incrementing the depth

				let node_value = this.getBestMove(alpha, beta, child, true, callback, depth + 1);

				//Updating best value

				best = Math.min(best, node_value);
				beta = Math.min(beta, best);

				//If it's the main function call, not a recursive one, map each heuristic value with it's moves indicies

				if(depth == 0)
				{
					//Comma seperated indicies if multiple moves have the same heuristic value

					var moves = this.nodes_map.has(node_value) ? this.nodes_map.get(node_value) + ',' + avail2[loopvar2] : avail2[loopvar2];
					this.nodes_map.set(node_value, moves);
				}

				if (beta <= alpha)
				{
					break;
				}
			}

			//If it's the main call, return the index of the best move or a random index if multiple indicies have the same value

			if(depth == 0)
			{
				if(typeof this.nodes_map.get(best) == 'string')
				{
					var arr = this.nodes_map.get(best).split(',');
					//var rand = Math.floor(Math.random() * arr.length);
					//var ret = arr[rand];
					var ret = arr[0];
				}
				else
				{
					ret = this.nodes_map.get(best);
				}

				//run a callback after calculation and return the index

				callback(ret);
				return ret;
			}

			//If not main call (recursive) return the heuristic value for next calculation
			return best;
		}

	}
}

export default Player;
