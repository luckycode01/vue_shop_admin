import request from "@/utils/request";
export default {
  reqRightsList(type) {
    return request.get("/rights/" + type);
  },
  // 获取角色列表
  // roles
  reqRolesDataList() {
    return request.get("/roles");
  },
  //获取角色
  reqRolesById(id) {
    return request.get(`/roles/${id}`);
  },
  // 添加或修改角色
  submitRoleForm({ roleId, roleName, roleDesc }) {
    if (roleId) {
      return request.put(`roles/${roleId}`, { roleName, roleDesc });
    } else {
      return request.post("roles", { roleName, roleDesc });
    }
  },
  deleteRoles(id) {
    return request.delete(`roles/${id}`);
  }
};
