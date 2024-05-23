import axios from "axios";
import Cors from "micro-cors";
import { baseUrl } from "../../util/baseUrl";
const cors = Cors({
  allowMethods: ["GET", "POST"],
});
async function login(req, res) {
  //if (req.method === "POST") {
  try {
    const response = await axios.post(baseUrl + "send-otp", req.body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.json({
      msg: "otp sent successfullyy",
      data: response?.data?.data,
      status: true,
    });
  } catch (err) {
    return res.json({ data: err, status: false });
  }
}
export default cors(login);
