var manager = {};

manager.genLen = function(name, from, to) {
  if (to) {
    return {
      args: [from, to],
      msg: name + "的长度必须为" + from + "~" + to
    };
  } else {
    return {
      args: from,
      msg: name + "的长度必须为" + from
    };
  }
}

manager.genBool = function(name, bool) {
  return {
    // args: bool,
    msg: "输入的" + name + "不合法"
  };
}

manager.genNotEmpty = function(name) {
  return {
    args: true,
    msg: name + "不能为空"
  }
}

module.exports = manager;