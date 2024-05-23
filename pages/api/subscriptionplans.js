import axios from "axios";
import Cors from "micro-cors";
import { baseUrl } from "../../util/baseUrl";
const cors = Cors({
  allowMethods: ["GET"],
});
async function subscriptionPlan(req, res) {
  try {
    const response = await axios.get(baseUrl + "subscriptionplans", {
      headers: req.headers,
    });
    return res.json({ msg: "fetched", data: response?.data, status: true });
  } catch (err) {
    return res.json({ data: err, status: false });
  }
}
export default cors(subscriptionPlan);
