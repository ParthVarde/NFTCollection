const main = async () => {
    const epicnftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
    const epicNFTContract = await epicnftContractFactory.deploy();

    await epicNFTContract.deployed();

    console.log("Contract Address : " + epicNFTContract.address);


    let txn = await epicNFTContract.makeAnEpicNFT();
    await txn.wait();

    txn = await epicNFTContract.makeAnEpicNFT();
    await txn.wait();
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
}

runMain();