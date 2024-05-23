import axios from "axios";
import Cors from "micro-cors";
import { baseUrl } from "../../util/baseUrl";
const cors = Cors({
  allowMethods: ["POST"],
});
async function getInTouch(req, res) {
  try {
    const response = await axios.post(`${baseUrl}get-in-touch`, req.body, {
      headers: req.headers,
    });
    return res.json({ data: response?.data, status: true });
  } catch (error) {
    return res.json({data:error, status: false });
  }
}
export default cors(getInTouch);
