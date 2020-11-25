layui.use(['element', 'layer', 'form','table'], function () {
  var element = layui.element;
  var layer = layui.layer;
  var form = layui.form;
  var table = layui.table;
  var $ = layui.$;
  var _tools = {
    startProgress: function () {
      let startTime = new Date().getTime()
      _tools.progress(startTime)
    },
    progress: function (startTime) {
      //模拟loading
      var totalTime = maxSubPath / speed;
      let timer = setInterval(function () {
        let time = new Date().getTime()
        n = (time - startTime) / totalTime / 10;
        if (n > 100) {
          n = 100;
          clearInterval(timer);
        }
        element.progress('progress', n + '%');
      }, 1000);
    },
    messageComfirm: function () {
      var comfirmDom = `
        <form class="layui-form" style="padding: 10px;" action="" style="margin: 20px 0;">
          <div class="layui-form-item">
            <label class="layui-form-label">选择任务最佳方案</label>
            <div class="layui-input-block" style="margin-left: 145px;">
                <input type="radio" name="taskProgramme" value="1" title="资源最少">
                <input type="radio" name="taskProgramme" value="2" title="时间最少">
            </div>
          </div>
          <div class="layui-form-item">  
            <label class="layui-form-label">选择派出设备</label>
            <div class="layui-input-block" style="margin-left: 145px;">
                <input type="radio" name="taskEquipment" value="1" title="优先派出无人机">
                <input type="radio" name="taskEquipment" value="2" title="优先派出无人船">
                <input type="radio" name="taskEquipment" value="3" title="优先派出无人潜艇">
            </div>
          </div>
          <div class="layui-form-item">  
            <label class="layui-form-label">选择任务类型</label>
            <div class="layui-input-block" style="margin-left: 145px;">
                <input type="radio" name="taskType" value="1" title="探测">
                <input type="radio" name="taskType" value="2" title="围捕">
                <input type="radio" name="taskType" value="3" title="打击">
            </div>
          </div>
        </form>
        `
      layer.open({
        type: 1
        , title: ['任务方案选择', 'font-size:18px;']
        , offset: '300px'
        , area: ['450px', '350px']
        , content: comfirmDom
        , btnAlign: 'c'
        , shadeClose: true
        , resize: false
        ,success: function(layero, index){
          $(`input[name="taskProgramme"][value=${taskProgramme}]`).prop("checked",true);
          $(`input[name="taskEquipment"][value=${taskEquipment}]`).prop("checked",true);
          $(`input[name="taskType"][value=${taskType}]`).prop("checked",true);
          form.render();
      }
      ,btn: ['确认']
      ,yes: function(index, layero){
        taskProgramme = Number($('input[name="taskProgramme"]:checked').val());
        taskEquipment = Number($('input[name="taskEquipment"]:checked').val());
        taskType = Number($('input[name="taskType"]:checked').val());
        initTableData(taskEquipment);
        MoveProgress();//动画模拟
        layer.closeAll(); //疯狂模式，关闭所有层
      }
      });
    },

    initTable: function(){
      //console.log(JSON.parse(data))
      table.render({
        elem: '#table'
        ,height: 490
        ,data: tableData //数据接口
        ,page: true //开启分页
        ,cols: [[ //表头
          {
            field: 'id', 
            title: '编号',
            align: 'center',
            width:'65'
          },
          {
            field: 'type', 
            title: '设备种类',
            align: 'center',
            width:'90'
          },
          {
            field: 'target', 
            title: '目标',
            align: 'center',
            width:'90'
          },
          {
            field: 'taskType', 
            title: '任务类型',
            align: 'center',
            width:'88',
            templet: function(d){
              if(d.taskType == 1){
                return "探测";
              }else if(d.taskType == 2){
                return "围捕";
              }else if(d.taskType == 3){
                return "打击";
              }else{
                return "";
              }
            }
          },
          {
            field: 'speed', 
            title: '速度',
            align: 'center',
            width:'63'
          },
          {
            field: 'currentPosition', 
            title: '当前位置',
            align: 'center',
            width:'90'
          },
          {
            field: 'load', 
            title: '负载',
            align: 'center',
            width:'63'
          },
          {
            field: 'spendTime', 
            title: '时间',
            align: 'center',
            width:'63'
          },
          {
            field: 'timeLeft', 
            title: '剩余时间',
            align: 'center',
            width:'87'
          },
          {
            field: 'status', 
            title: '状态',
            align: 'center',
            width:'77',
            templet: function(d){
              if(d.status == "未启用"){
                return '<span style="color: #5FB878;">未启用</span>';
              }else if(d.status = "任务中"){
                return '<span style="color: #FF5722;">任务中</span>';
              }else{
                return "";
              }
            }
          },
        ]]
      });
    }
  }
  window.tools = _tools;
  initTableData(taskEquipment)
});