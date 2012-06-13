ohmage = {}

//ohmage.url = window.location.toString()+'/app'
ohmage.url = 'https://dev.mobilizingcs.org/app'
ohmage.client = 'pain_pilot'

ohmage.token = function(tok){
    if(tok)
        localStorage.setItem('ohmage.token',tok)
    return localStorage.getItem('ohmage.token')
}
ohmage.username = function(tok){
    if(tok)
        localStorage.setItem('ohmage.username',tok)
    return localStorage.getItem('ohmage.username')
}

ohmage.password = function(password){
    if(password)
        localStorage.setItem('ohmage.password',password)
    return localStorage.getItem('ohmage.password')
}


ohmage.login = function(user, password, callbacks){
    ohmage.username(user)
    var url = ohmage.url + '/user/auth_token'
    $.post(url,{
        user:user,
        password:password,
        client:ohmage.client
    },function(res){
        res = $.parseJSON(res)
        if(res.result == 'success'){
            ohmage.token(res.token)
            if(callbacks && callbacks.success)
                callbacks.success() 
        }
        else{
            $.each(res.errors,function(){
                console.log(this)
            })
            if(callbacks && callbacks.failure)
                callbacks.failure()
        }
    })
}

ohmage.loadData = function(patient, callback){
    alert('auth_token:'+ohmage.token())
    var url = ohmage.url +'/survey_response/read'
    var params = {
        auth_token:ohmage.token(),
        campaign_urn:'urn:campaign:va:pain_pilot_2',
        client:ohmage.client,
        output_format:'json-rows',
        user_list:patient,
        column_list:'urn:ohmage:user:id,urn:ohmage:context:timestamp,urn:ohmage:context:timezone,urn:ohmage:context:location:latitude,urn:ohmage:context:location:longitude,urn:ohmage:context:location:status,urn:ohmage:survey:id,urn:ohmage:survey:title,urn:ohmage:survey:description,urn:ohmage:survey:privacy_state,urn:ohmage:prompt:response',
        survey_id_list:'urn:ohmage:special:all',
        return_id:'true',
        colapse:'true'
    }
    $.ajax({
        url: url,
        data:params,
        type:'POST',
        success: function(res) {
            var data = JSON.parse(res)
            console.log(data)
            if(data.result === "failure"){
                alert('No Data Available:'+data.errors[0].text)
                return
            }
            if(callback)
                callback()
        }
    });
}
