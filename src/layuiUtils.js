layui.use(['element', 'layer', 'form'], function () {
  var element = layui.element;
  var layer = layui.layer;
  var form = layui.form;
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
        MoveProgress();//动画模拟
        layer.closeAll(); //疯狂模式，关闭所有层
      }
      });
    }
  }
  window.tools = _tools;
});