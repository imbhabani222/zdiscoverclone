import axios from "axios";
import Cors from "micro-cors";
import { baseUrl } from "../../util/baseUrl";
const cors = Cors({
  allowMethods: ["POST"],
});
async function createSubscription(req, res) {
  // try {
  console.log("datresponse");
  await axios
    .post(`${baseUrl}create-subscription`, req.body, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(async (data) => {
      return res.json({ data: data?.data, status: true });
    })
    .catch((err) => {
      console.log(err?.response);
      return res.json({
        msg: err?.response?.data?.message,
        status: false,
      });
    });
}
export default cors(createSubscription);
