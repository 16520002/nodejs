//import statusHelper from './../../../my-app/views/backend/helpers/status'

const changeStatus = (status,id,link) =>{   
    
    $.ajax({
        type:"GET",
        url: link,
        data: `status=${status}&id=${id}`,
        success:function(){
            
            currentStatus = status === 'active' ? 'inactive' : 'active'

            let xhtml = ''
            if(currentStatus == 'active'){
                xhtml =  `<span class="label label-success">${currentStatus}</span>`
            }else{
                xhtml =  `<span class="label label-warning">${currentStatus}</span>`
            }

            $('#statushelperfunc')[0].innerHTML = `
                <a href="javascript:" onclick="changeStatus('${currentStatus}','651fae46845b1b6c38e7a48e','admin/items/change-status/651fae46845b1b6c38e7a48e/${currentStatus}')">
                ${xhtml}
                </a>
            `
           
        }
    }) 

}



