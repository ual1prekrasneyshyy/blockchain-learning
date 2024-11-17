// Подключаемся к контракту
const contractAddress = "0x2033Ff51268504Fec088f57c02fC15bB565e86E3";

// Указываем ABI (Application Binary Interface) контракта
const abi = [
    {
        "inputs":[],
        "stateMutability":"nonpayable",
        "type":"constructor"
    },
    {
        "anonymous":false,
        "inputs":[
            {"indexed":true, "internalType":"address", "name":"player", "type":"address"},
            {"indexed":false, "internalType":"string", "name":"playerMove", "type":"string"},
            {"indexed":false, "internalType":"string", "name":"contractMove", "type":"string"},
            {"indexed":false, "internalType":"bool", "name":"win", "type":"bool"},
            {"indexed":false, "internalType":"uint256", "name":"amount", "type":"uint256"}
        ],
        "name":"GameResult",
        "type":"event"
    },
    {
        "inputs":[],
        "name":"getContractBalance",
        "outputs":[
            {"internalType":"uint256", "name":"", "type":"uint256"}
        ],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs": [],
        "name": "getResultsHistory",
        "outputs": [
            {
                "components": [
                    { "internalType": "uint8", "name": "userMove", "type": "uint8" },
                    { "internalType": "uint8", "name": "contractMove", "type": "uint8" },
                    { "internalType": "string", "name": "result", "type": "string" }
                ],
                "internalType": "struct RockPaperScissors.Result[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs":[],
        "name":"minBet",
        "outputs":[
            {"internalType":"uint256", "name":"", "type":"uint256"}
        ],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"owner",
        "outputs":[
            {"internalType":"address", "name":"", "type":"address"}
        ],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":
            [
                {"internalType":"uint8", "name":"playerMove", "type":"uint8"}
            ],
        "name":"playGame",
        "outputs":[],
        "stateMutability":"payable",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"withdrawFunds",
        "outputs":[],
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "stateMutability":"payable",
        "type":"receive"
    }
    ];

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
    const userChoice = document.getElementById("user_choice").value;
    const play = await contract.playGame(userChoice);
}

async function getHistory() {
    try {
        const results = await contract.getResultsHistory();
        console.log(results); // Results will now be a usable array of objects
        //Now you can iterate through results and display them on the webpage
        displayHistory(results);
    } catch (error) {
        console.error("Error fetching history:", error);
        alert("Error fetching game history. Please try again."); //Inform the user about the error
    }
}