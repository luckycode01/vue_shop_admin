import request from "@/utils/request";
export default {
  reqGetParamsList(id, data) {
    return request.get(`categories/${id}/attributes`, { params: data });
  },
  reqAddEditParams(id, data, attrid) {
    if (!attrid) {
      return request.post(`categories/${id}/attributes`, data);
    } else {
      return request.put(`categories/${id}/attributes/${attrid}`, data);
    }
  },
  reqDeleteParams(id, attrid) {
    return request.delete(`categories/${id}/attributes/${attrid}`);
  },
  reqByIdSearchParams(id, attrid) {
    return request.get(`categories/${id}/attributes/${attrid}`);
  }
};
