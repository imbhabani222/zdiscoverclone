import axios from "axios";
import Cors from "micro-cors";
import { baseUrl } from "../../util/baseUrl";
const cors = Cors({
  allowMethods: ["POST"],
});
async function logoUpload(req, res) {
    const formdata = new FormData();
    formdata.append("file",req.body.json())
  try {const response = await axios.post(
    `${baseUrl}upload-logo`,
    formdata,
    {
      headers: req.headers,
    }
  );
  return res.json({ data: response?.data, status:true });
}
catch(err){
    return ({data:err, status:false});
}
}
export default cors(logoUpload);
