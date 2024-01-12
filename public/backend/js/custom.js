$(document).ready(function () {
    var ckbAll = $(".cbAll");
    var fmAdmin = $("#zt-form");

    // CKEDITOR
    if ($('textarea#content_ck').length) {
        CKEDITOR.replace('content_ck');
    }

    //call active menu
    activeMenu();

    //check selectbox
    change_form_action("#zt-form .slbAction", "#zt-form","#btn-action");

    //check all
    ckbAll.click(function () {
        $('input:checkbox').not(this).prop('checked', this.checked);
        if ($(this).is(':checked')) {
            $(".ordering").attr("name", "ordering");
        }else{
           
            $(".ordering").removeAttr("name");
        }
        
    });
    // hiden notify
    hiddenNotify(".close-btn");



    $("input[name=cid]").click(function () {
        if ($(this).is(':checked')) {
            $(this).parents("tr").find('.ordering').attr("name", "ordering");
        }else{
            $(this).parents("tr").find('.ordering').removeAttr("name");
        }
    });
    
    // CONFIRM DELETE
    $('a.btn-delete').on('click', () => {
        if (!confirm("Are you sure you want to delete this item?")) return false;
    });

    // CONFIRM DELETE
    $('a.btn-force').on('click', () => {
        if (!confirm("Are you sure you want to FORCE this item?")) return false;
        if (!confirm("SURE?")) return false;
    });

    //active menu function
    function activeMenu() {
        var arrPathname = window.location.pathname.split('/');
        var pattern = (typeof arrPathname[2] !== 'undefined') ? arrPathname[2] : '';

        if (pattern != '') {
            $('#side-menu li a').each(function (index) {
                var subject = $(this).attr("href");
                if (subject != "#" && subject.search(pattern) > 0) {
                    $(this).closest("li").addClass("active");
                    if ($(this).parents("ul").length > 1) {
                        $("#side-menu ul").addClass('in').css("height", "auto");
                        $("#side-menu ul").parent().addClass('active');
                    }
                    return;
                }
            });
        } else {
            $('#side-menu li').first().addClass("active");
        }
    }

    //
    function change_form_action(slb_selector, form_selector, id_btn_action) {

        var optValue;
        var isDelete = false;
        var isForce = false;
        var pattenCheckDelete = new RegExp("delete", "i");
        var pattenCheckForce = new RegExp("force", "i");
        $(slb_selector).on("change", function () {
            optValue = $(this).val();
            
            
            if(optValue !== "") {
                $(id_btn_action).removeAttr('disabled');
            } else {
                $(id_btn_action).attr('disabled', 'disabled');
            }
            $(form_selector).attr("action", optValue);
        });

        $(form_selector + " .btnAction").on("click", function () {

            isDelete = pattenCheckDelete.test($(slb_selector).val());
            if(isDelete){
                
                var confirmDelete = confirm('Are you really want to delete?');
                if(confirmDelete === false){
                    return;
                }
            }

            isForce = pattenCheckForce.test($(slb_selector).val());
            if(isForce){
                
                var confirmForce1 = confirm('Are you really want to FORCE?');
                var confirmForce2 = confirm('REALLY?');
                if(confirmForce1 === false || confirmForce2 === false ){
                    return;
                }
            }

            var numberOfChecked = $(form_selector + ' input[name="cid"]:checked').length;
            if (numberOfChecked == 0) {
                alert("Please choose some items");
                return;
            } else {
                var flag = false;
                var str = $(slb_selector + " option:selected").attr('data-comfirm');
               
                if (str != undefined) {

                    //Kiểm tra giá trị trả về khi user nhấn nút trên popup
                    flag = confirm(str);
                    if (flag == false) {
                        return flag;
                    } else {
                        $(form_selector).submit();
                    }

                } else {
                    if (optValue != undefined) {
                        $(form_selector).submit();
                    }
                }
            }

        });
    }

    // hidden parent (hidden message notify)
    function hiddenNotify(close_btn_selector){
        $(close_btn_selector).on('click', function(){
            $(this).parent().css({'display':'none'});
        })    
    }

    //group
    $('select[name="group_id"]').change(function (value) {
        $('input[name="group_name"]').val($(this).find(":selected").text());
    });

     //category
     $('select[name="category_id"]').change(function (value) {
        $('input[name="category_name"]').val($(this).find(":selected").text());
    });
    
    //filter group
    $('select[name="filterGroups"]').change((value)=>{
        // lấy các thành phần url
        const path = window.location.pathname.split('/')
        // tạo url mới để filter
        const linkRedirect = '/'+ path[1] + '/' + path[2] + '/filter-group/' + value.target.value
        // gửi link-redirect
        window.location.pathname = linkRedirect
       
    })

    //filter category
    $('select[name="filterCategory"]').change((value)=>{
        // lấy các thành phần url
        const path = window.location.pathname.split('/')
        // tạo url mới để filter
        const linkRedirect = '/'+ path[1] + '/' + path[2] + '/filter-category/' + value.target.value
        // gửi link-redirect
        console.log(linkRedirect);
        window.location.pathname = linkRedirect
       
    })


    //avatar change
    $('input#ImageAvatarUsers').change((value)=>{
        if(value.target){
            if (value.target.files && value.target.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('img#imageid').attr('src',e.target.result)
                    
                }
                reader.readAsDataURL(value.target.files[0]);
            }
        }
       

        })





   //input slug
   $('input[name="slugs"]').change((value)=>{
    
    let slug = value.target.value

    if(slug!==undefined)     
    {
       slug = slug.toLowerCase()
    .replaceAll(' ','-')
    .replace('/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/', 'a')
    .replace('/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/', 'e')
    .replace('/(ì|í|ị|ỉ|ĩ)/', 'i')
    .replace('/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/', 'o')
    .replace('/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/', 'u')
    .replace('/(ỳ|ý|ỵ|ỷ|ỹ)/', 'y')
    .replace('/(đ)/', 'd')
    .replace('/[^a-z0-9-\s]/', '')
    .replace('/([\s]+)/', '-')

       if(slug.slice(-1)==='-') slug=slug.slice(0, -1)
       $('input[name="slug"]').val(slug)

   }else{
item.slug=''}
})





});
