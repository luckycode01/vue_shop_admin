import request from "@/utils/request";
export default {
  reqRightsList(type) {
    return request.get("/rights/" + type);
  }
};
