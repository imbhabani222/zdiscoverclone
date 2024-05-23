import axios from "axios";
import Cors from "micro-cors";
import { baseUrl } from "../../util/baseUrl";
const cors = Cors({
  allowMethods: ["POST"],
});
async function verifyotp(req, res) {
  try{
    const response = await axios.post(
      baseUrl + "verify-otp",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.json({status: "success", data: response?.data });
  }catch(error){
    return res.json({data:error, status: false})
  }
}
export default cors(verifyotp);
