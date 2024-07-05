import React, { useState } from "react";
import { ethers } from "ethers"; // Import ethers.js for Ethereum interactions
import { FaCopy } from "react-icons/fa"; // Import the copy icon from react-icons
import MyToken from "./MyToken.json"; // Import your contract ABI and bytecode JSON

interface TokenDisplayStates {
  tokenTicker?: string;
  tokenName?: string;
  supply?: number;
}


const MainPage: React.FC = () => {
  const [tokenDisplayStates, setTokenDisplayStates] = useState<TokenDisplayStates>({});
  const [deployStatus, setDeployStatus] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);

  const [toggleCopied, setToggleCopied] = useState<Boolean | null>(false)

  const handleTokenDisplay = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Connect to Metamask or other wallet provider
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      await web3Provider.send("eth_requestAccounts", []);

      // Get signer for transaction
      const signer = await web3Provider.getSigner();

      // Prepare contract deployment
      const factory = new ethers.ContractFactory(MyToken.abi, MyToken.bytecode, signer);

      // Deploy the contract
      const { tokenTicker, tokenName, supply } = tokenDisplayStates;
      const transaction = await factory.getDeployTransaction(tokenName!, tokenTicker!, supply!);
      setDeployStatus("Deploying. Please wait...");

      const txResponse = await signer.sendTransaction(transaction);

      // Wait for the transaction to be mined
      const receipt = await txResponse.wait();

      // Check if receipt is valid before accessing contractAddress
      if (receipt && receipt.contractAddress) {
        setDeployStatus("Successfully deployed");
        setContractAddress(receipt.contractAddress);
      } else {
        setDeployStatus("Failed to deploy. Transaction receipt not available.");
        setContractAddress(null);
      }
    } catch (error) {
      console.error("Error deploying contract:", error);
      setDeployStatus("Failed to deploy. Check console for details.");
      setContractAddress(null);
    }
  };


  const handleCopy = () => {
    if (contractAddress) {
      navigator.clipboard.writeText(contractAddress);
      setToggleCopied(e => !e)
      setTimeout(() => {
        setToggleCopied(e => !e)
      }, 1000)
    }
    
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <div className="flex justify-center items-center py-12 flex-wrap md:gap-4 gap-2">
        <div
          className={`md:text-xl text-lg border border-white px-8 py-3 rounded-3xl cursor-pointer bg-blue-700`}

        >
          Token Deploy
        </div>
      </div>

      {/* Token Display */}
      <div className="flex justify-center items-center md:mt-8 mt-3 w-full px-4">
        <form onSubmit={handleTokenDisplay} className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Token Ticker"
            value={tokenDisplayStates.tokenTicker || ""}
            onChange={(e) => {
              setTokenDisplayStates({
                ...tokenDisplayStates,
                tokenTicker: e.target.value.toLocaleUpperCase(),
              });
            }}
            required
          />
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Token Name"
            value={tokenDisplayStates.tokenName || ""}
            onChange={(e) => {
              setTokenDisplayStates({
                ...tokenDisplayStates,
                tokenName: e.target.value,
              });
            }}
            required
          />
          <input
            type="number"
            className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Supply"
            value={tokenDisplayStates.supply || ""}
            onChange={(e) => {
              setTokenDisplayStates({
                ...tokenDisplayStates,
                supply: parseInt(e.target.value),
              });
            }}
            required
          />
          <button type="submit" className="w-full py-2 px-4 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded focus:outline-none focus:shadow-outline">
            Deploy Token
          </button>
          {/* Deployment Status */}
          {deployStatus && (
            <div className="mt-4 p-4 bg-gray-700 rounded-lg text-center">
              <p>{deployStatus}</p>
              {contractAddress && (
                <>

                  <div className="flex justify-center items-center gap-2 mt-2">
                    <p className="overflow-hidden">
                      Contract deployed at: {contractAddress.slice(0, 30) + "..."}
                    </p>
                    <FaCopy className="cursor-pointer" size={20} onClick={handleCopy} />
                  </div>

                  <div>
                    {
                      toggleCopied && <p className="text-green-500">Copied to clipboard</p>
                    }
                  </div>

                </>
              )}

            </div>
          )}
        </form>
      </div>



    </div>
  );
};

export default MainPage;
