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
            <label class="layui-form-label">无人平台收搜范围长</label>
            <div class="layui-input-block">
                <input type="text" name="height_Y" lay-verify="title" autocomplete="off" placeholder="默认收搜长40" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">无人平台收搜范围宽</label>
            <div class="layui-input-block">
                <input type="text" name="width_X" lay-verify="title" autocomplete="off" placeholder="默认收搜宽40" class="layui-input">
            </div>
        </div>
        <div style="text-align: center" class="layui-word-aux"><label>比例：1=100m</label></div>
    </form>
    `
    $('#mapBtn').click(function(){
        layer.open({
            type: 1
            ,title: ['区域设置', 'font-size:18px;']
            ,offset:  '300px'
            ,area: ['400px', '350px']
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
                if(Number($('input[name="area_y"]').val()) <= 0 || Number($('input[name="height_Y"]').val()) <= 0 || Number($('input[name="width_X"]').val()) <= 0){
                    layer.msg('参数不能小于0！', {icon: 5}); 
                    return;
                }
                area_x = Number($('input[name="area_y"]').val());
                area_y = Number($('input[name="area_y"]').val());
                height_Y = Number($('input[name="height_Y"]').val());
                width_X = Number($('input[name="width_X"]').val());
                area_x = Math.ceil(area_x / width_X) * width_X;
                area_y = Math.ceil(area_y / height_Y) * height_Y;
                points = [];
                running = false;
                drawGrid();
                //改变比例
                ratio = area_y / 800;

                varData.area_x = area_x;
                varData.area_y = area_y;
                varData.height_Y = height_Y;
                varData.width_X = width_X;
                let data = JSON.stringify(varData);
                fs.writeFileSync('./render/var.json', data);
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
            <label class="layui-form-label">无人艇数量</label>
            <div class="layui-input-block">
                <input type="text" name="ship" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">无人潜航器数量</label>
            <div class="layui-input-block">
                <input type="text" name="submarine" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">总资源数量</label>
            <div class="layui-input-block">
                <input type="text" name="resourcesTotal" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">探测资源数量</label>
            <div class="layui-input-block">
                <input type="text" name="surveyResources" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
       
        <div class="layui-form-item">
            <label class="layui-form-label">打击资源数量</label>
            <div class="layui-input-block">
                <input type="text" name="attackResources" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
    </form>
    `
    // <div class="layui-form-item">
    // <label class="layui-form-label">围捕资源数量</label>
    // <div class="layui-input-block">
    //     <input type="text" name="roundUpResources" lay-verify="title" autocomplete="off" class="layui-input">
    // </div>
    // </div>
    $('#resBtn').click(function(){
        layer.open({
            type: 1
            ,title: ['设置设备资源', 'font-size:18px;']
            ,offset:  '300px'
            ,area: ['500px', '530px']
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
                $('input[name="resourcesTotal"]').val(resourcesTotal);
                $('input[name="surveyResources"]').val(surveyResources);
                //$('input[name="roundUpResources"]').val(roundUpResources);
                $('input[name="attackResources"]').val(attackResources);
                
            }
            ,btn: ['确认', '重置']
            ,yes: function(index, layero){
                if(Number($('input[name="total"]').val()) < 6){
                    layer.msg('无人平台数不能少于6！', {icon: 5}); 
                    return;
                }
                if(Number($('input[name="total"]').val()) != Number($('input[name="drones"]').val()) + 
                Number($('input[name="ship"]').val()) + Number($('input[name="submarine"]').val())){
                    layer.msg('无人平台数需要等于各个平台数相加！', {icon: 5}); 
                    return;
                }else if(Number($('input[name="resourcesTotal"]').val()) !=  Number($('input[name="surveyResources"]').val()) + 
                Number($('input[name="attackResources"]').val())){
                    layer.msg('总资源数需要等于各个资源数相加！', {icon: 5}); 
                    return;
                }
                if(Number($('input[name="total"]').val()) <= 0 ||Number($('input[name="drones"]').val()) < 0 || Number($('input[name="ship"]').val()) < 0
                || Number($('input[name="submarine"]').val()) < 0 || Number($('input[name="resourcesTotal"]').val()) < 0 ||
                Number($('input[name="surveyResources"]').val()) < 0 || Number($('input[name="attackResources"]').val()) < 0){
                    layer.msg('参数不能小于0！', {icon: 5}); 
                    return;
                }
                
                $('#status').text("");
                total = Number($('input[name="total"]').val());
                drones = Number($('input[name="drones"]').val());
                ship = Number($('input[name="ship"]').val());
                submarine = Number($('input[name="submarine"]').val());
                resourcesTotal = Number($('input[name="resourcesTotal"]').val());
                surveyResources = Number($('input[name="surveyResources"]').val());
                //roundUpResources = Number($('input[name="roundUpResources"]').val());
                attackResources = Number($('input[name="attackResources"]').val());
                running = false;
                //更新数据表格
                initTableData();

                varData.total = total;
                varData.drones = drones;
                varData.ship = ship;
                varData.submarine = submarine;
                varData.resourcesTotal = resourcesTotal;
                varData.surveyResources = surveyResources;
                varData.attackResources = attackResources;
                let data = JSON.stringify(varData);
                fs.writeFileSync('./render/var.json', data);

                layer.closeAll(); //疯狂模式，关闭所有层
            }
            ,btn2: function(index, layero){
                $('#status').text("");
                $('input[name="total"]').val(20);
                $('input[name="drones"]').val(10);
                $('input[name="ship"]').val(5);
                $('input[name="submarine"]').val(5);
                $('input[name="resourcesTotal"]').val(1000);
                $('input[name="surveyResources"]').val(500);
                //$('input[name="roundUpResources"]').val(333);
                $('input[name="attackResources"]').val(500);
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
            <label class="layui-form-label">无人艇速度</label>
            <div class="layui-input-block">
                <input type="text" name="shipSpeed" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">无人艇最大航行时间</label>
            <div class="layui-input-block">
                <input type="text" name="shipMaxTime" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">无人艇最大负载</label>
            <div class="layui-input-block">
                <input type="text" name="shipMaxLoad" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">无人潜航器速度</label>
            <div class="layui-input-block">
                <input type="text" name="submarineSpeed" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">无人潜航器最大航行时间</label>
            <div class="layui-input-block">
                <input type="text" name="submarineMaxTime" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">无人潜航器最大负载</label>
            <div class="layui-input-block">
                <input type="text" name="submarineMaxLoad" lay-verify="title" autocomplete="off" class="layui-input">
            </div>
        </div>
    </form>
    `
    $('#resParametersBtn').click(function(){
        layer.open({
            type: 1
            ,title: ['设置设备资源参数', 'font-size:18px;']
            ,area: ['500px', '685px']
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
                $('input[name="submarineMaxTime"]').val(submarineMaxTime);
                $('input[name="submarineMaxLoad"]').val(submarineMaxLoad);
            }
            ,btn: ['确认', '重置']
            ,yes: function(index, layero){
                if(Number($('input[name="droneSpeed"]').val()) < 40 ||  Number($('input[name="shipSpeed"]').val()) < 40
                || Number($('input[name="submarineSpeed"]').val()) < 40){
                    layer.msg('设备的速度不能低于40！请重新设置', {icon: 5}); 
                    return;
                }
                if(Number($('input[name="droneSpeed"]').val()) > 300 ||  Number($('input[name="shipSpeed"]').val()) > 300
                || Number($('input[name="submarineSpeed"]').val()) > 300){
                    layer.msg('设备的速度不能高于300！请重新设置', {icon: 5}); 
                    return;
                }
                if(Number($('input[name="droneMaxTime"]').val()) < 15 || Number($('input[name="shipMaxTime"]').val()) < 15
                || Number($('input[name="submarineMaxTime"]').val()) < 15){
                    layer.msg('设备的最大运行时间不能低于15！请重新设置', {icon: 5}); 
                    return;
                }
                droneSpeed = Number($('input[name="droneSpeed"]').val());
                droneMaxTime = Number($('input[name="droneMaxTime"]').val());
                droneMaxLoad = Number($('input[name="droneMaxLoad"]').val());
                shipSpeed = Number($('input[name="shipSpeed"]').val());
                shipMaxTime = Number($('input[name="shipMaxTime"]').val());
                shipMaxLoad = Number($('input[name="shipMaxLoad"]').val());
                submarineSpeed = Number($('input[name="submarineSpeed"]').val());
                submarineMaxTime = Number($('input[name="submarineMaxTime"]').val());
                submarineMaxLoad = Number($('input[name="submarineMaxLoad"]').val());
                initTableData();

                varData.droneSpeed = droneSpeed;
                varData.droneMaxTime = droneMaxTime;
                varData.droneMaxLoad = droneMaxLoad;
                varData.shipSpeed = shipSpeed;
                varData.shipMaxTime = shipMaxTime;
                varData.shipMaxLoad = shipMaxLoad;
                varData.submarineSpeed = submarineSpeed;
                varData.submarineMaxTime = submarineMaxTime;
                varData.submarineMaxLoad = submarineMaxLoad;
                let data = JSON.stringify(varData);
                fs.writeFileSync('./render/var.json', data);

                layer.closeAll(); //疯狂模式，关闭所有层
            }
            ,btn2: function(index, layero){
                $('input[name="droneSpeed"]').val(200);
                $('input[name="droneMaxTime"]').val(20);
                $('input[name="droneMaxLoad"]').val(40);
                $('input[name="shipSpeed"]').val(200);
                $('input[name="shipMaxTime"]').val(20);
                $('input[name="shipMaxLoad"]').val(40);
                $('input[name="submarineSpeed"]').val(200);
                $('input[name="submarineMaxTime"]').val(20);
                $('input[name="submarineMaxLoad"]').val(40);
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
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">探测任务所需时间</label>
            <div class="layui-input-block">
                <input type="text" name="surveyTime" lay-verify="number" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">探测任务所需资源</label>
            <div class="layui-input-block">
                <input type="text" name="surveyUseResrouce" lay-verify="number" autocomplete="off" class="layui-input">
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
        <div class="layui-form-item">
            <label class="layui-form-label">打击任务所需资源</label>
            <div class="layui-input-block">
                <input type="text" name="attackUseResrouce" lay-verify="number" autocomplete="off" class="layui-input">
            </div>
        </div>
    </form>
    `
    $('#taskBtn').click(function(){
        layer.open({
            type: 1
            ,title: ['设置任务的完成条件', 'font-size:18px;']
            ,area: ['500px', '630px']
            ,content: taskDom
            ,btnAlign: 'c'
            ,shadeClose:true
            ,resize:false
            ,success: function(layero, index){
                $(`input[name="surveyRequirement"][value=${surveyRequirement}]`).prop("checked",true);
                $(`input[name="roundUpRequirement"][value=${roundUpRequirement}]`).prop("checked",true);
                $(`input[name="attackRequirement"][value=${attackRequirement}]`).prop("checked",true);
                $('input[name="surveyTime"]').val(surveyTime/1000);
                $('input[name="roundUpTime"]').val(roundUpTime/1000);
                $('input[name="attackTime"]').val(attackTime/1000);
                $('input[name="surveyUseResrouce"]').val(surveyUseResrouce);
                $('input[name="attackUseResrouce"]').val(attackUseResrouce);
                form.render();
            }
            ,btn: ['确认', '重置']
            ,yes: function(index, layero){
                if(droneMaxLoad * Number($('input[name="attackRequirement"]:checked').val()) < Number($('input[name="attackUseResrouce"]').val())){
                    layer.msg('设备没有足够资源去完成任务！请重新设置', {icon: 5}); 
                    return;
                }
                if(Number($('input[name="surveyTime"]').val()) > 3 || Number($('input[name="roundUpTime"]').val()) > 3
                || Number($('input[name="attackTime"]').val()) > 3){
                    layer.msg('设备完成任务时间不能超过3！请重新设置', {icon: 5}); 
                    return;
                }
                if(Number($('input[name="surveyUseResrouce"]').val()) > 10 || Number($('input[name="attackUseResrouce"]').val()) > 10){
                    layer.msg('设备完成任务消耗资源不能超过10！请重新设置', {icon: 5}); 
                    return;
                }
                if(Number($('input[name="surveyTime"]').val())  < 0|| Number($('input[name="roundUpTime"]').val()) < 0
                || Number($('input[name="attackTime"]').val()) < 0 || Number($('input[name="surveyUseResrouce"]').val()) < 0
                ||  Number($('input[name="attackUseResrouce"]').val()) < 0){
                    layer.msg('参数不能小于0！请重新设置', {icon: 5}); 
                    return;
                }
                // if(Number($('input[name="surveyRequirement"]:checked').val()) > 1){
                //     layer.msg('探测时间不能超过1秒！请重新设置', {icon: 5}); 
                //     return;
                // }
                surveyRequirement = Number($('input[name="surveyRequirement"]:checked').val());
                roundUpRequirement = Number($('input[name="roundUpRequirement"]:checked').val());
                attackRequirement = Number($('input[name="attackRequirement"]:checked').val());
                surveyTime = Number($('input[name="surveyTime"]').val()) * 1000;
                roundUpTime = Number($('input[name="roundUpTime"]').val()) * 1000;
                attackTime = Number($('input[name="attackTime"]').val()) * 1000;
                surveyUseResrouce = Number($('input[name="surveyUseResrouce"]').val());
                attackUseResrouce = Number($('input[name="attackUseResrouce"]').val());

                varData.surveyRequirement = surveyRequirement;
                varData.roundUpRequirement = roundUpRequirement;
                varData.attackRequirement = attackRequirement;
                varData.surveyTime = surveyTime;
                varData.roundUpTime = roundUpTime;
                varData.attackTime = attackTime;
                varData.surveyUseResrouce = surveyUseResrouce;
                varData.attackUseResrouce = attackUseResrouce;
                let data = JSON.stringify(varData);
                fs.writeFileSync('./render/var.json', data);

                layer.closeAll(); //疯狂模式，关闭所有层
            }
            ,btn2: function(index, layero){
                $(`input[name="surveyRequirement"][value='1']`).prop("checked",true);
                $(`input[name="roundUpRequirement"][value='2']`).prop("checked",true);
                $(`input[name="attackRequirement"][value='3']`).prop("checked",true);
                $('input[name="surveyTime"]').val(0);
                $('input[name="roundUpTime"]').val(1);
                $('input[name="attackTime"]').val(1);
                $('input[name="surveyUseResrouce"]').val(1);
                $('input[name="attackUseResrouce"]').val(2);
                form.render();
                return false;
            }
        });
        return false;
    })
}); 
