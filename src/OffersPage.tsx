import SellIcon from "@mui/icons-material/Sell";
import {
  Avatar,
  Button,
  Card,
  CardActions, CardMedia,
  CardContent,
  CardHeader,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import BigNumber from "bignumber.js";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect } from "react";
import * as yup from "yup";
import { UserContext, UserContextType } from "./App";
import { TransactionInvalidBeaconError } from "./TransactionInvalidBeaconError";
import { address, nat } from "./type-aliases";

const validationSchema = yup.object({
  price: yup
    .number()
    .required("Price is required")
    .positive("ERROR: The number must be greater than 0!"),
  quantity: yup
    .number()
    .required("Quantity is required")
    .positive("ERROR: The number must be greater than 0!"),
});

type Offer = {
  price: nat;
  quantity: nat;
};

export default function OffersPage() {
  const [selectedTokenId, setSelectedTokenId] = React.useState<number>(0);

  let [offersTokenIDMap, setOffersTokenIDMap] = React.useState<Map<nat, Offer>>(
    new Map()
  );
  let [ledgerTokenIDMap, setLedgerTokenIDMap] = React.useState<Map<nat, nat>>(
    new Map()
  );

  const {
    nftContrat,
    nftContratTokenMetadataMap,
    userAddress,
    storage,
    refreshUserContextOnPageReload,
  } = React.useContext(UserContext) as UserContextType;

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      price: 0,
      quantity: 1,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("onSubmit: (values)", values, selectedTokenId);
      sell(selectedTokenId, values.quantity, values.price);
    },
  });

  const initPage = async () => {
    if (storage) {
      console.log("context is not empty, init page now");
      ledgerTokenIDMap = new Map();
      offersTokenIDMap = new Map();

      await Promise.all(
        storage.owner_token_ids.map(async (element) => {
          if (element[0] === userAddress) {
            const ownerBalance = await storage.ledger.get({
              0: userAddress as address,
              1: element[1],
            });
            if (ownerBalance != BigNumber(0))
              ledgerTokenIDMap.set(element[1], ownerBalance);
            const ownerOffers = await storage.offers.get({
              0: userAddress as address,
              1: element[1],
            });
            if (ownerOffers && ownerOffers.quantity != BigNumber(0))
              offersTokenIDMap.set(element[1], ownerOffers);

            console.log(
              "found for " +
              element[0] +
              " on token_id " +
              element[1] +
              " with balance " +
              ownerBalance
            );
          } else {
            console.log("skip to next owner");
          }
        })
      );
      setLedgerTokenIDMap(new Map(ledgerTokenIDMap)); //force refresh
      setOffersTokenIDMap(new Map(offersTokenIDMap)); //force refresh

      console.log("ledgerTokenIDMap", ledgerTokenIDMap);
    } else {
      console.log("context is empty, wait for parent and retry ...");
    }
  };

  useEffect(() => {
    (async () => {
      console.log("after a storage changed");
      await initPage();
    })();
  }, [storage]);

  useEffect(() => {
    (async () => {
      console.log("on Page init");
      await initPage();
    })();
  }, []);

  const sell = async (token_id: number, quantity: number, price: number) => {
    try {
      const op = await nftContrat?.methods
        .sell(
          BigNumber(token_id) as nat,
          BigNumber(quantity) as nat,
          BigNumber(price * 1000000) as nat //to mutez
        )
        .send();

      await op?.confirmation(2);

      enqueueSnackbar(
        "Assets collection (token_id=" +
        token_id +
        ") offer for " +
        quantity +
        " units at price of " +
        price +
        " XTZ",
        { variant: "success" }
      );

      refreshUserContextOnPageReload(); //force all app to refresh the context
    } catch (error) {
      console.table(`Error: ${JSON.stringify(error, null, 2)}`);
      let tibe: TransactionInvalidBeaconError =
        new TransactionInvalidBeaconError(error);
      enqueueSnackbar(tibe.data_message, {
        variant: "error",
        autoHideDuration: 10000,
      });
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        py: 6,
        px: 4,
        bgcolor: "#eaeff1",
        backgroundImage:
          "url(https://cdn.discordapp.com/attachments/1065680113573826580/1148581500166615062/HighresScreenshot00003.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Paper sx={{
        bgcolor: 'background.paper',
        boxShadow: 1,
        borderRadius: 2,
        p: 2,
        minWidth: 150,
      }}>
        {nftContratTokenMetadataMap.size != 0 ? (
          Array.from(nftContratTokenMetadataMap!.entries()).map(
            ([token_id, item]) => (
              <Card key={userAddress + "-" + token_id.toString()}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "purple" }} aria-label="recipe">
                      {token_id}
                    </Avatar>
                  }
                  title={item.name}
                  subheader={item.symbol}
                />

                <CardMedia
                  component="img"
                  height="80"
                  width="70"
                  image={item.thumbnailUri?.replace(
                    "ipfs://",
                    "https://gateway.pinata.cloud/ipfs/"
                  )}
                />


                <CardActions disableSpacing>
                  <form
                    onSubmit={(values) => {
                      setSelectedTokenId(token_id);
                      formik.handleSubmit(values);
                    }}
                  >
                    <TextField
                      name="quantity"
                      label="quantity"
                      placeholder="Enter a quantity"
                      variant="standard"
                      type="number"
                      value={formik.values.quantity}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.quantity && Boolean(formik.errors.quantity)
                      }
                      helperText={
                        formik.touched.quantity && formik.errors.quantity
                      }
                    />
                    <TextField
                      name="price"
                      label="price/Assets (XTZ)"
                      placeholder="Enter a price"
                      variant="standard"
                      type="number"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      error={formik.touched.price && Boolean(formik.errors.price)}
                      helperText={formik.touched.price && formik.errors.price}
                    />
                    <Button type="submit" aria-label="add to favorites">
                      <SellIcon /> SELL
                    </Button>
                  </form>
                </CardActions>

              </Card>
            )
          )
        ) : (
          <Fragment />
        )}

      </Paper>
    </Box>
  );
}
