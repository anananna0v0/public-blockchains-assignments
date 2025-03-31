const hre = require("hardhat");

async function main() {
  const questions = [
    "Is Hsinchu known as Taiwan's Silicon Valley?",
    "Is Hsinchu known as the Windy City of Taiwan?",
    "Does Hsinchu have a traditional food called rice noodles (米粉)?",
    "Is Hsinchu located in southern Taiwan?",
    "Is the Hsinchu Science Park a major driver of Taiwan's semiconductor industry?"
  ];

  const answers = [true, true, true, false, true];

  const MyQuiz = await hre.ethers.getContractFactory("MyQuiz");
  const myQuiz = await MyQuiz.deploy(questions, answers);

  await myQuiz.waitForDeployment();

  console.log("✅ MyQuiz deployed to:", await myQuiz.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
