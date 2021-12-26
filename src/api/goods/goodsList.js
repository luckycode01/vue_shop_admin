import request from "@/utils/request";
export default {
  reqGetGoodsList(data) {
    return request.get("goods", { params: data });
  },
  reqAddGoodsList(data, id) {
    if (id) {
      return request.put("goods/" + id, data);
    }
    return request.post("goods", data);
  },
  reqGetGoodsDetail(id) {
    return request.get("goods/" + id);
  },
  reqDeleteGoods(id) {
    return request.delete("goods/" + id);
  }
};
