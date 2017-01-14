
var map = new BMap.Map("map");                              // 创建Map实例
!function(){ //初始化地图模块相关代码
    map.enableScrollWheelZoom();
    map.addControl(new BMap.ScaleControl());                // 添加比例尺控件
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
    map.setCurrentCity("北京");
}();

/**
 * 根据类型的id获取相应的名称
 */
var Util = {
    getFoodCategoryByType: function(type) {
        var food = {
            '1' : "中餐",
            '2' : "火锅",
            '3' : "日料",
            '4' : "西餐",
            '5' : "南亚",
            '6' : "烧烤"
        };
        return food[type];
    },
/**
* 设置Map容器的高度
*/
    setMapHeight: function() {
        var mapBoxHeight = $(window).height()  - $('#pageHeader').height() - $('#pageMiddle').height() - 38;
        $('#mapBox').css({height: mapBoxHeight + 'px'});
    }
};



!function(){
    /**
     * 条件筛选模块
     */
    var filterData = [
        {
            "name"  : "行政区域",
            "value" : "location",
            "data"  : [
                {
                    "name"  : "朝阳",
                    "value" : "朝阳区"
                },
                {
                    "name"  : "海淀",
                    "value" : "海淀"
                },
                {
                    "name"  : "东城",
                    "value" : "东城区"
                },
                {
                    "name"  : "西城",
                    "value" : "西城区"
                },
                {
                    "name"  : "崇文",
                    "value" : "崇文"
                },
                {
                    "name"  : "宣武",
                    "value" : "宣武"
                }
            ]
        },
        {
            "name"  : "人均消费",
            "value" : "price",
            "data"  : [
                {
                    "name"  : "50-200元",
                    "value" : "50,200"
                },
                {
                    "name"  : "200-500元",
                    "value" : "200,500"
                },
                {
                    "name"  : "500元以上",
                    "value" : "500,2000"
                }
            ]
        },
        {
            "name"  : "菜品类型",
            "value" : "foodtype",
            "data"  : [
                {
                    "name"  : "中餐",
                    "value" : "1,1"
                },
                {
                    "name"  : "火锅",
                    "value" : "2,2"
                },
                {
                    "name"  : "日料",
                    "value" : "3,3"
                },
                {
                    "name"  : "西餐",
                    "value" : "4,4"
                },
                {
                    "name"  : "南亚",
                    "value" : "5,5"
                },
                {
                    "name"  : "烧烤",
                    "value" : "6,6"
                }
            ]
        },
        {
            "name"  : "排序方式",
            "value" : "sortresults",
            "data"  : [
                {
                    "name"  : "人均最低",
                    "value" : "price:1"
                },
                {
                    "name"  : "距离最近",
                    "value" : "distance:1"
                },
                {
                     "name"  : "评分最高",
                     "value" : "rate:-1"
                }
            ]
        }
    ];

    for (var i in filterData) { //条件筛选的各个项
        var item = filterData[i],
            data = item.data,
            dl = $('<dl id="' + item.value + '" class="dl-horizontal" value="' + item.value + '"><dt>' + item.name + '：</dt></dl>'),
            ul = $('<ul class="inline"></ul>');
        for(var j in data) { //各个项对应的各详细选项
            var subData = data[j];
            $('<li><a href="###" value = "' + subData.value + '">' + subData.name +'</a></li>').appendTo(ul);
        }
        ul.appendTo($('<dd></dd>')).appendTo(dl);
        dl.appendTo($('#filterBox'));
    }

    // 点击选择项的事件
    $('#filterBox li a').click(function(){
        var type = $(this).parents('dl').attr('value');
        $('#' + type + " li a").removeClass('activate');
        if (!$(this).hasClass('activate')) { //点击的不是当前的选项
            $(this).addClass('activate');
            $('#selectedValue div[type$=' + type + ']').remove(); //当前条件之前选择过的条件删除
            var item = $('<div class="span1" value="' + $(this).attr('value') + '" type="' + type + '"><span>' + $(this).html() + '</span></div>');
            //添加删除按钮
            var deleteBtn = $('<i class="icon-remove"></i>').click(function(){
                $(this).parent().remove();
                $('#' + type + " li a").removeClass('activate');
                keyword = $('#keyword').val();
                searchAction(keyword);
            });
            deleteBtn.appendTo(item);
            item.appendTo('#selectedValue'); //添加当前的筛选条件
            keyword = $('#keyword').val();
            searchAction(keyword);
        }
    });



    var keyword     = "",   //检索关键词
        page        = 0,    //当前页码
        points      = [];   //存储检索出来的结果的坐标数组

    /**
     * 检索模块
     */

    //绑定搜索按钮事件
    $('#searchBtn').bind('click', function(){
        keyword = $('#keyword').val();
        searchAction(keyword);
    });

    //进行检索操作
    function searchAction(keyword, page) {
        page = page || 0;
        var filter = []; //过滤条件
        var sortit = "distance:1";
        $.each($('#selectedValue div'), function(i, item){ //将选中的筛选条件添加到过滤条件参数中
            var type = $(item).attr('type'),
                value = $(item).attr('value');
            if (type == "location") {
                keyword = value + " " + keyword;
            } else if (type == "sortresults"){
                sortit = value;
            }
            else{
                filter.push(type + ':' + value);
            }
        });
        var url = "http://api.map.baidu.com/geosearch/v3/local?callback=?";
        $.getJSON(url, {
            'q'          : keyword, //检索关键字
            'page_index' : page,  //页码
            'filter'     : filter.join('|'),  //过滤条件
            'region'     : '131',  //北京的城市id
            'scope'      : '2',  //显示详细信息
            'location'   : '116.331398,36.897445', //初始位置
            'page_size'  : '5', //每页显示的数量
            'sortby'     : sortit, //排序方式
            'geotable_id': 161851, //pengsu's table id
            'ak'         : 'Dvx1hizsMHzQGKAfYqOHOLGrqFOUttrg'  //pengsu's bmap key
        },function(e) {
            renderList(e, page + 1);
            renderMap(e, page + 1);
        });
    }

    /**
     * 列表/地图模式切换事件
     */
    $('#chgMode').bind('click', function(){
        $('#listBox').toggle('normal');
        $('#mapBox').toggle('normal', function(){
            if ($('#mapBox').is(":visible")) { //单显示地图时候，设置最佳视野
                map.setViewport(points);
            };
        });
    });

    /**
     * 渲染地图+显示结果模块
     */
    function renderMap(res, page) {
        var content = res.contents;
        $('#mapList').html('');
        map.clearOverlays();
        points.length = 0;

        if (content.length == 0) {
            $('#mapList').append($('<p style="border-top:1px solid #DDDDDD;padding-top:10px;text-align:center;font-size:18px;" class="text-warning">' +
                '天呐，竟然没给您找着合适的，换个别的吃吧</p>'));
            return;
        }

        $.each(content, function(i, item){
            var point = new BMap.Point(item.location[0], item.location[1]),
                marker = new BMap.Marker(point);
            points.push(point);
            var tr = $("<tr><td width='75%'><a href='#'>" + item.title + "<a/><br/>" + item.address + "</td><td width='25%'>评分：" + item.rate + "<br/></td></tr>");
            $('#mapList').append(tr);
            map.addOverlay(marker);
        });


        /**
         * 地图模块里的结果分页
         */
        var pagecount = Math.ceil(res.total / 5);
        if (pagecount > 10) {
            pagecount = 10; //最大页数10页
        }
        function PageClick (pageclickednumber) {
            pageclickednumber = parseInt(pageclickednumber);
            $("#pager").pager({ pagenumber: pageclickednumber, pagecount: pagecount, showcount: 5, buttonClickCallback: PageClick });
            searchAction(keyword, pageclickednumber -1);
        }
        $("#mapPager").pager({ pagenumber: page, pagecount: pagecount, showcount:5, buttonClickCallback: PageClick });

        map.setViewport(points);
    };

    /**
     * 渲染列表+显示结果模块
     */
    function renderList(res, page) {
        var content = res.contents;
        $('#listBoby').html('');

        if (content.length == 0) {
            $('#listBoby').append($('<p style="border-top:1px solid #DDDDDD;padding-top:10px;text-align:center;font-size:18px;" class="text-warning">' +
                '天呐，竟然没给您找着合适的，换个别的吃吧</p>'));
            return;
        }

        $.each(content, function(i, item){
            $('#listBoby').append("<tr><td width='13%'><img src='" + item.pic.mid + "' style='width:111px;height:83px;'/></td>" +
                "<td width='67%'><a href='#'>" + item.title + "<a/><br/>" +
                "地址：" + item.address + "<br/>类型：" + Util.getFoodCategoryByType(item.foodtype) + "</td>" +
                "<td width='20%'>" + item.price + " <span>元/人</span><br/><br/>评分：" + item.rate +" </td></tr>");
        });

        /**
         * 列表模块里的结果分页
         */
        var pagecount = Math.ceil(res.total / 5);
        if (pagecount > 10) {
            pagecount = 10;
        }
        function PageClick (pageclickednumber) {
            pageclickednumber = parseInt(pageclickednumber);
            $("#pager").pager({ pagenumber: pageclickednumber, pagecount: pagecount, showcount:5, buttonClickCallback: PageClick });
            searchAction(keyword, pageclickednumber -1);
        }
        $("#pager").pager({ pagenumber: page, pagecount: pagecount, showcount:5, buttonClickCallback: PageClick });
    }

    searchAction(keyword);
}();

$(document).ready(function(){
    Util.setMapHeight();
});
