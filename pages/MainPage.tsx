// pages/index.tsx

import React, { useState } from "react";
import { ethers } from "ethers"; // Import ethers.js for Ethereum interactions
import MyToken from "./MyToken.json"; // Import your contract ABI and bytecode JSON

interface TokenDisplayStates {
  tokenTicker?: string;
  tokenName?: string;
  supply?: number;
}

interface MultisenderStates {
  contractAddress?: string;
  noOfUsers?: number;
  addressesAmounts?: string;
}

const MainPage: React.FC = () => {
  const [tokenDisplayStates, setTokenDisplayStates] = useState<TokenDisplayStates>({});
  const [multisenderStates, setMultisenderStates] = useState<MultisenderStates>({});
  const [deployStatus, setDeployStatus] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [pageState, setPageState] = useState<"1" | "2">("1"); // State for managing different sections

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

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <div className="flex justify-center items-center py-12 flex-wrap md:gap-4 gap-2">
        <div
          onClick={() => setPageState("1")}
          className={`md:text-xl text-xs border border-white px-6 py-3 rounded-3xl cursor-pointer ${
            pageState === "1" ? "bg-gray-700" : ""
          }`}
        >
          Token Display
        </div>
        <div className="border-white border md:w-44 w-16 block"></div>

        <div
          onClick={() => setPageState("2")}
          className={`md:text-xl text-xs border border-white px-6 py-3 rounded-3xl cursor-pointer ${
            pageState === "2" ? "bg-gray-700" : ""
          }`}
        >
          Multisender
        </div>
      </div>

      {/* Token Display */}
      {pageState === "1" && (
        <div className="flex justify-center items-center mt-8 w-full px-4">
          <form
            onSubmit={handleTokenDisplay}
            className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg"
          >
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
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded focus:outline-none focus:shadow-outline"
            >
              Display Token
            </button>
            {/* Deployment Status */}
            {deployStatus && (
              <div className="mt-4 p-4 bg-gray-700 rounded-lg text-center">
                <p>{deployStatus}</p>
                {contractAddress && (
                  <p className="mt-2">Contract deployed at: {contractAddress}</p>
                )}
              </div>
            )}
          </form>
        </div>
      )}

      {/* Multisender */}
      {pageState === "2" && (
        <div className="flex justify-center items-center mt-8 w-full px-4">
          <form
            className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg flex flex-col gap-6 items-center"
          >
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Token's Or NFT's contract address"
              onChange={(e) => {
                setMultisenderStates({
                  ...multisenderStates,
                  contractAddress: e.target.value,
                });
              }}
              required
            />
            <input
              type="number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="No of users to send"
              onChange={(e) => {
                setMultisenderStates({
                  ...multisenderStates,
                  noOfUsers: parseInt(e.target.value),
                });
              }}
              required
            />
            <textarea
              onChange={(e) => {
                setMultisenderStates({
                  ...multisenderStates,
                  addressesAmounts: e.target.value,
                });
              }}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
              placeholder={`Enter in "address, amount" format`}
              required
            ></textarea>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded focus:outline-none focus:shadow-outline"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MainPage;
