import PaytmChecksum from "paytmchecksum";

export default async function handler(req, res) {
  const receivedData = req.body;

  let paytmChecksum = "";
  let isValidChecksum = false;

  for (let key in receivedData) {
    if (key === "CHECKSUMHASH") {
      paytmChecksum = receivedData[key];
    }
  }

  isValidChecksum = PaytmChecksum.verifySignature(
    receivedData,
    process.env.PAYTM_MKEY,
    paytmChecksum
  );

  if (!isValidChecksum) {
    return res.status(400).send("Checksum mismatch");
  }

  // Verify transaction status from Paytm
  // If success, fulfill order

  res.status(200).json({ status: "success", data: receivedData });
}
