import { useContract } from "./useContract";
import Prochain from "../contracts/Prochain.json";
import ProchainAddress from "../contracts/Prochain-address.json";

export const useNftContract = () => {
  return useContract(Prochain.abi, ProchainAddress.Prochain);
};
