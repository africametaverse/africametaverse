import Avatar from "@mui/material/Avatar";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { PagesPaths } from "./Navigator";
interface ButtonProps {
  userAddress: string;
  wallet: BeaconWallet;
  setUserAddress: Dispatch<SetStateAction<string>>;
  setUserBalance: Dispatch<SetStateAction<number>>;
}

const randomPicture = `https://avatars.dicebear.com/api/avataaars/${Math.random()}.svg`;

const DisconnectButton = ({
  userAddress,
  wallet,
  setUserAddress,
  setUserBalance,
}: ButtonProps): JSX.Element => {
  const navigate = useNavigate();

  const disconnectWallet = async (): Promise<void> => {
    setUserAddress("");
    setUserBalance(0);
    console.log("disconnecting wallet");
    await wallet.clearActiveAccount();
    navigate(PagesPaths.WELCOME);
  };

  return (
    <div className='rows'>
      <div className='row'><img src={randomPicture} alt="My Avatar" className="avatar"/></div>
      <div className='row'>{userAddress}</div>
      <div className="row">
      <button className="button" onClick={disconnectWallet}>
          <span>
            <i className="fas fa-wallet"></i>&nbsp; Disconnect wallet
          </span>
        </button>
      </div>
    </div>
  );
};

export default DisconnectButton;
