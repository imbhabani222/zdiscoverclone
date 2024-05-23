import axios from "axios";
import Cors from "micro-cors";
import { baseUrl } from "../../util/baseUrl";
const cors = Cors({
  allowMethods: ["GET", "POST"],
});
async function getstoredetails(req, res) {
  try {
    const response = await axios.post(baseUrl + "testimonials/", req.body, {
      headers: req.headers,
    });
    return res.json({ data: response?.data });
  } catch (err) {
    return res.json({ data: err, status: false });
  }
}
export default cors(getstoredetails);
