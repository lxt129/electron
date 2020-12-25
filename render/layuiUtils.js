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
      var totalTime = maxSubPath / droneSpeed;
      let timer = setInterval(function () {
        let time = new Date().getTime()
        n = (time - startTime) / totalTime / 10;
        console.log(n);
        if (n > 100) {
          n = 100;
          clearInterval(timer);
        }
        element.progress('progress', n + '%');
      }, 1000);
    },

    showLog: function(){
      var showLog = ``;
      for(let i = 0; i < logbookInfo.length;i++){
        showLog += `<p style="margin-top:3px;margin-left:5px;">${logbookInfo[i]}</p>` 
      }
      layer.open({
        type: 1
        , title: ['查看任务执行时序', 'font-size:18px;']
        , offset: '300px'
        , area: ['450px', '350px']
        , content: showLog
        , btnAlign: 'c'
        , shadeClose: true
        , resize: false
        ,success: function(layero, index){
      }
      ,btn: ['确认']
      ,yes: function(index, layero){
        layer.closeAll(); //疯狂模式，关闭所有层
      }
      });
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
        , area: ['450px', '250px']
        , content: comfirmDom
        , btnAlign: 'c'
        , shadeClose: true
        , resize: false
        ,success: function(layero, index){
          $(`input[name="taskProgramme"][value=${taskProgramme}]`).prop("checked",true);
          $(`input[name="taskType"][value=${taskType}]`).prop("checked",true);
          form.render();
      }
      ,btn: ['确认']
      ,yes: function(index, layero){
        taskProgramme = Number($('input[name="taskProgramme"]:checked').val());
        taskType = Number($('input[name="taskType"]:checked').val());
        initTableData(taskEquipment);
        initTableDataTaskType(taskType)
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
        ,limit:50
        ,data: tableData //数据接口
        ,page: false //开启分页
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
            width:'105'
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
    },
    reload: function(){
      table.reload('table', {
        data: tableData //数据接口
      });
    },
    planning:function(){
      var planningDom = `
        <form class="layui-form" style="padding: 10px;" action="" style="margin: 20px 0;">
        <div class="layui-form-item">  
          <label class="layui-form-label">选择优先派出设备</label>
          <div class="layui-input-block" style="margin-left: 145px;">
              <input type="radio" name="taskEquipment" value="1" title="优先派出无人机">
              <input type="radio" name="taskEquipment" value="2" title="优先派出无人艇">
              <input type="radio" name="taskEquipment" value="3" title="优先派出无人潜航器">
          </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">选择规划路径方案</label>
            <div class="layui-input-block" style="margin-left: 145px;">
                <input type="radio" name="planning" value="1" title="智能计算无人平台个数">
                <input type="radio" name="planning" value="2" title="选择无人平台个数">
                <input type="text" name="saleMen" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
          </div>
        </form>
        `
      layer.open({
        type: 1
        , title: ['选择规划路径方案', 'font-size:18px;']
        , offset: '300px'
        , area: ['450px', '370px']
        , content: planningDom
        , btnAlign: 'c'
        , shadeClose: true
        , resize: false
        ,success: function(layero, index){
          $(`input[name="taskEquipment"][value=${taskEquipment}]`).prop("checked",true);
          $(`input[name="planning"][value=${planning}]`).prop("checked",true);
          $('input[name="saleMen"]').val(sales);
          form.render();
      }
      ,btn: ['确认']
      ,yes: function(index, layero){
        taskEquipment = Number($('input[name="taskEquipment"]:checked').val());
        planning = Number($('input[name="planning"]:checked').val());
        saleMen = Number($('input[name="saleMen"]').val());

        initTableData(taskEquipment);
        if (points.length >= 3 && planning == 1) {
          initData();
          GAInitialize();
          while (currentGeneration <= 200) {
            GANextGeneration();
          }
          let thisSpeed = 0;
          let thisMaxTime = 0
          if(taskEquipment === 1){
            thisSpeed = droneSpeed;
            thisMaxTime = droneMaxTime;
          }else if(taskEquipment === 2){
            thisSpeed = shipSpeed;
            thisMaxTime = shipMaxTime;
          }else{
            thisSpeed = submarineSpeed;
            thisMaxTime = submarineMaxTime;
          }
          //判断大致需要的无人设备数量
          SALES_MEN = Math.ceil((routeLenth + (points.length - 1) * thisSpeed * surveyTime/1000) / (thisSpeed * (thisMaxTime * 0.8)));
          initData();
          GAInitialize();
          running = true;
          drawHidden = false;
        }else if(points.length >= 3 && planning == 2){
          SALES_MEN = Number($('input[name="saleMen"]').val());
          initData();
          GAInitialize();
          running = true;
          drawHidden = false;
        }else if(points.length < 3) {
          alert("请在地图上添加更多的目标点!");
        }
        layer.closeAll(); //疯狂模式，关闭所有层
      }
      });
    },
    taskFail:function(){
      layer.alert('无人平台数量过少，请增加无人平台数，或者改变任务方案！', {icon: 5}); 
    }
  }
  window.tools = _tools;
  initTableData(taskEquipment)
});