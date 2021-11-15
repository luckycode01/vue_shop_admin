import request from "@/utils/request";

export function login(data) {
  return request({
    url: "login",
    method: "post",
    data
  });
}

// export function getInfo(token) {
//   return request({
//     url: "/vue-admin-template/user/info",
//     method: "get",
//     params: { token }
//   });
// }

// export function logout() {
//   return request({
//     url: "/vue-admin-template/user/logout",
//     method: "post"
//   });
// }

export default {
  // 获取用户列表
  getUserList(data) {
    return request.get("/users", { params: data });
  },
  // 添加用户
  addUser(data) {
    return request.post("/users", data);
  },
  // 根据id获取用户信息
  getUserInfoById(id) {
    return request.get(`/users/${id}`);
  },
  //提交修改用户数据
  putUserInfo(id, data) {
    return request.put(`/users/${id}`, data);
  },
  // 删除用户
  deleteUser(id) {
    return request.delete(`/users/${id}`);
  },
  // 改变用户状态
  changeState(uId, type) {
    return request.put(`users/${uId}/state/${type}`);
  }
};
