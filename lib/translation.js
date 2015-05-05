var dict = {
	"username": "用户名",
	"nickname": "昵称",
	"password": "密码",
	"email":    "邮箱",
	"name":     "名称",
	"content" : "内容"
}

module.exports = function(key) {
	return dict[key];
}