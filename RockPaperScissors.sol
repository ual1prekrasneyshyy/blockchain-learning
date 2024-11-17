// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RockPaperScissors {
    address public owner;

    //to store results
    struct Result {
        string userMove;
        string contractMove;
        string result;
    }

    // storage
    Result[] private results;

    // Event to log the result of the game
    event GameResult(address indexed player, string playerMove, string contractMove, bool win, uint256 amount);

    // Minimum bet amount (10,000 gwei)
    uint256 public minBet = 10000 gwei; // 10,000 gwei

    // Enum representing the possible moves
    enum Move { stone, scissors, paper }

    constructor() {
        owner = msg.sender;
    }

    // Function to play the game
    function playGame(uint8 playerMoveCode) public payable {
        require(playerMoveCode >= 0 && playerMoveCode <= 2, "Invalid move. Choose: 0 - stone, 1 - scissors, 2 - paper");
        require(msg.value >= minBet, "Bet must be at least 10,000 gwei");

        // Contract generates its move
        Move contractMove = Move(_getRandomNumber() % 3);

        Move playerMove = Move(playerMoveCode);

        // Determine if the player wins
        bool playerWins = _checkWin(playerMove, contractMove);

        uint256 payout;

        string memory playerMoveString = _moveToString(playerMove);
        string memory contractMoveString = _moveToString(contractMove);

        // Case of a draw
        if (playerMove == contractMove) {
            payout = msg.value; // Player gets their bet back
            emit GameResult(msg.sender, playerMoveString, contractMoveString, false, payout);

            results.push(Result(playerMoveString, contractMoveString, "Draw"));
        }
            // Case where the player wins
        else if (playerWins) {
            payout = msg.value * 2; // Player wins double their bet
            require(address(this).balance >= payout, "Not enough balance in the contract");

            emit GameResult(msg.sender, _moveToString(Move(playerMove)), contractMoveString, true, payout);


            results.push(Result(playerMoveString, contractMoveString, "Victory"));
        }
            // Case where the player loses (no payout)
        else {
            payout = 0; // Player loses their bet
            emit GameResult(msg.sender, _moveToString(Move(playerMove)), contractMoveString, false, payout);


            results.push(Result(playerMoveString, contractMoveString, "Loss"));
        }

        // Process the payout if needed
        if (payout > 0) {
            // Check if payout succeeds and revert if it fails
            (bool success, ) = payable(msg.sender).call{value: payout}("");
            require(success, "Transfer failed. Not enough gas or invalid recipient.");
        }
    }

    // Private function to generate a pseudo-random number
    function _getRandomNumber() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, msg.sender)));
    }

    // Private function to check if the player wins
    function _checkWin(Move playerMove, Move contractMove) private pure returns (bool) {
        if (
            (playerMove == Move.stone && contractMove == Move.scissors) ||
            (playerMove == Move.scissors && contractMove == Move.paper) ||
            (playerMove == Move.paper && contractMove == Move.stone)
        ) {
            return true; // Player wins
        }
        return false; // Player loses
    }

    // Private function to convert move enum to string
    function _moveToString(Move move) private pure returns (string memory) {
        if (move == Move.stone) return "stone";
        if (move == Move.scissors) return "scissors";
        return "paper";
    }

    // Function to withdraw contract funds
    function withdrawFunds() public {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        payable(owner).transfer(address(this).balance);
    }

    // Function to view the contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Fallback function to receive Ether
    receive() external payable {}

    function getResultsHistory() public view returns (Result[] memory) {
        return results;
    }
}