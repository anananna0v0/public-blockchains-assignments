// --------------------Assignment 1-------------------- // //Scroll down for assignment 2//
// Ethers JS: Quiz Contract.
////////////////////////////

// Note: this script includes reading from command-line and it might not
// work well with Code Runner. Please run inside a terminal.

// Load dependencies.
/////////////////////

// const path = require("path");

// const ethers = require("ethers");

// Adjust path to your .env file.
const pathToDotEnv = path.join(__dirname, "..", "..", ".env");

require("dotenv").config({ path: pathToDotEnv });
// console.log(pathToDotEnv);

const { getUserAnswer, extractQuestion } =
    require(path.join(__dirname, "quiz_helper.js"));

// Create Signer and Contract.
//////////////////////////////

const providerKey = process.env.ALCHEMY_KEY;
const sepoliaUrl = `${process.env.ALCHEMY_SEPOLIA_API_URL}${providerKey}`;
// console.log("ALCHEMY_SEPOLIA_API_URL:", process.env.ALCHEMY_SEPOLIA_API_URL);
// console.log("ALCHEMY_KEY:", process.env.ALCHEMY_KEY);

const sepoliaProvider = new ethers.JsonRpcProvider(sepoliaUrl);
// console.log(sepoliaUrl);

const signer = new ethers.Wallet(
    process.env.METAMASK_1_PRIVATE_KEY,
    sepoliaProvider
);

const quizABI = require(path.join(__dirname, "quiz_abi.json"));

// The address of the Quiz contract.
const contractAddress = "0x01FaE6a3E15b8cf2cb89C259b2d6e5bf7cf94782";

const quizContract = new ethers.Contract(contractAddress, quizABI, signer);

async function main() {

    // A. Ask question and get a transaction receipt.
    // Hint: method `askQuestion()`

    // Your code here.
    // Ask question and get a transaction receipt.
    console.log("Asking a new question...");
    const tx = await quizContract.askQuestion(); // askQuestion()需要發送交易，需確保 Metamask 錢包中有足夠的測試網 ETH
    const receipt = await tx.wait(); // 等待交易完成

    // From the transaction receipt we can extract useful information, such as
    // as the question's text and id that were stored in the logs
    // (we will understand logs in detail later in the course).
    const { text, id } = extractQuestion(quizContract, receipt); // 提取問題 (text)
    console.log(`Question: ${text}`); // ✅ 這行會顯示問題文字
    console.log(`Question ID: ${id}`); // ✅ 這行會顯示問題 ID

    if (!text) {
        console.log('An error occurred, please try again.');
        console.log('More info here: https://sepolia.etherscan.io/tx/' +
            receipt.hash);
        return;
    }

    // Now YOU answer the question!
    // Capture user input from the terminal.
    const userAnswer = await getUserAnswer(); // 會提示你輸入 yes 或 no

    // B. Send the answer to the smart contract.
    // Hint: method `answerQuestion`.

    // Your code here.
    console.log(`Answering the question with ID: ${id}`);
    const answerTx = await quizContract.answerQuestion(id, userAnswer);
    await answerTx.wait();
    console.log("Answer submitted successfully!");


    // C. Optional. Verify that the answer is correctly stored.
    // Hint: method `getAnswer(questionId)`

    // Your code here.
    console.log(`Verifying answer for question ID: ${id}`);
    const [storedAnswer, answerIsCorrect] = await quizContract.getAnswer(id);

    console.log(`Stored Answer: ${storedAnswer ? "Yes" : "No"}`);
    console.log(`Answer Correct: ${answerIsCorrect ? "Yes" : "No"}`);
}


main()
    .then(() => process.exit(0)) // 成功時結束程式，狀態碼 0
    .catch((error) => { // 捕獲異常錯誤並顯示
        console.error(error);
        process.exit(1); // 失敗時結束程式，狀態碼 1
    });
