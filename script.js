// Подключаемся к контракту
const contractAddress = "0xc4354D035C62903bA618BaBF2d4776853689A495";

// Указываем ABI (Application Binary Interface) контракта
const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"string","name":"playerMove","type":"string"},{"indexed":false,"internalType":"string","name":"contractMove","type":"string"},{"indexed":false,"internalType":"bool","name":"win","type":"bool"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"GameResult","type":"event"},{"inputs":[],"name":"getContractBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getResultsHistory","outputs":[{"components":[{"internalType":"string","name":"userMove","type":"string"},{"internalType":"string","name":"contractMove","type":"string"},{"internalType":"string","name":"result","type":"string"}],"internalType":"struct RockPaperScissors.Result[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minBet","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"playerMoveCode","type":"uint8"}],"name":"playGame","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
// Подключаемся к web3 провайдеру (метамаск)
const provider = new ethers.providers.Web3Provider(window.ethereum, 97);
let signer;
let contract;

//Запрашиваем аккаунты пользователя и подключаемся к первому аккаунту
provider.send("eth_requestAccounts", []).then(() => {
    provider.listAccounts().then((accounts) => {
        signer = provider.getSigner(accounts[0]); // первый аккаунт

        //Создаем объект контракта
        contract = new ethers.Contract(contractAddress, abi, signer);
        console.log(contract);
    });
});


async function playGame(){

    const userBet = document.getElementById("user_bet").value;

    if(userBet > 10000){
        const userChoice = document.getElementById("user_choice").value;
        const amountToSend = ethers.utils.parseUnits(userBet, "gwei"); // 0.01 ETH - Adjust as needed

        try {
            const tx = await contract.playGame(userChoice, { value: amountToSend }); // Add {value}
            console.log("Transaction hash:", tx.hash);
            await tx.wait(); // Wait for confirmation
            console.log("Transaction confirmed!");
            getHistory(); //Update History after game
        } catch (error) {
            console.error("Error playing game:", error);
            //Consider more user-friendly error handling, for example display an error message
        }
    }else{
        let innerHtml =
            "<div class='alert alert-warning pb-1 mt-3'>" +
            "<blockquote>" +
            "Your bet is <strong>" + userBet + "</strong> Gwei, though it should be <strong>at least 10000 Gwei</strong>" +
            "</blockquote>" +
            "</div>";

        document.getElementById("warning").innerHTML = innerHtml;
    }


}

async function getHistory() {
    const results = await contract.getResultsHistory();
    console.log(results);

    let pastedResult =
        "<table class='table table-striped mt-4'>" +
        "<thead class='table-warning'>" +
        "<tr>" +
        "<th>#</th>" +
        "<th>Your move</th>" +
        "<th>Contract's move</th>" +
        "<th>Yor result</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>";

    for (let i = 0; i < results.length; i++) {

        pastedResult +=
            "<tr>" +
            "<td>" + (i+1) + "</td>" +
            "<td>" + results[i][0] + "</td>" +
            "<td>" + results[i][1] + "</td>" +
            "<td>" + results[i][2] + "</td>" +
            "</tr>";
    }

    pastedResult += "</tbody>" +
        "</table>";

    document.getElementById("history").innerHTML = pastedResult;
    
}
