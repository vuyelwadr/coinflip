import { useState } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";

export default function App() {
  const contractAddress = "0x788b3b5dA54aE10F0E5bE485733A2CB9c3874612";
  var result = "";
  // const [contractListened, setContractListened] = useState();
  const [contractInfo] = useState({
    address: contractAddress,
  });
  const [balanceInfo, setBalanceInfo] = useState({
    contract_balance: "-",
  });
  const [userInfo, setUserInfo] = useState({
    choice: "-",
  });

  const getMyBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(contractInfo.address, abi, signer);

    // const signerAddress = await signer.getAddress();
    const contract_balance = await erc20.getContractBalance();
    const user_balance = await erc20.getUserBalance();
    // save balance in ETH not Wei
    setBalanceInfo({
      contract_balance: String(contract_balance / 1000000000000000000), 
      user_balance: String(user_balance / 1000000000000000000),
    });
  };

  const flip = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(contractInfo.address, abi, signer);
    // bet 0.01 eth on heads or tails 
    if (userInfo.choice === "Heads") {
      result = await erc20.flip(1, { value: ethers.utils.parseEther("0.01") });
    } else if (userInfo.choice === "Tails") {
      result = await erc20.flip(0, { value: ethers.utils.parseEther("0.01") });
    }
    console.log(result);
  };

  const heads = () => {
    setUserInfo({
      choice: "Heads",
    });
    flip();
  };

  const tails = () => {
    setUserInfo({
      choice: "Tails",
    });
    flip();
  };

  return (
    <div>
      <div>
        <div id="balances">
          <button onClick={getMyBalance} type="submit">
            Get my balance
          </button>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Contract Address</th>
                  <th>Contract Balance</th>
                  <th>User Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>{contractInfo.address}</th>
                  <td>{balanceInfo.contract_balance}</td>
                  <td>{balanceInfo.user_balance}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="game">
        <div>
          <p>Click heads or tails button to bet 0.01Eth on heads or tails </p>
          <button onClick={heads}>Heads</button>
          <button onClick={tails}>Tails</button> <br />
          check balance after to see if you were wrong or correct
        </div>
      </div>
    </div>
  );
}
