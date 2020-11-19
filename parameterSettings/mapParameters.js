layui.use(['layer','form'], function(){
    var layer = layui.layer;
    var form = layui.form;
    var mapDom =  `
    <form class="layui-form" style="padding: 10px;" action="" style="margin: 20px 0;">
        <div class="layui-form-item">
            <label class="layui-form-label">收搜范围</label>
            <div class="layui-input-block">
                <input type="text" name="area_y" lay-verify="title" autocomplete="off" placeholder="默认范围800" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">无人机收搜范围长</label>
            <div class="layui-input-block">
                <input type="text" name="height_Y" lay-verify="title" autocomplete="off" placeholder="默认收搜长40" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">无人机收搜范围宽</label>
            <div class="layui-input-block">
                <input type="text" name="width_X" lay-verify="title" autocomplete="off" placeholder="默认收搜宽40" class="layui-input">
            </div>
        </div>
    </form>
    `
    $('#mapBtn').click(function(){
        layer.open({
            type: 1
            ,title: ['区域设置', 'font-size:18px;']
            ,offset:  '300px'
            ,area: ['400px', '300px']
            ,content: mapDom
            ,btnAlign: 'c'
            ,shadeClose:true
            ,resize:false
            ,success: function(layero, index){
                form.render();
                $('input[name="area_y"]').val(area_x);
                $('input[name="area_y"]').val(area_y);
                $('input[name="height_Y"]').val(height_Y);
                $('input[name="width_X"]').val(width_X);
            }
            ,btn: ['确认', '重置']
            ,yes: function(index, layero){
                area_x = Number($('input[name="area_y"]').val());
                area_y = Number($('input[name="area_y"]').val());
                height_Y = Number($('input[name="height_Y"]').val());
                width_X = Number($('input[name="width_X"]').val());
                area_x = Math.ceil(area_x / width_X) * width_X;
                area_y = Math.ceil(area_y / height_Y) * height_Y;
                drawGrid();
                layer.closeAll(); //疯狂模式，关闭所有层
            }
            ,btn2: function(index, layero){
                $('input[name="area_y"]').val(800);
                $('input[name="area_y"]').val(800);
                $('input[name="height_Y"]').val(40);
                $('input[name="width_X"]').val(40);
                return false;
            }
        });
        return false;
    })

    var resDom =  `
    <form class="layui-form" style="padding: 10px;" action="" style="margin: 20px 0;">
        <div class="layui-form-item">
            <label class="layui-form-label">无人平台数量</label>
            <div class="layui-input-block">
                <input type="text" name="total" lay-verify="number" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">无人机数量</label>
            <div class="layui-input-block">
                <input type="text" name="drones" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">无人船数量</label>
            <div class="layui-input-block">
                <input type="text" name="ship" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">无人潜艇数量</label>
            <div class="layui-input-block">
                <input type="text" name="submarine" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">探测资源数量</label>
            <div class="layui-input-block">
                <input type="text" name="surveyRescue" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">围捕资源数量</label>
            <div class="layui-input-block">
                <input type="text" name="roundUpRescue" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">打击资源数量</label>
            <div class="layui-input-block">
                <input type="text" name="attackRescue" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
    </form>
    `
    $('#resBtn').click(function(){
        layer.open({
            type: 1
            ,title: ['资源设置', 'font-size:18px;']
            ,offset:  '300px'
            ,area: ['500px', '500px']
            ,content: resDom
            ,btnAlign: 'c'
            ,shadeClose:true
            ,resize:false
            ,success: function(layero, index){
                form.render();
                $('input[name="total"]').val(total);
                $('input[name="drones"]').val(drones);
                $('input[name="ship"]').val(ship);
                $('input[name="submarine"]').val(submarine);
                $('input[name="surveyRescue"]').val(surveyRescue);
                $('input[name="roundUpRescue"]').val(roundUpRescue);
                $('input[name="attackRescue"]').val(attackRescue);
                
            }
            ,btn: ['确认', '重置']
            ,yes: function(index, layero){
                $('#status').text("");
                total = Number($('input[name="total"]').val());
                drones = Number($('input[name="drones"]').val());
                ship = Number($('input[name="ship"]').val());
                submarine = Number($('input[name="submarine"]').val());
                surveyRescue = Number($('input[name="surveyRescue"]').val());
                roundUpRescue = Number($('input[name="roundUpRescue"]').val());
                attackRescue = Number($('input[name="attackRescue"]').val());
                running = false;
                layer.closeAll(); //疯狂模式，关闭所有层
            }
            ,btn2: function(index, layero){
                $('#status').text("");
                $('input[name="total"]').val(10);
                $('input[name="drones"]').val(0);
                $('input[name="ship"]').val(0);
                $('input[name="submarine"]').val(10);
                $('input[name="surveyRescue"]').val(10);
                $('input[name="roundUpRescue"]').val(10);
                $('input[name="attackRescue"]').val(10);
                running = false;
                return false;
            }
        });
        return false;
    })
    var resParametersDom =  `
    <form class="layui-form" style="padding: 10px;" action="" style="margin: 20px 0;">
        <div class="layui-form-item">
            <label class="layui-form-label">无人机速度</label>
            <div class="layui-input-block">
                <input type="text" name="droneSpeed" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">无人机最大航行时间</label>
            <div class="layui-input-block">
                <input type="text" name="droneMaxTime" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">无人机最大负载</label>
            <div class="layui-input-block">
                <input type="text" name="droneMaxLoad" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
         <div class="layui-form-item">
            <label class="layui-form-label">无人船速度</label>
            <div class="layui-input-block">
                <input type="text" name="shipSpeed" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">无人船最大航行距离</label>
            <div class="layui-input-block">
                <input type="text" name="shipMaxTime" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">无人船最大负载</label>
            <div class="layui-input-block">
                <input type="text" name="shipMaxLoad" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">无人潜艇速度</label>
            <div class="layui-input-block">
                <input type="text" name="submarineSpeed" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">无人潜艇最大航行距离</label>
            <div class="layui-input-block">
                <input type="text" name="submarineMaxTiem" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">无人潜艇最大负载</label>
            <div class="layui-input-block">
                <input type="text" name="submarineMaxLoad" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
    </form>
    `
    $('#resParametersBtn').click(function(){
        layer.open({
            type: 1
            ,title: ['资源参数设置', 'font-size:18px;']
            ,area: ['500px', '665px']
            ,content: resParametersDom
            ,btnAlign: 'c'
            ,shadeClose:true
            ,resize:false
            ,success: function(layero, index){
                form.render();
                $('input[name="droneSpeed"]').val(droneSpeed);
                $('input[name="droneMaxTime"]').val(droneMaxTime);
                $('input[name="droneMaxLoad"]').val(droneMaxLoad);
                $('input[name="shipSpeed"]').val(shipSpeed);
                $('input[name="shipMaxTime"]').val(shipMaxTime);
                $('input[name="shipMaxLoad"]').val(shipMaxLoad);
                $('input[name="submarineSpeed"]').val(submarineSpeed);
                $('input[name="submarineMaxTiem"]').val(submarineMaxTiem);
                $('input[name="submarineMaxLoad"]').val(submarineMaxLoad);
            }
            ,btn: ['确认', '重置']
            ,yes: function(index, layero){
                droneSpeed = Number($('input[name="droneSpeed"]').val());
                droneMaxTime = Number($('input[name="droneMaxTime"]').val());
                droneMaxLoad = Number($('input[name="droneMaxLoad"]').val());
                shipSpeed = Number($('input[name="shipSpeed"]').val());
                shipMaxTime = Number($('input[name="shipMaxTime"]').val());
                shipMaxLoad = Number($('input[name="shipMaxLoad"]').val());
                submarineSpeed = Number($('input[name="submarineSpeed"]').val());
                submarineMaxTiem = Number($('input[name="submarineMaxTiem"]').val());
                submarineMaxLoad = Number($('input[name="submarineMaxLoad"]').val());
                layer.closeAll(); //疯狂模式，关闭所有层
            }
            ,btn2: function(index, layero){
                $('input[name="droneSpeed"]').val(0.2);
                $('input[name="droneMaxTime"]').val(1000);
                $('input[name="droneMaxLoad"]').val(2);
                $('input[name="shipSpeed"]').val(0.2);
                $('input[name="shipMaxTime"]').val(1000);
                $('input[name="shipMaxLoad"]').val(2);
                $('input[name="submarineSpeed"]').val(0.2);
                $('input[name="submarineMaxTiem"]').val(1000);
                $('input[name="submarineMaxLoad"]').val(2);
                return false;
            }
        });
        return false;
    })

    var taskDom =  `
    <form class="layui-form" style="padding: 10px;" action="" style="margin: 20px 0;">
        <div class="layui-form-item">
            <label class="layui-form-label">探测任务最小完成条件</label>
            <div class="layui-input-block">
                <input type="radio" name="surveyRequirement" value="1" title="1架设备">
                <input type="radio" name="surveyRequirement" value="2" title="2架设备">
                <input type="radio" name="surveyRequirement" value="3" title="3架设备">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">探测任务所需时间</label>
            <div class="layui-input-block">
                <input type="text" name="surveyTime" lay-verify="number" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">围捕任务最小完成条件</label>
            <div class="layui-input-block">
                <input type="radio" name="roundUpRequirement" value="1" title="1架设备">
                <input type="radio" name="roundUpRequirement" value="2" title="2架设备">
                <input type="radio" name="roundUpRequirement" value="3" title="3架设备">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">围捕任务所需时间</label>
            <div class="layui-input-block">
                <input type="text" name="roundUpTime" lay-verify="number" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">打击任务最小完成条件</label>
            <div class="layui-input-block">
                <input type="radio" name="attackRequirement" value="1" title="1架设备">
                <input type="radio" name="attackRequirement" value="2" title="2架设备">
                <input type="radio" name="attackRequirement" value="3" title="3架设备">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">打击任务所需时间</label>
            <div class="layui-input-block">
                <input type="text" name="attackTime" lay-verify="number" autocomplete="off" class="layui-input">
            </div>
        </div>
    </form>
    `
    $('#taskBtn').click(function(){
        layer.open({
            type: 1
            ,title: ['资源参数设置', 'font-size:18px;']
            ,area: ['500px', '550px']
            ,content: taskDom
            ,btnAlign: 'c'
            ,shadeClose:true
            ,resize:false
            ,success: function(layero, index){
                $(`input[name="surveyRequirement"][value=${surveyRequirement}]`).prop("checked",true);
                $(`input[name="roundUpRequirement"][value=${roundUpRequirement}]`).prop("checked",true);
                $(`input[name="attackRequirement"][value=${attackRequirement}]`).prop("checked",true);
                $('input[name="surveyTime"]').val(surveyTime);
                $('input[name="roundUpTime"]').val(roundUpTime);
                $('input[name="attackTime"]').val(attackTime);
                form.render();
            }
            ,btn: ['确认', '重置']
            ,yes: function(index, layero){
                surveyRequirement = Number($('input[name="surveyRequirement"]:checked').val());
                roundUpRequirement = Number($('input[name="roundUpRequirement"]:checked').val());
                attackRequirement = Number($('input[name="attackRequirement"]:checked').val());
                surveyTime = Number($('input[name="surveyTime"]').val());
                roundUpTime = Number($('input[name="roundUpTime"]').val());
                attackTime = Number($('input[name="attackTime"]').val());
                layer.closeAll(); //疯狂模式，关闭所有层
            }
            ,btn2: function(index, layero){
                $(`input[name="surveyRequirement"][value='1']`).prop("checked",true);
                $(`input[name="roundUpRequirement"][value='2']`).prop("checked",true);
                $(`input[name="attackRequirement"][value='3']`).prop("checked",true);
                $('input[name="surveyTime"]').val(0);
                $('input[name="roundUpTime"]').val(0);
                $('input[name="attackTime"]').val(0);
                form.render();
                return false;
            }
        });
        return false;
    })
}); 
