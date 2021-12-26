import Vue from "vue";
// 时间格式化过滤器
import moment from "moment";
Vue.filter("dateFormat", function(value) {
  return moment(value).format("YYYY-MM-DD HH:mm:ss");
});
