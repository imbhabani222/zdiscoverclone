import axios from "axios";
import Cors from "micro-cors";
import { baseUrl } from "../../../util/baseUrl";
const cors = Cors({
  allowMethods: ["GET"],
});
async function industryType(req, res) {
  try {
    const response = await axios.get(
      `${baseUrl}store-details/${req.query.id}`,
      {
        headers: req.headers,
      }
    );
    return res.json({ data: response?.data, status: true });
  } catch (err) {
    return res.json({ data: err, status: false });
  }
}
export default cors(industryType);
