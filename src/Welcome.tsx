import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import React from "react";
import { UserContext, UserContextType } from "./App";
import ConnectButton from "./ConnectWallet";
import { Container } from "@mui/material";

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
        backgroundImage: "url(https://cdn.discordapp.com/attachments/1065680113573826580/1148581500166615062/HighresScreenshot00003.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Paper  className="header" sx={{ maxWidth: 936, margin: "auto", overflow: "hidden" }}>
        <div className="centered-div">
          <img src="Africa_Metaverse_logo_.png" alt="Logo" className="logo" width={650} height={250} />
          <h1 className="title">Bienvenue dans Africa Metaverse NFT MarketPlace</h1>
          <ConnectButton
            Tezos={Tezos}
            setUserAddress={setUserAddress}
            setUserBalance={setUserBalance}
            wallet={wallet}
            nftContratTokenMetadataMap={nftContratTokenMetadataMap}
          />
        </div>
      </Paper>
    </Box>
  );
}
