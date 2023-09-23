import * as cfdjs from "cfd-js";

export function CreateKeyPair() {
  const reqJson: cfdjs.CreateKeyPairRequest = {
    wif: false,
  };
  return cfdjs.CreateKeyPair(reqJson);
}

export function GetPubkeyFromPrivkey(privkey: string) {
  const reqPrivKey = {
    privkey,
    isCompressed: true,
  };

  return cfdjs.GetPubkeyFromPrivkey(reqPrivKey).pubkey;
}

export function GetSchnorrPubkeyFromPrivkey(privkey: string) {
  const reqPrivKey = {
    privkey,
  };

  return cfdjs.GetSchnorrPubkeyFromPrivkey(reqPrivKey).pubkey;
}