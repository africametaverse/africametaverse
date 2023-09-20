import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import React from "react";
import { UserContext, UserContextType } from "./App";
import ConnectButton from "./ConnectWallet";

export default function Welcome() {
  const {
    userAddress,
    Tezos,
    setUserAddress,
    setUserBalance,
    wallet,
    nftContratTokenMetadataMap,
  } = React.useContext(UserContext) as UserContextType;
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        py: 6,
        px: 4,
        bgcolor: "#EAEFF1",
        backgroundImage: "url(https://firebasestorage.googleapis.com/v0/b/africametaversemarketplace.appspot.com/o/background.png?alt=media&token=14644283-1c1c-4f5b-9ff7-c6877356f9a0)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden" }}>
        <span>
          Connect your wallet first
          <ConnectButton
            Tezos={Tezos}
            setUserAddress={setUserAddress}
            setUserBalance={setUserBalance}
            wallet={wallet}
            nftContratTokenMetadataMap={nftContratTokenMetadataMap}
          />
        </span>
      </Paper>
    </Box>
  );
}
