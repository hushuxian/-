$(document).ready(function () {
    function sceneImg(){
        $(".map-sm").css("background-image","url(images/map-sm-bg2.png)");
        $(".map-sm-tit").hide();
        $(".kankan-view").css("display","block");
        $(".toggle-btn").show();
    }
    // 点击侧边导航弹出二级菜单
    $(".dropdown-toggle").click(function(){
        $(this).siblings().toggleClass("active");
        if($(this).parent().siblings().find("ul").hasClass("active")){
            $(this).parent().siblings().find("ul").removeClass("active");
        }
    });
    $(".toggle-btn").click(function(){

        if($(this).hasClass("hide-left-bar")){
            $(".left-bar").animate({
                left:"-458px"
            });
            $(this).removeClass("hide-left-bar").addClass("show-left-bar");
        }else{
            $(".left-bar").animate({
                left:"0"
            });
            $(this).removeClass("show-left-bar").addClass("hide-left-bar");
        }
        
    });
    // 点击二级菜单切换场景图
    $(".company li").click(function(){
        var text=$(this).text();
        var chain=$(this).attr("data-url");
        $("#place").text(text);
        $(".kankan-view").attr("src",chain);
        sceneImg()
    });
    // 点击左上角科技创新发展科技引领未来切换场景图
    $(".map-sm").click(function(){
        $(".map-sm").css("background-image","url(images/map-sm-bg.png)");
        $(".map-sm-tit").show();
        $(".kankan-view").css("display","none");
        $(".left-bar .toggle-btn").hide();
    });

    //点击场景图实现跳转
    $(".map-lg>div>span").click(function () {
        var data_url=$(this).attr("data-url");
        var title=$(this).attr("title");
        $("#place").text(title);
        $(".kankan-view").attr("src",data_url);
        sceneImg()
    })
});