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
}//end init function