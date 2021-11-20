import request from "@/utils/request";
export default {
  reqGetParamsList(id, data) {
    return request.get(`categories/${id}/attributes`, { params: data });
  }
};
