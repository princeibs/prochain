import "./create.css";
import { useEffect, useState } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { Form, Button } from "react-bootstrap";
import { useNftContract } from "../../hooks/useNftContract";
import { BigNumber, ethers } from "ethers";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useNavigate } from "react-router-dom";
import * as htmlToImage from "html-to-image";
// Import the NFTStorage class and File constructor from the 'nft.storage' package

const Create = () => {
  const { address, connect, performActions } = useContractKit();
  const navigate = useNavigate();
  useEffect(() => {
    if (!address) {
      (async () => {
        await connect();
      })();
    }
  }, [address, connect]);
  const nftContract = useNftContract()

  const [loading, setLoading] = useState(false);
  const [itemName, setItemName] = useState(null);
  const [itemDescription, setItemDescription] = useState(null);
  const [itemImage, setItemImage] = useState(null);
  const [itemPrice, setItemPrice] = useState(null);

  const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

  const NFT_STORAGE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZkMWI3YUY1ZEQyYTNENUUwRmVjNDk5RjdkOEQyN0IxMjVDN2VkMzEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1OTI0MTQxNzYyOSwibmFtZSI6IkJsb2NraGVhZGVyIEhhY2thdGhvbiJ9.lDg66i13ntKdhDv9-NrLa6eF5kL9liegM_7cS2xgs0w";

  const isFormFiled = () => {
    if (
      itemImage === null ||
      itemPrice === null ||
      itemName === null ||
      itemDescription === null
    ) {
      return false;
    } else {
      return true;
    }
  };

  // upload image to IPFS
  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== "undefined") {
      try {
        console.log(file);
        const result = await client.add(file);
        console.log(result);
        setItemImage(`https://ipfs.infura.io/ipfs/${result.path}`);
      } catch (error) {
        console.log("ipfs image upload error: ", error);
      }
    }
  };

  // Mint and NFT then send to market
  const mintThenList = async (result, defaultAccount) => {
    console.log(result.path);
    const tokenUri = `https://ipfs.infura.io/ipfs/${result.path}`;
    console.log("tokenUri: " + tokenUri)
    const tokenPrice = ethers.utils.parseEther(itemPrice.toString());
    const tx = await nftContract.methods.mint(tokenUri, tokenPrice).send({
      from: defaultAccount,
    });
    alert("Successfully minted a new NFT");
    navigate(`/`);
  };

  // Create a new NFT
  const createNewNft = async (e) => {
    e.preventDefault();
    try {
      await performActions(async (kit) => {
        const { defaultAccount } = kit;
        if (!itemImage || !itemPrice || !itemName || !itemDescription) return;
        setLoading(true);
        const result = await client.add(
          JSON.stringify({
            itemImage,
            itemPrice,
            itemName,
            itemDescription,
            owner: address,
          })
        );
        await mintThenList(result, defaultAccount);
      });
    } catch (error) {
      console.log("ipfs uri upload error: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Save image to file storage
  const handleSave = () => {
    const targetNode = document.querySelector(".paper");
    htmlToImage
      .toPng(targetNode)
      .then((dataUrl) => {
        const elem = document.createElement("a");
        elem.setAttribute("href", dataUrl);
        elem.setAttribute("download", "latest_nft");
        document.body.appendChild(elem);
        elem.click();
        elem.remove();
      })
      .catch(function (error) {
        console.error("oops, something went wrong");
      });
  };

  const handleSubmit = async (e) => {
    await createNewNft(e);
  };

  return (
    <div className="create">
      <div className="create_form">Add New Product</div>
      <div className="form-new">
        <div className="form-form">
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setItemName(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea3"
            >
              <Form.Label>Item Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={(e) => setItemDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                onChange={(e) => setItemPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Upload image you just saved</Form.Label>
              <Form.Control type="file" onChange={uploadToIPFS} />
            </Form.Group>
            <Button variant="dark" type="button" onClick={() => navigate("/")}>
              Close
            </Button>
            <Button variant="dark" type="button" onClick={() => handleSave()}>
              Save
            </Button>
            <Button disabled={!isFormFiled()} variant="dark" type="submit">
              Create
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Create;
