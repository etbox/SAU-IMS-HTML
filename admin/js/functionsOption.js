
var srcOfHead = "./view/admin/img/头像logo.png";
var sender = "校社联";
var title = "校社联管理系统建好啦";
var address = "各位社长、成员、同学们：";

var limit = '{"l":"0","r":"10"}';//l和r是后台获取公告量的头和尾
/**
 * [createList 生成目录列表元素]
 * @param  {[String]} title [description]
 * @param  {[String]} text  [description]
 * @param  {[String]} time1 [description]
 * @param  {[int]} i     [description]
 * @return {[object]} input     [列表元素节点]
 */
function createList(title, text, time, i) {
  if (title.length > 8) {
    title = title.substring(0,7) + "…";
  }
  var annousBox = document.getElementById("announcementList");
  var li = createEle("li",  "content");
  li.id = i;
  li.onclick = Events;

  var tokenDom = createEle("div", "fll", "token");
  tokenDom.id = "token"+ i ;

  var titleDom = createEle("h1", "fll", "title");
  titleDom.innerHTML = title;

  var checkboxDom = createEle("div", "flr", "rlt", "checkbox");
  var input = document.createElement("input");
  input.type = "checkbox";
  input.name = i;
  checkboxDom.appendChild(input);

  var timeDom = createEle("div", "rlt", "time");
  timeDom.innerHTML = time;

  addChilds(li, tokenDom, titleDom, checkboxDom, timeDom);
  annousBox.appendChild(li);

  function Events() {
    var tokenD = document.getElementById("token" + this.id);
    if (tokenD.className == "untoken") {
      tokenD.className == "token";
      $.POST();
    }
    $.post("./index.php?c=AdminMain&a=getNoticeById", {"nid": i}, function(data, status) {
      clearAll("rightBar");
      eval("data = " + data);
      createRight(srcOfHead, data['name'], data['time'], data['title'], address, data['text'])
    })
    checkedStyle(this);
  }
  return input;
} //createList

/**
 * [createRight 生成公告内容部分]
 * @param  {[String]} srcOfHead [头像图片的路径]
 * @param  {[String]} sender    [公告发布者]
 * @param  {[String]} time      [发布时间]
 * @param  {[String]} title     [公告题目]
 * @param  {[String]} address  [公告接受者]
 * @param  {[String]} text      [正文]
 * @return {[none]}           [description]
 */
function createRight(srcOfHead, sender, time, title, address, text) {
  var rightBar = document.getElementById("rightBar");
  var header = createEle("header", "mainHeader");
  var userHead = createEle("img", "userHead", "fll");
  userHead.src = srcOfHead;
  userHead.alt = "用户头像"
  var mainSender = createEle("h1", "mainSender", "fll");
  mainSender.innerHTML = sender;
  var mainTime = createEle("div", "mainTime", "fll");
  mainTime.innerHTML = time;
  var deleteButton = createEle("a", "deleteButton", "fll");
  deleteButton.href = "javascript:;"
  var mainDelete = createEle("img", "mainDelete");
  mainDelete.src = "./view/admin/img/删除logo.png";
  mainDelete.alt = "删除";
  var deleteText = createEle("span", "deleteText", "rlt");
  deleteText.innerHTML = "删除";
  addChilds(deleteButton, mainDelete, deleteText);
  addChilds(header, userHead, mainSender, mainTime, deleteButton);

  var main = createEle("section", "main");
  var mainTitle = createEle("h3", "mainTitle");
  mainTitle.innerHTML = title;
  var mainContent = createEle("div", "mainContent");
  //var towho = createEle("p", "toWho");//就是这里偷了一个大懒！！！
  //towho.innerHTML = address;
  var ti2 = createEle("p");
  ti2.innerHTML = text.replace(/\s/g, "&nbsp;");
  addChilds(mainContent, ti2);
  addChilds(main, mainTitle, mainContent);
  addChilds(rightBar, header, main);
}

/**
 * [clearChecked 删除选中的列表项]
 * @return {[none]} []
 * 用到外界变量：checkboxs
 */
function clearChecked() {
  // 此数组用于储存要删除的节点id
  var checkedIds = '{';
  // 此数组用于储存要删除的节点
  var checkedobj = new Array;
  var announcementList = document.getElementById("announcementList");
  var checkboxs = announcementList.getElementsByTagName("input");
  var j = 0;
  for (var i = 0; i < checkboxs.length; i++) {
    if (checkboxs[i].checked) {
      checkedIds += '"'+j+'"'+':'+checkboxs[i].name+',';
      checkedobj[j] = document.getElementById(checkboxs[i].name)
      j++;
    } //if
  } //for
  checkedIds = checkedIds.substring(0, checkedIds.length-1);//搞不懂为什么要删掉最后一个
  checkedIds += '}';
  $.post("./index.php?c=AdminMain&a=deleteNotices", {"noticeIds":checkedIds}, function(data, status) {
    if (status == "success") {
      var announcementList = document.getElementById("announcementList");
      for (var i = 0; i < checkedobj.length; i++) {
        announcementList.removeChild(checkedobj[i]);
      } //for
    } else {
      alert("删除出错");
    }//if
  })
} //clearChecked


/**
 * 搜索
 * @return none
 */
function search() {
  var val = $("#searchField").val();
  if (val) {
    var search = '{"title":"' + val + '","l":"0","r":"10"}';
    $.post("./index.php?c=AdminMain&a=searchNotices", {"search": search}, function(data, status) {
      if (data != "false") {//之前这里是"false"。。。怪不得不会出现查询出错
        clearAll("announcementList");
        eval("data =" + data);
        if (data.length != 0) {
          var len = data.length;
          for (var i = 0; i < len; i++) {
            createList(data[i]['title'], data[i]['text'], data[i]['time'], data[i]['id']);
          }
        } else {
          alert('查找不到与"'+val+'"有关的公告');
        }
      } else {
        alert("查询出错");
      }
    });
  }
}


/**
 * 刷新
 * @return none
 */
function refresh() {
  clearAll("announcementList");
   $.post("./index.php?c=AdminMain&a=getSendNotices", {"limit":limit}, function(data, status) {
    if (status == "success") {
      clearAll("announcementList");
      eval("data =" + data);
      var len = data.length
      for (var i = 0; i < len; i++) {
        createList(data[i]['title'], data[i]['text'], data[i]['time'], data[i]['id']);
      }
    } else {
      alert("刷新出错");
    }
  });
}


//新建
function newNotice() {
  clearAll("rightBar");
  var boxDom = document.getElementById("rightBar");
  //生成编辑区域
  var header = createEle("header", "mainHeader");
  var newAnnouncement = createEle("h3","newAnnouncement")
  newAnnouncement.innerHTML = "创建公告";
  var main = createEle("section", "main");
  var titleDom = createEle("input", "newTitle");
  // titleDom.contentEditable = true;
  titleDom.placeholder = "标题";
  var textDom = createEle("div", "newText");//为了产生placeholder，此处用了textarea而不是div
  textDom.contentEditable = true;
  textDom.innerHTML = "各位社长、成员、同学们：";
  var btnDom = createEle("input", "submit");//原本这里就是个按钮好吧。强行改成div
  btnDom.type = "button";
  btnDom.id = "submitNew";
  btnDom.value = "发布";
  btnDom.onclick = btnClick;
  function btnClick() {
    var title = titleDom.value;
    var text = textDom.innerHTML;//要对内容文本进行处理，使得其可以换行
    var time = getNowFormatDate();
    var notice = '{"title":"'+title+'","text":"'+text+'","time":"'+time+'"}';
    $.post("./index.php?c=AdminMain&a=addNotice", {"notice":notice}, function(data, status) {
      if (data) {
        refresh();
        eval("data = "+ data)
        clearAll("rightBar");
        createRight(srcOfHead, sender, time, title, address, text);
        //获取不到节点对象？？？
        // 在回调函数内赋值全局变量，需要改为同步？？？
        var newCheck = document.getElementById(data);
        checkedStyle(newCheck);
      }
    });
  }
  addChilds(header,newAnnouncement);
  addChilds(main,titleDom,textDom,btnDom);
  addChilds(boxDom,header,main);
  // $.post("text.php",)
}
