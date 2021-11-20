import request from "@/utils/request";
export default {
  reqGetGoodsList(data) {
    return request.get("goods", { params: data });
  }
};
