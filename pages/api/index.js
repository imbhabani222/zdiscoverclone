import axios from "axios";
import Cors from "micro-cors";
import { baseUrl } from "../../util/baseUrl";
const cors = Cors({
  allowMethods: ["POST", "GET"],
});
async function Api(req, res) {
  console.log("//////", req);
        const payload = {
          "contact": "9937979468",
          "type": "phone"
        };
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        try {
           const result = await axios.post(baseUrl+'send-otp',
                payload,
                config
            );
    return result
      .status(200)
      .json({ msg: "successfully fetched", status: 1, data: result});
  } catch (e) {
    return res.json({
      message: "false",
      status: 0,
      data: e,
    });
  }
}
export default cors(Api);














