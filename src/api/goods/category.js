import request from "@/utils/request";
export default {
  reqCategoryList(data) {
    return request.get("categories", { params: data });
  },
  reqAddCate(data) {
    return request.post("categories", data);
  },
  reqDeleteCate(id) {
    return request.delete("categories/" + id);
  },
  reqIdSearchCate(id) {
    return request.get("categories/" + id);
  },
  reqIdEditCate(id, data) {
    return request.put("categories/" + id, data);
  }
};
