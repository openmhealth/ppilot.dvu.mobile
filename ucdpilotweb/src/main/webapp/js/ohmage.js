ohmage = {}

//ohmage.url = window.location.toString()+'/app'
ohmage.url = 'https://dev.mobilizingcs.org/app'
ohmage.client = 'pain_pilot'
ohmage.campaign_urn = 'urn:campaign:va:pain_pilot'
//ohmage.campaign_urn = 'urn:campaign:va:pain_pilot_2'

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

ohmage.colors =  
    [
    '#237c08','#5a9a08','#94bb0b','#cbda0b',
    '#f1ef0e','#f2cc09','#f29708','#f36408','#f32f05'    
    ]
    
ohmage.categories = [
    'pain','fatigue','sleep','gi','focus','fun'
    ]

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

ohmage.loadData = function(patient){
    $('.spinner').show()
    //alert('auth_token:'+ohmage.token())
    var url = ohmage.url +'/survey_response/read'
    var params = {
        auth_token:ohmage.token(),
        campaign_urn:ohmage.campaign_urn,
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
            if(data.result === "failure"){
                $('.spinner').hide()
                alert('No Data Available, please complete a survey.')
                return
            }else{
                var origCol = $('.col')
                ohmage.data.init(data)
                //--------------------------------------------------------------
                //Daily Results
                var averages = ohmage.data.dailyAverages()
                averages.reverse()
                $.each(averages,function(i, k){
                    var col = $('.'+this.day)
                    if(col.length == 0){
                        col = origCol.clone().insertBefore($('.icons'))
                        col.find('thead tr td').text(this.day.replace('-', '/'))
                        col.addClass(this.day)
                        col.click(function(event){
                            $('.spinner').show()
                            ohmage.detail($(this).find('thead td').text())    
                        });
                    }    
                    $.each(ohmage.categories,function(){
                        editCell(k.day, this, k)
                    })
                })
                //--------------------------------------------------------------
                //Weekly Results
                averages = ohmage.data.weeklyAverages()
                $.each(averages,function(i, k){
                    var col = $('.'+this.day)
                    if(col.length == 0){
                        col = origCol.clone().insertBefore($('.icons'))
                        col.find('thead tr td').text(this.day.replace('-', '/'))
                        col.addClass(this.day)
                        col.click(function(event){
                            $('.spinner').show()
                            ohmage.detail($(this).find('thead td').text())    
                        });    
                    }    
                    $.each(weekPrior(k.day),function(){
                        $.each(ohmage.categories,function(){
                            editCell(k.day, this, k)
                        })
                    })
                })
            }
            $('body').css('width',
                $('.col').length*$('table').width())
            $('.spinner').hide()
        }
    });
}

ohmage.detail = function(day){

    $('#detail').show()
    ohmage.data.getResults(day)
    $('.spinner').hide()
}

function editCell(date, category, data){
    if(isNaN(data[category]))return
    var elm = $('table.'+date+' td.'+category)
    if(elm.length == 0)return;
    
    var clr = elm.css('background-color')

    if(clr == 'rgb(128, 128, 128)'){
        elm.css('background-color',ohmage.colors[data[category]])
    }else{
        $('.hiddenElm').css('background-color',ohmage.colors[data[category]])
        var clr2 = $('.hiddenElm').css('background-color')
        if(clr2 == 'transparent')return
        elm.css('background-color',aveClr(clr, clr2))
    }
}

function weekPrior(date){
    var days = []
    days.push(date)
    var arr = date.split('-')
    var month = arr[0]
    var day = arr[1]
    for(var i=0; i<7; i++){
        var d = day-i;
        if(d < 1){
            days.push((month-1)+'-'+(31 - Math.abs(d)))    
        }else if(d > 31){
            days.push((month+1)+'-'+(31 - Math.abs(d)))    
        }
        else{
            days.push(month+'-'+d)    
        }
    }
    return days
}

function clrArr(clr){
    //rgb(128, 128, 128)
    clr = clr.substring(4,clr.length-1)
    clr = clr.split(',') 
    var c = {}
    c.r = clr[0]
    c.g = clr[1]
    c.b = clr[2]
    c.toString = function(){
        return 'rgb('+this.r+','+this.g+','+this.b+','+')'
    }
    return c
}

function aveClr(c1, c2){
    c1 = clrArr(c1)
    c2 = clrArr(c2)
    var c = {}
    c.r = Math.round((c1.r + c2.r)/2)
    c.g = Math.round((c1.g + c2.g)/2)
    c.b = Math.round((c1.b + c2.b)/2)
    c.toString = function(){
        return 'rgb('+this.r+','+this.g+','+this.b+','+')'
    }
    return c
}

var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
if(isAndroid) {
    console.log = function(string){}
}
ohmage.data = {}
    
ohmage.data.init = function(input){
    var out = 'out: '
    ohmage.data.input = input
    ohmage.data.weeklyAverages = function(){
        var factor = 9
        var averages = []
        $.each(input.data,function(){
            var date = this['timestamp'].replace(/-/g, " ")
            var counts = {
                painAccum:0, 
                painTotal:0,
                fatigueAccum:0, 
                fatigueTotal:0,
                sleepAccum:0, 
                sleepTotal:0,
                giAccum:0, 
                giTotal:0,
                focusAccum:0, 
                focusTotal:1,
                funAccum:0, 
                funTotal:1
            }
            var average = {
                day:dateFormat(date,'m-dd')
            }
            $.each(this.responses,function(i,k){
                out += i
                var accum = this.prompt_response/
                Object.keys(this.prompt_choice_glossary).length
                if(i === 'painInterference'){
                    counts.focusAccum += accum
                }else if(i === 'phq2_1'){
                    counts.funAccum += accum
                }
                else if(i.indexOf('pain')!=-1 || i.indexOf('Pain')!=-1){
                    counts.painTotal++
                    if(i === 'briefPainInventory')
                        counts.painAccum += (1-accum)
                    else
                        counts.painAccum += accum
                }else if(i.indexOf('sleep')!=-1){
                    counts.sleepTotal++
                    counts.sleepAccum += accum
                }
            })
            average.pain = counts.painAccum/counts.painTotal
            average.focus = counts.focusAccum/counts.focusTotal
            average.fun = counts.funAccum/counts.funTotal
            average.sleep = counts.sleepAccum/counts.sleepTotal
            average.fatigue = counts.fatigueAccum/counts.fatigueTotal
            average.gi = counts.giAccum/counts.giTotal
            $.each(average, function(i,k){
                if(i !== 'day')
                    average[i] = Math.round(this*factor)
            })
            averages.push(average)
        })
        
        return averages
    }
    
    ohmage.data.dailyAverages = function(){
        var factor = 9
        var averages = []
        $.each(input.data,function(){
            var date = this['timestamp'].replace(/-/g, " ")
            var counts = {
                fatigueAccum:0, 
                fatigueTotal:0,
                giAccum:0, 
                giTotal:0,
                focusAccum:0, 
                focusTotal:1
            }
            var average = {
                day:dateFormat(date,'m-dd')
            }
            $.each(this.responses,function(i,k){
                out += i
                var accum = this.prompt_response/
                Object.keys(this.prompt_choice_glossary).length
                if(i === 'cognition'){
                    focus.focusAccum += accum
                }else if(i === 'constiation'){
                    counts.giAccum += accum
                    counts.giTotal ++
                }else if(i === 'drowsiness'){
                    counts.fatigueAccum += accum
                    counts.fatigueTotal ++
                }else if(i === 'fatigue'){
                    counts.fatigueAccum += accum
                    counts.fatigueTotal ++
                }else if(i === 'nausea'){
                    counts.giAccum += accum
                    counts.giTotal ++
                }
            })
            average.pain = counts.painAccum/counts.painTotal
            average.focus = counts.focusAccum/counts.focusTotal
            average.fun = counts.funAccum/counts.funTotal
            average.sleep = counts.sleepAccum/counts.sleepTotal
            average.fatigue = counts.fatigueAccum/counts.fatigueTotal
            average.gi = counts.giAccum/counts.giTotal
            $.each(average, function(i,k){
                if(i !== 'day')
                    average[i] = Math.round(this*factor)
            })
            averages.push(average)
        })
        return averages
    }
    
    ohmage.data.getResults = function(day){
        var detail = $('#detail')
        detail.html('')
        var header = $('<h1><span class=\'back\'>&laquo;back</span>'+day+'</h1>')
        header.click(function(){
            detail.hide()
        })
        detail.append(header)
        $.each(input.data,function(){
            var date = this['timestamp'].replace(/-/g, " ")
            date = dateFormat(date,'m/dd')
            if(date === day){
                detail.append($('<div class=\'surveyTitle\'>'+this.survey_title+'</div>'))
                var ul = $('<ul>')
                $.each(this.responses,function(i,k){
                    var li = $('<li>')
                    var num = this.prompt_response / 
                    Object.keys(this.prompt_choice_glossary).length
                    num = Math.round(num*9)
                    if(this.prompt_index == 9)
                        num = 9 - num
                    li.css('background-color', ohmage.colors[num])
                    li.append('<span class =\'question\'>'+this.prompt_text+'<span>')
                    li.append('<span class =\'answer\'>'+this.prompt_response+'<span>')
                    ul.append(li)
                })
                detail.append(ul)
            }
        })
    }
    
}//end init function