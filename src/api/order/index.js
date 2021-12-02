import request from "@/utils/request";
export default {
  reqOrdersList(data) {
    return request.get("/orders", { params: data });
  }
};
