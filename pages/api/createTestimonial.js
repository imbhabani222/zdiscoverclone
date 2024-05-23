import axios from "axios";
import Cors from "micro-cors";
import { baseUrl } from "../../util/baseUrl";
const cors = Cors({
  allowMethods: ["POST"],
});
async function createTestimonial(req, res) {
  try {
    const response = await axios.post(`${baseUrl}add-testimonial`, req.body, {
      headers: req.headers,
    });
    return res.json({ data: response?.data, status: true });
  } catch (err) {
    return res.json({data:err, status: false });
  }
}
export default cors(createTestimonial);
